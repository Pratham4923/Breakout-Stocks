from __future__ import annotations

import asyncio
import sqlite3
from contextlib import asynccontextmanager
from datetime import date
from pathlib import Path
from typing import Any

from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.auth import create_user, create_user_token, get_all_users, get_user_by_identifier, verify_password, verify_token
from app.config import ScannerConfig
from app.scanner import ScannerService
from app.video_strategy import analyze_video_strategy, build_strategy_matches

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"
DB_PATH = BASE_DIR / "astraveda.db"


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


class LoginRequest(BaseModel):
    identifier: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    email: str
    phone: str
    password: str
    face_image: str


class JournalEntryRequest(BaseModel):
    token: str
    title: str
    thesis: str
    execution: str
    lesson: str
    tags: str = ""


class WatchlistRequest(BaseModel):
    token: str
    name: str
    symbols: str
    notes: str = ""


class AlertRuleRequest(BaseModel):
    token: str
    name: str
    rule_type: str
    scope: str
    threshold: str
    notes: str = ""


class PlaybookRequest(BaseModel):
    token: str
    title: str
    setup_type: str
    bias: str
    entry_rule: str
    risk_rule: str
    exit_rule: str


class RiskProfileRequest(BaseModel):
    token: str
    account_size: float
    risk_per_trade: float
    max_daily_loss: float
    preferred_rr: float


class VideoStrategyRequest(BaseModel):
    token: str
    url: str


class DisciplineEventRequest(BaseModel):
    token: str
    rule_type: str
    severity: str
    symbol: str = ""
    note: str = ""


class DailyLossStateRequest(BaseModel):
    token: str
    realized_pnl: float
    note: str = ""


class APlusSetupRequest(BaseModel):
    token: str
    title: str
    symbol: str
    setup_type: str
    bias: str
    rationale: str
    context_note: str = ""


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
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/")
@app.get("/index.html")
async def index_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")

@app.get("/login")
@app.get("/login.html")
async def login_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "login.html")

@app.get("/create-account")
@app.get("/create-account.html")
async def create_account_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "create-account.html")

@app.get("/dashboard")
@app.get("/dashboard.html")
async def dashboard_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "dashboard.html")

@app.get("/morning-brief")
@app.get("/morning-brief.html")
async def morning_brief_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "morning-brief.html")

@app.get("/setup-quality")
@app.get("/setup-quality.html")
async def setup_quality_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "setup-quality.html")

@app.get("/trades")
@app.get("/trades.html")
@app.get("/breakouts")
@app.get("/breakouts.html")
@app.get("/breakdowns")
@app.get("/breakdowns.html")
async def trades_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "trades.html")

@app.get("/smc")
@app.get("/smc.html")
async def smc_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "smc.html")

@app.get("/journal")
@app.get("/journal.html")
async def journal_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "journal.html")

@app.get("/discipline")
@app.get("/discipline.html")
async def discipline_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "discipline.html")

@app.get("/daily-loss-lock")
@app.get("/daily-loss-lock.html")
async def daily_loss_lock_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "daily-loss-lock.html")

@app.get("/aplus-archive")
@app.get("/aplus-archive.html")
async def aplus_archive_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "aplus-archive.html")

@app.get("/closing-review")
@app.get("/closing-review.html")
async def closing_review_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "closing-review.html")

@app.get("/confluence-engine")
@app.get("/confluence-engine.html")
async def confluence_engine_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "confluence-engine.html")

@app.get("/trader-scorecard")
@app.get("/trader-scorecard.html")
async def trader_scorecard_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "trader-scorecard.html")

@app.get("/execution-gate")
@app.get("/execution-gate.html")
async def execution_gate_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "execution-gate.html")

@app.get("/capital-allocation")
@app.get("/capital-allocation.html")
async def capital_allocation_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "capital-allocation.html")

