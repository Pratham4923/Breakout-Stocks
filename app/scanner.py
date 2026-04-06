from __future__ import annotations

import asyncio
from collections import deque
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pandas as pd
import yfinance as yf

from app.config import ScannerConfig
from app.models import BreakoutAlert, BreakoutLevel, Quote, SmcSignal

IST = ZoneInfo("Asia/Kolkata")
LOOKBACK_WINDOWS = (
    ("2 Days", 2),
    ("Week", 5),
    ("2 Weeks", 10),
    ("Month", 21),
    ("3 Months", 63),
    ("52 Weeks", 252),
)


class ScannerService:
    def __init__(self, config: ScannerConfig, broadcaster) -> None:
        self.config = config
        self.broadcaster = broadcaster
        self.reference_levels: dict[str, dict[str, BreakoutLevel]] = {}
        self.smc_context: dict[str, SmcSignal] = {}
        self.latest_quotes: dict[str, Quote] = {}
        self.active_breakouts: dict[tuple[str, str, str], BreakoutAlert] = {}
        self.last_alert_at: dict[tuple[str, str, str], datetime] = {}
        self.recent_alerts: deque[BreakoutAlert] = deque(maxlen=config.max_recent_alerts)
        self.last_reference_refresh: str | None = None
        self.last_error: str | None = None
        self.last_quote_at: str | None = None
        self.stream_restarts = 0
        self.heal_count = 0
        self.reference_failures = 0
        self.healing_status = "Initializing"
        self._state_lock = asyncio.Lock()
        self._stop_event = asyncio.Event()
        self._snapshot_dirty = asyncio.Event()
        self._tasks: list[asyncio.Task] = []
        self._stream_task: asyncio.Task | None = None
        self._stream_generation = 0

    async def start(self) -> None:
        self._tasks = [
            asyncio.create_task(self._prime_reference_levels(), name="reference-prime"),
            asyncio.create_task(self._reference_refresh_loop(), name="reference-refresh"),
            asyncio.create_task(self._broadcast_loop(), name="dashboard-broadcast"),
            asyncio.create_task(self._stream_supervisor_loop(), name="stream-supervisor"),
            asyncio.create_task(self._watchdog_loop(), name="self-healing-watchdog"),
        ]

    async def stop(self) -> None:
        self._stop_event.set()
        if self._stream_task:
            self._stream_task.cancel()
        for task in self._tasks:
            task.cancel()
        await asyncio.gather(*(task for task in self._tasks if task), return_exceptions=True)
        if self._stream_task:
            await asyncio.gather(self._stream_task, return_exceptions=True)

    async def refresh_reference_levels(self) -> None:
        result = await asyncio.to_thread(self._download_reference_bundle)
        async with self._state_lock:
            self.reference_levels = result["levels"]
            self.smc_context = result["smc"]
            self.last_reference_refresh = datetime.now(IST).isoformat()
            self.last_error = None
            self.healing_status = "Healthy"
        self._snapshot_dirty.set()

    async def get_snapshot(self) -> dict:
        async with self._state_lock:
            return {
                "generated_at": datetime.now(IST).isoformat(),
                "scanner": {
                    "symbols": len(self.config.symbols),
                    "reference_symbols": len(self.reference_levels),
                    "tracked_quotes": len(self.latest_quotes),
                    "active_breakouts": len(self.active_breakouts),
                    "recent_alerts": len(self.recent_alerts),
                    "connected_clients": self.broadcaster.connection_count,
                    "market_status": self._market_status(),
                    "last_reference_refresh": self.last_reference_refresh,
                    "last_quote_at": self.last_quote_at,
                    "last_error": self.last_error,
                    "self_healing_status": self.healing_status,
                    "self_heal_events": self.heal_count,
                    "stream_restarts": self.stream_restarts,
                    "reference_failures": self.reference_failures,
                },
                "active_breakouts": [alert.to_dict() for alert in self._sorted_active_breakouts()],
                "recent_alerts": [alert.to_dict() for alert in list(self.recent_alerts)],
                "movers": self._build_movers(),
                "smc_signals": [signal.to_dict() for signal in self._build_smc_board()],
            }

    async def _prime_reference_levels(self) -> None:
        try:
            await self.refresh_reference_levels()
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            async with self._state_lock:
                self.reference_failures += 1
                self.last_error = f"Initial reference refresh failed: {exc}"
                self.healing_status = "Recovering"
            self._snapshot_dirty.set()

    async def _reference_refresh_loop(self) -> None:
        while not self._stop_event.is_set():
            try:
                await asyncio.sleep(self.config.refresh_interval_seconds)
                await self.refresh_reference_levels()
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                async with self._state_lock:
                    self.reference_failures += 1
                    self.last_error = f"Reference refresh failed: {exc}"
                    self.healing_status = "Recovering"
                self._snapshot_dirty.set()
                await asyncio.sleep(5)

    async def _broadcast_loop(self) -> None:
        while not self._stop_event.is_set():
            try:
                await self._snapshot_dirty.wait()
                self._snapshot_dirty.clear()
                await asyncio.sleep(self.config.broadcast_interval_seconds)
                await self.broadcaster.broadcast({"type": "snapshot", "data": await self.get_snapshot()})
            except asyncio.CancelledError:
                raise
            except Exception:
                await asyncio.sleep(1)

    async def _stream_supervisor_loop(self) -> None:
        await self._start_stream_session("initial boot")
        while not self._stop_event.is_set():
            try:
                await asyncio.sleep(1)
                if self._stream_task and self._stream_task.done():
                    await self._consume_finished_stream_task()
                    await self._start_stream_session("stream session ended")
            except asyncio.CancelledError:
                raise

    async def _watchdog_loop(self) -> None:
        while not self._stop_event.is_set():
            try:
                await asyncio.sleep(self.config.watchdog_interval_seconds)
                if await self._stream_is_stale():
                    await self._heal_stream("stale quote stream")
            except asyncio.CancelledError:
                raise

    async def _run_stream_session(self, generation: int) -> None:
        async def handler(payload: dict) -> None:
            await self._handle_quote(payload, generation)

        async with yf.AsyncWebSocket(verbose=False) as ws:
            for symbols in self._chunked(self.config.symbols, self.config.quote_subscription_chunk):
                await ws.subscribe(list(symbols))
            await ws.listen(handler)

    async def _start_stream_session(self, reason: str) -> None:
        self._stream_generation += 1
        generation = self._stream_generation
        self._stream_task = asyncio.create_task(self._run_stream_session(generation), name=f"price-stream-{generation}")
        async with self._state_lock:
            self.stream_restarts += 1
            self.healing_status = f"Streaming ({reason})"
            self.last_error = None
        self._snapshot_dirty.set()

    async def _consume_finished_stream_task(self) -> None:
        if not self._stream_task:
            return
        try:
            await self._stream_task
        except asyncio.CancelledError:
            pass
        except Exception as exc:
            async with self._state_lock:
                self.last_error = f"Live stream failed: {exc}"
                self.healing_status = "Recovering"
            self._snapshot_dirty.set()

    async def _heal_stream(self, reason: str) -> None:
        if self._stream_task and not self._stream_task.done():
            self._stream_task.cancel()
            await asyncio.gather(self._stream_task, return_exceptions=True)
        async with self._state_lock:
            self.heal_count += 1
            self.healing_status = f"Self-healing: {reason}"
            self.last_error = reason
        self._snapshot_dirty.set()
        await asyncio.sleep(1)
        await self._start_stream_session(reason)

    async def _stream_is_stale(self) -> bool:
        async with self._state_lock:
            last_quote_at = self.last_quote_at
        if not last_quote_at or self._market_status() != "Open":
            return False
        try:
            last_seen = datetime.fromisoformat(last_quote_at)
        except ValueError:
            return False
        return (datetime.now(IST) - last_seen) > timedelta(seconds=self.config.stream_stale_seconds)

    async def _handle_quote(self, payload: dict, generation: int) -> None:
        if generation != self._stream_generation:
            return

        symbol = payload.get("id")
        price = self._to_float(payload.get("price"))
        if not symbol or price is None:
            return

        quote = Quote(
            symbol=symbol,
            price=price,
            change_percent=self._to_float(payload.get("change_percent")),
            day_high=self._to_float(payload.get("day_high")),
            day_low=self._to_float(payload.get("day_low")),
            timestamp=self._timestamp_from_millis(payload.get("time")),
        )

        alerts_to_emit: list[BreakoutAlert] = []
        async with self._state_lock:
            self.latest_quotes[symbol] = quote
            self.last_quote_at = quote.timestamp
            self.healing_status = "Healthy"
            for alert in self._evaluate_breakouts(symbol, quote):
                key = alert.key()
                last_seen = self.last_alert_at.get(key)
                if last_seen and datetime.now(IST) - last_seen < timedelta(seconds=self.config.alert_cooldown_seconds):
                    continue
                self.active_breakouts[key] = alert
                self.last_alert_at[key] = datetime.now(IST)
                self.recent_alerts.appendleft(alert)
                alerts_to_emit.append(alert)
            self._drop_resolved_breakouts(symbol, quote)

        self._snapshot_dirty.set()
        for alert in alerts_to_emit:
            await self.broadcaster.broadcast({"type": "alert", "data": alert.to_dict()})

    def _download_reference_bundle(self) -> dict[str, dict]:
        compiled_levels: dict[str, dict[str, BreakoutLevel]] = {}
        compiled_smc: dict[str, SmcSignal] = {}

        for batch in self._chunked(self.config.symbols, self.config.history_download_chunk):
            try:
                history = yf.download(
                    tickers=list(batch),
                    period="400d",
                    interval="1d",
                    group_by="ticker",
                    auto_adjust=False,
                    progress=False,
                    threads=True,
                )
            except Exception:
                continue
            if history.empty:
                continue

            for symbol in batch:
                frame = self._extract_symbol_history(history, symbol, len(batch) == 1)
                if frame.empty:
                    continue
                prepared = self._prepare_history(frame)
                if prepared.empty:
                    continue
                compiled_levels[symbol] = self._build_reference_levels(prepared)
                smc_signal = self._build_smc_signal(symbol, prepared)
                if smc_signal:
                    compiled_smc[symbol] = smc_signal

        return {"levels": compiled_levels, "smc": compiled_smc}

    def _prepare_history(self, frame: pd.DataFrame) -> pd.DataFrame:
        history = frame.dropna(subset=["High", "Low", "Close"]).copy()
        if history.empty:
            return history
        latest_date = pd.Timestamp(history.index[-1]).date()
        today = datetime.now(IST).date()
        if latest_date >= today and len(history) > 1:
            history = history.iloc[:-1]
        return history

    def _build_reference_levels(self, history: pd.DataFrame) -> dict[str, BreakoutLevel]:
        levels: dict[str, BreakoutLevel] = {}
        if history.empty:
            return levels

        previous = history.iloc[-1]
        levels["Day"] = BreakoutLevel(
            label="Day",
            high=self._to_float(previous["High"]),
            low=self._to_float(previous["Low"]),
        )
        for label, window in LOOKBACK_WINDOWS:
            window_frame = history.tail(window)
            if window_frame.empty:
                continue
            levels[label] = BreakoutLevel(
                label=label,
                high=self._to_float(window_frame["High"].max()),
                low=self._to_float(window_frame["Low"].min()),
            )
        return levels

    def _build_smc_signal(self, symbol: str, history: pd.DataFrame) -> SmcSignal | None:
        if len(history) < 12:
            return None

        display_symbol = symbol.replace(".NS", "")
        recent = history.tail(12).copy()
        latest = recent.iloc[-1]
        prior = recent.iloc[:-1]
        live_price = self.latest_quotes.get(symbol).price if symbol in self.latest_quotes else self._to_float(latest["Close"])
        timestamp = datetime.now(IST).isoformat()

        previous_high = self._to_float(prior["High"].max())
        previous_low = self._to_float(prior["Low"].min())
        latest_close = self._to_float(latest["Close"])
        latest_high = self._to_float(latest["High"])
        latest_low = self._to_float(latest["Low"])
        previous_close = self._to_float(prior.iloc[-1]["Close"]) if len(prior) else None

        if latest_close is None:
            return None

        if previous_high is not None and latest_close > previous_high:
            return SmcSignal(
                symbol=symbol,
                display_symbol=display_symbol,
                signal="Bullish BOS",
                bias="Bullish",
                reference_price=previous_high,
                live_price=live_price,
                detail="Daily close displaced above prior structure high.",
                timestamp=timestamp,
            )
        if previous_low is not None and latest_close < previous_low:
            return SmcSignal(
                symbol=symbol,
                display_symbol=display_symbol,
                signal="Bearish BOS",
                bias="Bearish",
                reference_price=previous_low,
                live_price=live_price,
                detail="Daily close displaced below prior structure low.",
                timestamp=timestamp,
            )
        if (
            previous_high is not None
            and latest_high is not None
            and latest_close is not None
            and latest_high > previous_high
            and latest_close < previous_high
        ):
            return SmcSignal(
                symbol=symbol,
                display_symbol=display_symbol,
                signal="Buy-side Liquidity Sweep",
                bias="Reversal Watch",
                reference_price=previous_high,
                live_price=live_price,
                detail="Price wicked above prior highs but closed back under liquidity.",
                timestamp=timestamp,
            )
        if (
            previous_low is not None
            and latest_low is not None
            and latest_close is not None
            and latest_low < previous_low
            and latest_close > previous_low
        ):
            return SmcSignal(
                symbol=symbol,
                display_symbol=display_symbol,
                signal="Sell-side Liquidity Sweep",
                bias="Reversal Watch",
                reference_price=previous_low,
                live_price=live_price,
                detail="Price ran below prior lows and reclaimed the range.",
                timestamp=timestamp,
            )
        if len(recent) >= 3:
            third = recent.iloc[-3]
            bullish_gap = self._to_float(latest_low) and self._to_float(third["High"]) and latest_low > self._to_float(third["High"])
            bearish_gap = self._to_float(latest_high) and self._to_float(third["Low"]) and latest_high < self._to_float(third["Low"])
            if bullish_gap:
                return SmcSignal(
                    symbol=symbol,
                    display_symbol=display_symbol,
                    signal="Bullish FVG",
                    bias="Bullish",
                    reference_price=self._to_float(third["High"]),
                    live_price=live_price,
                    detail="Recent candles left an upside fair value gap.",
                    timestamp=timestamp,
                )
            if bearish_gap:
                return SmcSignal(
                    symbol=symbol,
                    display_symbol=display_symbol,
                    signal="Bearish FVG",
                    bias="Bearish",
                    reference_price=self._to_float(third["Low"]),
                    live_price=live_price,
                    detail="Recent candles left a downside fair value gap.",
                    timestamp=timestamp,
                )
        if previous_close is not None and latest_close > previous_close:
            return SmcSignal(
                symbol=symbol,
                display_symbol=display_symbol,
                signal="Higher Close Structure",
                bias="Bullish",
                reference_price=previous_close,
                live_price=live_price,
                detail="Momentum is improving but has not broken major structure yet.",
                timestamp=timestamp,
            )
        return SmcSignal(
            symbol=symbol,
            display_symbol=display_symbol,
            signal="Lower Close Structure",
            bias="Bearish",
            reference_price=previous_close,
            live_price=live_price,
            detail="Momentum is weakening without a full structure break yet.",
            timestamp=timestamp,
        )

    def _evaluate_breakouts(self, symbol: str, quote: Quote) -> list[BreakoutAlert]:
        levels = self.reference_levels.get(symbol, {})
        display_symbol = symbol.replace(".NS", "")
        live_levels = {"Live Day": BreakoutLevel(label="Live Day", high=quote.day_high, low=quote.day_low), **levels}
        alerts: list[BreakoutAlert] = []

        for scope, level in live_levels.items():
            if level.high is not None and quote.price >= level.high:
                alerts.append(
                    BreakoutAlert(
                        symbol=symbol,
                        display_symbol=display_symbol,
                        scope=scope,
                        direction="HIGH",
                        price=quote.price,
                        threshold=level.high,
                        change_percent=quote.change_percent,
                        timestamp=quote.timestamp,
                    )
                )
            if level.low is not None and quote.price <= level.low:
                alerts.append(
                    BreakoutAlert(
                        symbol=symbol,
                        display_symbol=display_symbol,
                        scope=scope,
                        direction="LOW",
                        price=quote.price,
                        threshold=level.low,
                        change_percent=quote.change_percent,
                        timestamp=quote.timestamp,
                    )
                )
        return alerts

    def _drop_resolved_breakouts(self, symbol: str, quote: Quote) -> None:
        levels = self.reference_levels.get(symbol, {})
        live_levels = {"Live Day": BreakoutLevel(label="Live Day", high=quote.day_high, low=quote.day_low), **levels}
        stale_keys: list[tuple[str, str, str]] = []

        for key, alert in self.active_breakouts.items():
            if alert.symbol != symbol:
                continue
            level = live_levels.get(alert.scope)
            if level is None:
                stale_keys.append(key)
                continue
            if alert.direction == "HIGH" and (level.high is None or quote.price < level.high):
                stale_keys.append(key)
            if alert.direction == "LOW" and (level.low is None or quote.price > level.low):
                stale_keys.append(key)

        for key in stale_keys:
            self.active_breakouts.pop(key, None)

    def _build_movers(self) -> list[dict]:
        rows: list[dict] = []
        flags_by_symbol: dict[str, list[str]] = {}

        for alert in self.active_breakouts.values():
            flags_by_symbol.setdefault(alert.symbol, []).append(f"{alert.scope} {alert.direction}")

        for symbol, quote in self.latest_quotes.items():
            flags = flags_by_symbol.get(symbol)
            if not flags:
                continue
            rows.append(
                {
                    "symbol": symbol.replace(".NS", ""),
                    "price": quote.price,
                    "change_percent": quote.change_percent,
                    "flags": sorted(flags),
                    "updated_at": quote.timestamp,
                }
            )

        rows.sort(key=lambda item: abs(item["change_percent"] or 0.0), reverse=True)
        return rows[:50]

    def _build_smc_board(self) -> list[SmcSignal]:
        signals = list(self.smc_context.values())
        signals.sort(
            key=lambda signal: (
                0 if "BOS" in signal.signal else 1 if "Sweep" in signal.signal else 2,
                abs((signal.live_price or 0) - (signal.reference_price or 0)),
            ),
            reverse=False,
        )
        return signals[: self.config.max_smc_signals]

    def _sorted_active_breakouts(self) -> list[BreakoutAlert]:
        return sorted(
            self.active_breakouts.values(),
            key=lambda alert: (alert.timestamp, alert.symbol, alert.scope, alert.direction),
            reverse=True,
        )

    def _extract_symbol_history(self, history: pd.DataFrame, symbol: str, single_symbol: bool) -> pd.DataFrame:
        if isinstance(history.columns, pd.MultiIndex):
            if symbol in history.columns.get_level_values(0):
                frame = history[symbol].copy()
            elif single_symbol:
                root = history.columns.get_level_values(0)[0]
                frame = history[root].copy()
            else:
                return pd.DataFrame()
        else:
            frame = history.copy()

        available = [column for column in ("High", "Low", "Close") if column in frame.columns]
        if len(available) < 3:
            return pd.DataFrame()
        frame = frame[available].copy()
        return frame[~frame.index.duplicated(keep="last")]

    def _market_status(self) -> str:
        now = datetime.now(IST)
        if now.weekday() >= 5:
            return "Closed"
        market_open = now.replace(hour=9, minute=15, second=0, microsecond=0)
        market_close = now.replace(hour=15, minute=30, second=0, microsecond=0)
        return "Open" if market_open <= now <= market_close else "Pre/Post"

    @staticmethod
    def _chunked(items: tuple[str, ...], size: int):
        for index in range(0, len(items), size):
            yield items[index:index + size]

    @staticmethod
    def _to_float(value) -> float | None:
        try:
            if value is None or value == "":
                return None
            return float(value)
        except (TypeError, ValueError):
            return None

    @staticmethod
    def _timestamp_from_millis(value) -> str:
        try:
            return datetime.fromtimestamp(int(value) / 1000, tz=IST).isoformat()
        except (TypeError, ValueError):
            return datetime.now(IST).isoformat()
