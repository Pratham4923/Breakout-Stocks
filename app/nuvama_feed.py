from __future__ import annotations

import asyncio
import logging
import os
from collections.abc import Awaitable, Callable
from datetime import datetime
from zoneinfo import ZoneInfo

logger = logging.getLogger(__name__)
IST = ZoneInfo("Asia/Kolkata")

# ── credentials (never hardcode — always from env) ───────────────
API_KEY        = os.getenv("NUVAMA_API_KEY", "")
API_SECRET     = os.getenv("NUVAMA_API_SECRET", "")
REQUEST_ID     = os.getenv("NUVAMA_REQUEST_ID", "")
SETTINGS_PATH  = os.path.join(os.path.dirname(__file__), "..", "settings.ini")


class NuvamaFeed:
    """
    Wraps Nuvama APIConnect streaming and exposes an async interface
    that matches what ScannerService expects.

    Usage in scanner.py:
        Replace:
            async with yf.AsyncWebSocket(verbose=False) as ws:
                await ws.subscribe(list(symbols))
                await ws.listen(handler)
        With:
            feed = NuvamaFeed()
            await feed.stream(symbols=list(symbols), handler=handler)
    """

    def __init__(self) -> None:
        self._api = None

    def _init_api(self) -> bool:
        """Initialize Nuvama APIConnect session."""
        if not all([API_KEY, API_SECRET, REQUEST_ID]):
            raise ValueError(
                "Missing Nuvama credentials. Set environment variables:\n"
                "  NUVAMA_API_KEY\n"
                "  NUVAMA_API_SECRET\n"
                "  NUVAMA_REQUEST_ID  (from browser login URL)\n\n"
                "Login URL: "
                f"https://www.nuvamawealth.com/api-connect/login?api_key={API_KEY}"
            )
        try:
            from APIConnect.APIConnect import APIConnect
            self._api = APIConnect(
                API_KEY,
                API_SECRET,
                REQUEST_ID,
                downloadContract=True,
                ini_file_path=SETTINGS_PATH,
            )
            logger.info("Nuvama APIConnect session initialized")
            return True
        except ImportError:
            logger.error(
                "APIConnect not installed. Run: pip install APIConnect==2.0.0"
            )
            return False
        except Exception as exc:
            logger.error(f"Nuvama init failed: {exc}")
            return False

    async def stream(
        self,
        symbols: list[str],
        handler: Callable[[dict], Awaitable[None]],
    ) -> None:
        """
        Stream live quotes for symbols and call handler(payload) for each tick.
        payload dict matches the format _handle_quote() expects:
            {
                "id": "RELIANCE.NS",
                "price": 2850.5,
                "change_percent": 0.35,
                "day_high": 2865.0,
                "day_low": 2830.0,
                "time": 1700000000000,   # epoch ms
            }
        """
        if not self._init_api():
            raise RuntimeError("Nuvama feed could not be initialized")

        # Convert .NS symbols to Nuvama streaming format
        # Nuvama uses exchange tokens from their contract file
        # For NSE equities the format is: {token}_NSE
        streaming_symbols = [
            self._to_streaming_symbol(sym) for sym in symbols
            if self._to_streaming_symbol(sym)
        ]

        logger.info(f"Subscribing to {len(streaming_symbols)} symbols on Nuvama stream")

        def _on_quote(data: dict) -> None:
            """Nuvama quote callback → normalize to our format → call handler."""
            try:
                payload = self._normalize_quote(data)
                if payload:
                    asyncio.create_task(handler(payload))
            except Exception as exc:
                logger.warning(f"Quote normalization error: {exc}")

        # Run the blocking Nuvama stream in a thread
        # so it doesn't block the event loop
        await asyncio.to_thread(
            self._run_stream_blocking,
            streaming_symbols,
            _on_quote,
        )

    def _run_stream_blocking(self, streaming_symbols: list[str], callback: Callable[[dict], None]) -> None:
        """Blocking stream runner — called via asyncio.to_thread."""
        try:
            # Subscribe to reduced quotes (LTP, high, low, change%)
            self._api.ReducedQuoteStreamer(
                streamingSymbols=streaming_symbols,
                onQuote=callback,
            )
        except Exception as exc:
            logger.error(f"Nuvama stream error: {exc}")
            raise

    def _normalize_quote(self, raw: dict) -> dict | None:
        """
        Convert Nuvama quote payload to the format our scanner expects.
        Nuvama reduced quote fields (from their docs):
            ltp  - last traded price
            high - day high
            low  - day low
            chng - change
            chngp - change percent
            sym  - streaming symbol e.g. "4963_NSE"
            trdSym - trading symbol e.g. "INE090A01021"
        """
        try:
            ltp = raw.get("ltp") or raw.get("LTP") or raw.get("price")
            if not ltp:
                return None

            # Reconstruct .NS symbol from trading symbol
            trd_sym = raw.get("trdSym") or raw.get("sym", "")
            ns_symbol = self._to_ns_symbol(trd_sym)

            return {
                "id": ns_symbol,
                "price": float(ltp),
                "change_percent": float(raw.get("chngp") or raw.get("pChange") or 0),
                "day_high": float(raw.get("high") or raw.get("dayHigh") or ltp),
                "day_low": float(raw.get("low") or raw.get("dayLow") or ltp),
                "time": int(raw.get("time") or raw.get("ltt") or
                           datetime.now(IST).timestamp() * 1000),
            }
        except (TypeError, ValueError):
            return None

    def get_intraday_history(self, symbol: str, interval: str = "1") -> list[dict]:
        """
        Fetch intraday tick-by-tick historical data.
        interval: "1" = 1 minute, "5" = 5 minutes etc.
        Returns list of OHLCV dicts.

        Used by backtester for historical signal validation.
        """
        if not self._api:
            self._init_api()

        try:
            # Nuvama intraday historical endpoint
            streaming_sym = self._to_streaming_symbol(symbol)
            response = self._api.IntradayHistory(
                StreamingSymbol=streaming_sym,
                Interval=interval,
            )
            return self._parse_history_response(response)
        except Exception as exc:
            logger.error(f"Nuvama intraday history error for {symbol}: {exc}")
            return []

    def get_eod_history(self, symbol: str, from_date: str, to_date: str) -> list[dict]:
        """
        Fetch end-of-day historical data for backtesting.
        from_date / to_date: "YYYY-MM-DD"
        """
        if not self._api:
            self._init_api()

        try:
            streaming_sym = self._to_streaming_symbol(symbol)
            response = self._api.EODHistory(
                StreamingSymbol=streaming_sym,
                FromDate=from_date,
                ToDate=to_date,
            )
            return self._parse_history_response(response)
        except Exception as exc:
            logger.error(f"Nuvama EOD history error for {symbol}: {exc}")
            return []

    def _parse_history_response(self, response: object) -> list[dict]:
        """Parse Nuvama history API response into OHLCV list."""
        try:
            if isinstance(response, str):
                import json
                response = json.loads(response)
            data = response.get("data") or response.get("resp", {}).get("data", {})
            candles = data.get("candles") or data.get("ohlcv") or []
            result = []
            for c in candles:
                result.append({
                    "datetime": c.get("dt") or c.get("time"),
                    "open": float(c.get("o") or c.get("open") or 0),
                    "high": float(c.get("h") or c.get("high") or 0),
                    "low": float(c.get("l") or c.get("low") or 0),
                    "close": float(c.get("c") or c.get("close") or 0),
                    "volume": int(c.get("v") or c.get("volume") or 0),
                })
            return result
        except Exception as exc:
            logger.warning(f"History parse error: {exc}")
            return []

    @staticmethod
    def _to_streaming_symbol(ns_symbol: str) -> str:
        """
        Convert 'RELIANCE.NS' to Nuvama streaming format.
        Nuvama uses exchange tokens like '2885_NSE'.
        The token mapping comes from their contract file (downloaded on init).
        For now we strip .NS — the full token map is built after init.
        """
        return ns_symbol.replace(".NS", "").replace(".BO", "")

    @staticmethod
    def _to_ns_symbol(trading_symbol: str) -> str:
        """Convert Nuvama trading symbol back to .NS format."""
        if not trading_symbol:
            return trading_symbol
        clean = trading_symbol.split("_")[0] if "_" in trading_symbol else trading_symbol
        if not clean.endswith(".NS"):
            clean = f"{clean}.NS"
        return clean


def get_login_url() -> str:
    """Print the URL to open in browser for daily auth."""
    return f"https://www.nuvamawealth.com/api-connect/login?api_key={API_KEY}"


def print_setup_instructions() -> None:
    print("\n" + "="*60)
    print("  NUVAMA API SETUP")
    print("="*60)
    print("\n1. Install SDK:")
    print("   pip install APIConnect==2.0.0")
    print("\n2. Set environment variables (Windows):")
    print(f"   set NUVAMA_API_KEY=your_api_key_here")
    print(f"   set NUVAMA_API_SECRET=your_secret_here")
    print("\n3. Get daily request ID:")
    print(f"   Open browser: {get_login_url()}")
    print("   Login → copy requestId from redirect URL")
    print("   set NUVAMA_REQUEST_ID=paste_request_id_here")
    print("\n4. Run scanner:")
    print("   python main.py")
    print("="*60)


if __name__ == "__main__":
    print_setup_instructions()