@app.get("/desk-restrictions")
@app.get("/desk-restrictions.html")
async def desk_restrictions_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "desk-restrictions.html")

@app.get("/trader-progression")
@app.get("/trader-progression.html")
async def trader_progression_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "trader-progression.html")

@app.get("/session-checklist")
@app.get("/session-checklist.html")
async def session_checklist_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "session-checklist.html")

@app.get("/confidence-ladder")
@app.get("/confidence-ladder.html")
async def confidence_ladder_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "confidence-ladder.html")

@app.get("/focus-board")
@app.get("/focus-board.html")
async def focus_board_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "focus-board.html")

@app.get("/missed-opportunities")
@app.get("/missed-opportunities.html")
async def missed_opportunities_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "missed-opportunities.html")

@app.get("/playbook-coverage")
@app.get("/playbook-coverage.html")
async def playbook_coverage_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "playbook-coverage.html")

@app.get("/edge-stability")
@app.get("/edge-stability.html")
async def edge_stability_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "edge-stability.html")

@app.get("/review-queue")
@app.get("/review-queue.html")
async def review_queue_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "review-queue.html")

@app.get("/theme-tracker")
@app.get("/theme-tracker.html")
async def theme_tracker_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "theme-tracker.html")

@app.get("/decision-audit")
@app.get("/decision-audit.html")
async def decision_audit_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "decision-audit.html")

@app.get("/weekly-review")
@app.get("/weekly-review.html")
async def weekly_review_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "weekly-review.html")

@app.get("/system-rotation")
@app.get("/system-rotation.html")
async def system_rotation_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "system-rotation.html")

@app.get("/preparation-score")
@app.get("/preparation-score.html")
async def preparation_score_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "preparation-score.html")

@app.get("/habit-radar")
@app.get("/habit-radar.html")
async def habit_radar_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "habit-radar.html")

@app.get("/market-narrative")
@app.get("/market-narrative.html")
async def market_narrative_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "market-narrative.html")

@app.get("/playbook-compliance")
@app.get("/playbook-compliance.html")
async def playbook_compliance_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "playbook-compliance.html")

@app.get("/price-action")
@app.get("/price-action.html")
async def price_action_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "price-action.html")


@app.get("/toolkit")
@app.get("/toolkit.html")
async def toolkit_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "toolkit.html")


@app.get("/watchlists")
@app.get("/watchlists.html")
async def watchlists_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "watchlists.html")


@app.get("/alerts")
@app.get("/alerts.html")
async def alerts_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "alerts.html")


@app.get("/risk-manager")
@app.get("/risk-manager.html")
async def risk_manager_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "risk-manager.html")


@app.get("/market-breadth")
@app.get("/market-breadth.html")
async def market_breadth_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "market-breadth.html")


@app.get("/multi-timeframe")
@app.get("/multi-timeframe.html")
async def multi_timeframe_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "multi-timeframe.html")


@app.get("/strategies")
@app.get("/strategies.html")
async def strategies_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "strategies.html")


@app.get("/playbooks")
@app.get("/playbooks.html")
async def playbooks_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "playbooks.html")


@app.get("/journal-analytics")
@app.get("/journal-analytics.html")
async def journal_analytics_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "journal-analytics.html")


@app.get("/replay")
@app.get("/replay.html")
async def replay_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "replay.html")


@app.get("/backtest")
@app.get("/backtest.html")
async def backtest_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "backtest.html")


@app.get("/video-strategy")
@app.get("/video-strategy.html")
async def video_strategy_page() -> FileResponse:
    return FileResponse(STATIC_DIR / "video-strategy.html")



@app.get("/healthz")
async def healthcheck() -> JSONResponse:
    snapshot = await scanner.get_snapshot()
    return JSONResponse({"ok": True, "scanner": snapshot["scanner"]})


@app.get("/api/snapshot")
async def snapshot() -> JSONResponse:
    await scanner.ensure_http_ready()
    return JSONResponse(await scanner.get_snapshot())


