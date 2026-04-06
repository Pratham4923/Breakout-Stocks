from __future__ import annotations

import asyncio
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, JSONResponse

from app.config import ScannerConfig
from app.scanner import ScannerService

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"


class ConnectionManager:
    def __init__(self) -> None:
        self._connections: set[WebSocket] = set()
        self._lock = asyncio.Lock()

    @property
    def connection_count(self) -> int:
        return len(self._connections)

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._connections.add(websocket)

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self._lock:
            self._connections.discard(websocket)

    async def broadcast(self, payload: dict) -> None:
        stale: list[WebSocket] = []
        async with self._lock:
            targets = list(self._connections)
        for connection in targets:
            try:
                await connection.send_json(payload)
            except Exception:
                stale.append(connection)
        if stale:
            async with self._lock:
                for connection in stale:
                    self._connections.discard(connection)


manager = ConnectionManager()
scanner = ScannerService(ScannerConfig(), manager)


@asynccontextmanager
async def lifespan(_: FastAPI):
    await scanner.start()
    try:
        yield
    finally:
        await scanner.stop()


app = FastAPI(title="Breakout Stocks", lifespan=lifespan)


@app.get("/")
async def dashboard() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/healthz")
async def healthcheck() -> JSONResponse:
    snapshot = await scanner.get_snapshot()
    return JSONResponse({"ok": True, "scanner": snapshot["scanner"]})


@app.get("/api/snapshot")
async def snapshot() -> JSONResponse:
    return JSONResponse(await scanner.get_snapshot())


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await manager.connect(websocket)
    try:
        await websocket.send_json({"type": "snapshot", "data": await scanner.get_snapshot()})
        while True:
            message = await websocket.receive_text()
            if message.strip().lower() == "snapshot":
                await websocket.send_json({"type": "snapshot", "data": await scanner.get_snapshot()})
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception:
        await manager.disconnect(websocket)