@app.post("/api/auth/register")
async def register(req: RegisterRequest) -> Any:
    existing_users = get_all_users()
    is_admin = len(existing_users) == 0

    if not req.face_image or not req.face_image.startswith("data:image/"):
        return JSONResponse(
            {"ok": False, "message": "Face enrollment capture is required to create an account."},
            status_code=400,
        )

    if create_user(req.username, req.email, req.phone, req.password, req.face_image):
        if is_admin:
            conn = sqlite3.connect(DB_PATH)
            conn.cursor().execute("UPDATE users_v4 SET is_admin = 1 WHERE email = ?", (req.email.lower(),))
            conn.commit()
            conn.close()

        token = create_user_token(req.email, is_admin=is_admin)
        return {"ok": True, "token": token}

    return JSONResponse({"ok": False, "message": "Identifier already in use or registration failed."}, status_code=400)


@app.post("/api/auth/login")
async def login(req: LoginRequest) -> Any:
    user = get_user_by_identifier(req.identifier)
    if not user:
        return JSONResponse({"ok": False, "message": "Account not found."}, status_code=400)

    if verify_password(req.password, user[3]):
        token = create_user_token(user[1], is_admin=bool(user[6]))
        return {"ok": True, "token": token}

    return JSONResponse({"ok": False, "message": "Invalid password."}, status_code=400)


@app.get("/api/auth/status")
async def auth_status(token: str | None = Query(default=None)) -> dict[str, Any]:
    payload = verify_token(token)
    if not payload:
        return {"authenticated": False}

    user = get_user_by_identifier(payload["email"])
    username = user[0] if user else payload["email"].split("@", 1)[0]
    return {
        "authenticated": True,
        "email": payload["email"],
        "username": username,
        "face_enrolled": bool(user and user[4]),
        "is_admin": payload.get("is_admin", False),
    }


@app.get("/api/journal")
async def journal_entries(token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT id, title, thesis, execution, lesson, tags, created_at
        FROM journal_entries
        WHERE user_email = ?
        ORDER BY created_at DESC, id DESC
        """,
        (payload["email"].lower(),),
    ).fetchall()
    conn.close()
    return {
        "ok": True,
        "entries": [dict(row) for row in rows],
    }


@app.post("/api/journal")
async def create_journal_entry(req: JournalEntryRequest) -> Any:
    payload = verify_token(req.token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO journal_entries (user_email, title, thesis, execution, lesson, tags)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            payload["email"].lower(),
            req.title.strip(),
            req.thesis.strip(),
            req.execution.strip(),
            req.lesson.strip(),
            req.tags.strip(),
        ),
    )
    conn.commit()
    entry_id = cursor.lastrowid
    row = conn.execute(
        """
        SELECT id, title, thesis, execution, lesson, tags, created_at
        FROM journal_entries
        WHERE id = ?
        """,
        (entry_id,),
    ).fetchone()
    conn.close()
    return {"ok": True, "entry": dict(zip(["id", "title", "thesis", "execution", "lesson", "tags", "created_at"], row))}


@app.delete("/api/journal/{entry_id}")
async def delete_journal_entry(entry_id: int, token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM journal_entries WHERE id = ? AND user_email = ?",
        (entry_id, payload["email"].lower()),
    )
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    if not deleted:
        return JSONResponse({"ok": False, "message": "Entry not found."}, status_code=404)
    return {"ok": True}


@app.get("/api/discipline")
async def discipline_events(token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT id, rule_type, severity, symbol, note, created_at
        FROM discipline_events
        WHERE user_email = ?
        ORDER BY created_at DESC, id DESC
        """,
        (payload["email"].lower(),),
    ).fetchall()
    conn.close()

    severity_penalty = {"low": 4, "medium": 9, "high": 16}
    total_penalty = sum(severity_penalty.get((row["severity"] or "").lower(), 6) for row in rows)
    score = max(0, 100 - total_penalty)
    rule_counts: dict[str, int] = {}
    for row in rows:
        key = row["rule_type"]
        rule_counts[key] = rule_counts.get(key, 0) + 1

    top_breaches = [
        {"rule_type": rule_type, "count": count}
        for rule_type, count in sorted(rule_counts.items(), key=lambda item: (-item[1], item[0]))[:5]
    ]

    return {
        "ok": True,
        "events": [dict(row) for row in rows],
        "summary": {
            "discipline_score": score,
            "breach_count": len(rows),
            "high_severity_count": sum(1 for row in rows if (row["severity"] or "").lower() == "high"),
            "top_breaches": top_breaches,
        },
    }


@app.post("/api/discipline")
async def create_discipline_event(req: DisciplineEventRequest) -> Any:
    payload = verify_token(req.token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO discipline_events (user_email, rule_type, severity, symbol, note)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            payload["email"].lower(),
            req.rule_type.strip(),
            req.severity.strip().lower(),
            req.symbol.strip().upper(),
            req.note.strip(),
        ),
    )
    conn.commit()
    event_id = cursor.lastrowid
    row = conn.execute(
        """
        SELECT id, rule_type, severity, symbol, note, created_at
        FROM discipline_events
        WHERE id = ?
        """,
        (event_id,),
    ).fetchone()
    conn.close()
    return {"ok": True, "event": dict(zip(["id", "rule_type", "severity", "symbol", "note", "created_at"], row))}


@app.delete("/api/discipline/{event_id}")
async def delete_discipline_event(event_id: int, token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM discipline_events WHERE id = ? AND user_email = ?",
        (event_id, payload["email"].lower()),
    )
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    if not deleted:
        return JSONResponse({"ok": False, "message": "Discipline event not found."}, status_code=404)
    return {"ok": True}


@app.get("/api/risk/daily-loss-lock")
async def daily_loss_lock(token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    trade_date = date.today().isoformat()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    profile = conn.execute(
        """
        SELECT account_size, risk_per_trade, max_daily_loss, preferred_rr
        FROM risk_profiles
        WHERE user_email = ?
        """,
        (payload["email"].lower(),),
    ).fetchone()
    state = conn.execute(
        """
        SELECT realized_pnl, note, updated_at
        FROM daily_loss_states
        WHERE user_email = ? AND trade_date = ?
        """,
        (payload["email"].lower(), trade_date),
    ).fetchone()
    conn.close()

    account_size = float(profile["account_size"]) if profile else 100000.0
    max_daily_loss_pct = float(profile["max_daily_loss"]) if profile else 3.0
    loss_limit = account_size * (max_daily_loss_pct / 100.0)
    realized_pnl = float(state["realized_pnl"]) if state else 0.0
    locked = realized_pnl <= (-1 * loss_limit)
    remaining_buffer = loss_limit + realized_pnl

    return {
        "ok": True,
        "state": {
            "trade_date": trade_date,
            "account_size": account_size,
            "max_daily_loss_pct": max_daily_loss_pct,
            "loss_limit": loss_limit,
            "realized_pnl": realized_pnl,
            "remaining_buffer": remaining_buffer,
            "locked": locked,
            "note": state["note"] if state else "",
            "updated_at": state["updated_at"] if state else None,
        },
    }


@app.post("/api/risk/daily-loss-lock")
async def save_daily_loss_lock(req: DailyLossStateRequest) -> Any:
    payload = verify_token(req.token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    trade_date = date.today().isoformat()
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        INSERT INTO daily_loss_states (user_email, trade_date, realized_pnl, note, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_email, trade_date) DO UPDATE SET
            realized_pnl = excluded.realized_pnl,
            note = excluded.note,
            updated_at = CURRENT_TIMESTAMP
        """,
        (payload["email"].lower(), trade_date, req.realized_pnl, req.note.strip()),
    )
    conn.commit()
    conn.close()
    return await daily_loss_lock(req.token)


@app.get("/api/archive/aplus")
async def aplus_archive(token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT id, title, symbol, setup_type, bias, rationale, context_note, created_at
        FROM aplus_setups
        WHERE user_email = ?
        ORDER BY created_at DESC, id DESC
        """,
        (payload["email"].lower(),),
    ).fetchall()
    conn.close()
    return {"ok": True, "setups": [dict(row) for row in rows]}


@app.post("/api/archive/aplus")
async def create_aplus_setup(req: APlusSetupRequest) -> Any:
    payload = verify_token(req.token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO aplus_setups (user_email, title, symbol, setup_type, bias, rationale, context_note)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            payload["email"].lower(),
            req.title.strip(),
            req.symbol.strip().upper(),
            req.setup_type.strip(),
            req.bias.strip(),
            req.rationale.strip(),
            req.context_note.strip(),
        ),
    )
    conn.commit()
    setup_id = cursor.lastrowid
    row = conn.execute(
        """
        SELECT id, title, symbol, setup_type, bias, rationale, context_note, created_at
        FROM aplus_setups
        WHERE id = ?
        """,
        (setup_id,),
    ).fetchone()
    conn.close()
    return {"ok": True, "setup": dict(zip(["id", "title", "symbol", "setup_type", "bias", "rationale", "context_note", "created_at"], row))}


@app.delete("/api/archive/aplus/{setup_id}")
async def delete_aplus_setup(setup_id: int, token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM aplus_setups WHERE id = ? AND user_email = ?",
        (setup_id, payload["email"].lower()),
    )
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    if not deleted:
        return JSONResponse({"ok": False, "message": "A+ setup not found."}, status_code=404)
    return {"ok": True}


@app.get("/api/toolkit/watchlists")
async def toolkit_watchlists(token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT id, name, symbols, notes, created_at
        FROM watchlists
        WHERE user_email = ?
        ORDER BY created_at DESC, id DESC
        """,
        (payload["email"].lower(),),
    ).fetchall()
    conn.close()
    return {"ok": True, "watchlists": [dict(row) for row in rows]}


@app.post("/api/toolkit/watchlists")
async def create_watchlist(req: WatchlistRequest) -> Any:
    payload = verify_token(req.token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO watchlists (user_email, name, symbols, notes)
        VALUES (?, ?, ?, ?)
        """,
        (
            payload["email"].lower(),
            req.name.strip(),
            req.symbols.strip(),
            req.notes.strip(),
        ),
    )
    conn.commit()
    watchlist_id = cursor.lastrowid
    row = conn.execute(
        """
        SELECT id, name, symbols, notes, created_at
        FROM watchlists
        WHERE id = ?
        """,
        (watchlist_id,),
    ).fetchone()
    conn.close()
    return {"ok": True, "watchlist": dict(zip(["id", "name", "symbols", "notes", "created_at"], row))}


@app.delete("/api/toolkit/watchlists/{watchlist_id}")
async def delete_watchlist(watchlist_id: int, token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM watchlists WHERE id = ? AND user_email = ?",
        (watchlist_id, payload["email"].lower()),
    )
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    if not deleted:
        return JSONResponse({"ok": False, "message": "Watchlist not found."}, status_code=404)
    return {"ok": True}


@app.get("/api/toolkit/alerts")
async def toolkit_alerts(token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT id, name, rule_type, scope, threshold, notes, created_at
        FROM alert_rules
        WHERE user_email = ?
        ORDER BY created_at DESC, id DESC
        """,
        (payload["email"].lower(),),
    ).fetchall()
    conn.close()
    return {"ok": True, "alerts": [dict(row) for row in rows]}


@app.post("/api/toolkit/alerts")
async def create_alert_rule(req: AlertRuleRequest) -> Any:
    payload = verify_token(req.token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO alert_rules (user_email, name, rule_type, scope, threshold, notes)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            payload["email"].lower(),
            req.name.strip(),
            req.rule_type.strip(),
            req.scope.strip(),
            req.threshold.strip(),
            req.notes.strip(),
        ),
    )
    conn.commit()
    rule_id = cursor.lastrowid
    row = conn.execute(
        """
        SELECT id, name, rule_type, scope, threshold, notes, created_at
        FROM alert_rules
        WHERE id = ?
        """,
        (rule_id,),
    ).fetchone()
    conn.close()
    return {
        "ok": True,
        "alert": dict(zip(["id", "name", "rule_type", "scope", "threshold", "notes", "created_at"], row)),
    }


@app.delete("/api/toolkit/alerts/{rule_id}")
async def delete_alert_rule(rule_id: int, token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM alert_rules WHERE id = ? AND user_email = ?",
        (rule_id, payload["email"].lower()),
    )
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    if not deleted:
        return JSONResponse({"ok": False, "message": "Alert rule not found."}, status_code=404)
    return {"ok": True}


@app.get("/api/toolkit/playbooks")
async def toolkit_playbooks(token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT id, title, setup_type, bias, entry_rule, risk_rule, exit_rule, created_at
        FROM playbooks
        WHERE user_email = ?
        ORDER BY created_at DESC, id DESC
        """,
        (payload["email"].lower(),),
    ).fetchall()
    conn.close()
    return {"ok": True, "playbooks": [dict(row) for row in rows]}


@app.post("/api/toolkit/playbooks")
async def create_playbook(req: PlaybookRequest) -> Any:
    payload = verify_token(req.token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO playbooks (user_email, title, setup_type, bias, entry_rule, risk_rule, exit_rule)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            payload["email"].lower(),
            req.title.strip(),
            req.setup_type.strip(),
            req.bias.strip(),
            req.entry_rule.strip(),
            req.risk_rule.strip(),
            req.exit_rule.strip(),
        ),
    )
    conn.commit()
    playbook_id = cursor.lastrowid
    row = conn.execute(
        """
        SELECT id, title, setup_type, bias, entry_rule, risk_rule, exit_rule, created_at
        FROM playbooks
        WHERE id = ?
        """,
        (playbook_id,),
    ).fetchone()
    conn.close()
    return {
        "ok": True,
        "playbook": dict(
            zip(["id", "title", "setup_type", "bias", "entry_rule", "risk_rule", "exit_rule", "created_at"], row)
        ),
    }


@app.delete("/api/toolkit/playbooks/{playbook_id}")
async def delete_playbook(playbook_id: int, token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM playbooks WHERE id = ? AND user_email = ?",
        (playbook_id, payload["email"].lower()),
    )
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    if not deleted:
        return JSONResponse({"ok": False, "message": "Playbook not found."}, status_code=404)
    return {"ok": True}


@app.get("/api/toolkit/risk-profile")
async def toolkit_risk_profile(token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    row = conn.execute(
        """
        SELECT account_size, risk_per_trade, max_daily_loss, preferred_rr, updated_at
        FROM risk_profiles
        WHERE user_email = ?
        """,
        (payload["email"].lower(),),
    ).fetchone()
    conn.close()
    if not row:
        return {
            "ok": True,
            "profile": {
                "account_size": 100000,
                "risk_per_trade": 1,
                "max_daily_loss": 3,
                "preferred_rr": 2,
            },
        }
    return {"ok": True, "profile": dict(row)}


@app.post("/api/toolkit/risk-profile")
async def save_risk_profile(req: RiskProfileRequest) -> Any:
    payload = verify_token(req.token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        INSERT INTO risk_profiles (user_email, account_size, risk_per_trade, max_daily_loss, preferred_rr, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_email) DO UPDATE SET
            account_size = excluded.account_size,
            risk_per_trade = excluded.risk_per_trade,
            max_daily_loss = excluded.max_daily_loss,
            preferred_rr = excluded.preferred_rr,
            updated_at = CURRENT_TIMESTAMP
        """,
        (
            payload["email"].lower(),
            req.account_size,
            req.risk_per_trade,
            req.max_daily_loss,
            req.preferred_rr,
        ),
    )
    conn.commit()
    conn.close()
    return {"ok": True}


@app.get("/api/toolkit/journal-analytics")
async def toolkit_journal_analytics(token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT title, lesson, tags, created_at
        FROM journal_entries
        WHERE user_email = ?
        ORDER BY created_at DESC, id DESC
        """,
        (payload["email"].lower(),),
    ).fetchall()
    conn.close()

    tag_counts: dict[str, int] = {}
    for row in rows:
        tags = [tag.strip().lower() for tag in (row["tags"] or "").split(",") if tag.strip()]
        for tag in tags:
            tag_counts[tag] = tag_counts.get(tag, 0) + 1

    top_tags = [
        {"tag": tag, "count": count}
        for tag, count in sorted(tag_counts.items(), key=lambda item: (-item[1], item[0]))[:6]
    ]
    recent_lessons = [
        {"title": row["title"], "lesson": row["lesson"], "created_at": row["created_at"]}
        for row in rows[:4]
    ]
    return {
        "ok": True,
        "analytics": {
            "total_entries": len(rows),
            "top_tags": top_tags,
            "recent_lessons": recent_lessons,
            "consistency_score": min(100, len(rows) * 8 + len(top_tags) * 6),
        },
    }


@app.post("/api/strategy/video")
async def strategy_video(req: VideoStrategyRequest) -> Any:
    payload = verify_token(req.token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    try:
        analysis = analyze_video_strategy(req.url.strip())
        snapshot = await scanner.get_snapshot()
        matches = build_strategy_matches(analysis, snapshot)
        conn = sqlite3.connect(DB_PATH)
        conn.execute(
            """
            INSERT INTO video_strategy_runs (
                user_email, source_url, video_id, title, primary_strategy, confidence,
                transcript_length, tags, scanner_lens, guidance
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload["email"].lower(),
                analysis["url"],
                analysis["video_id"],
                analysis["title"],
                analysis["primary_strategy"]["label"],
                int(analysis["confidence"]),
                int(analysis["transcript_length"]),
                ", ".join(analysis.get("tags", [])),
                matches.get("scanner_lens", ""),
                matches.get("guidance", ""),
            ),
        )
        conn.commit()
        conn.close()
        return {"ok": True, "analysis": analysis, "matches": matches}
    except ValueError as exc:
        return JSONResponse({"ok": False, "message": str(exc)}, status_code=400)
    except RuntimeError as exc:
        return JSONResponse({"ok": False, "message": str(exc)}, status_code=400)
    except Exception:
        return JSONResponse(
            {
                "ok": False,
                "message": "Could not analyze that video right now. Try another link or use a video with captions.",
            },
            status_code=500,
        )


@app.get("/api/strategy/video/history")
async def strategy_video_history(token: str | None = Query(default=None)) -> Any:
    payload = verify_token(token)
    if not payload:
        return JSONResponse({"ok": False, "message": "Unauthorized"}, status_code=401)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT id, source_url, video_id, title, primary_strategy, confidence, transcript_length, tags, scanner_lens, guidance, created_at
        FROM video_strategy_runs
        WHERE user_email = ?
        ORDER BY created_at DESC, id DESC
        LIMIT 12
        """,
        (payload["email"].lower(),),
    ).fetchall()
    conn.close()
    return {"ok": True, "history": [dict(row) for row in rows]}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    token = websocket.query_params.get("token")
    payload = verify_token(token)
    if not token or not payload:
        await websocket.accept()
        await websocket.send_json({"type": "error", "message": "Unauthorized"})
        await websocket.close(code=4001)
        return

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
