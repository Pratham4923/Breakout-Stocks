from __future__ import annotations

import os
from dataclasses import dataclass

from app.symbols import NSE_FNO_SYMBOLS


def _parse_symbols(raw_value: str | None) -> tuple[str, ...]:
    if not raw_value:
        return NSE_FNO_SYMBOLS
    parsed = [item.strip().upper() for item in raw_value.split(",") if item.strip()]
    normalized = [item if item.endswith(".NS") else f"{item}.NS" for item in parsed]
    return tuple(dict.fromkeys(normalized))


@dataclass(slots=True)
class ScannerConfig:
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))
    quote_subscription_chunk: int = int(os.getenv("QUOTE_SUBSCRIPTION_CHUNK", "80"))
    history_download_chunk: int = int(os.getenv("HISTORY_DOWNLOAD_CHUNK", "30"))
    refresh_interval_seconds: int = int(os.getenv("REFRESH_INTERVAL_SECONDS", "300"))
    broadcast_interval_seconds: float = float(os.getenv("BROADCAST_INTERVAL_SECONDS", "0.75"))
    alert_cooldown_seconds: int = int(os.getenv("ALERT_COOLDOWN_SECONDS", "300"))
    max_recent_alerts: int = int(os.getenv("MAX_RECENT_ALERTS", "50"))
    stream_stale_seconds: int = int(os.getenv("STREAM_STALE_SECONDS", "45"))
    watchdog_interval_seconds: int = int(os.getenv("WATCHDOG_INTERVAL_SECONDS", "10"))
    max_smc_signals: int = int(os.getenv("MAX_SMC_SIGNALS", "40"))
    symbols: tuple[str, ...] = _parse_symbols(os.getenv("SCANNER_SYMBOLS"))

    # Auth & SMTP Settings
    jwt_secret: str = os.getenv("JWT_SECRET", "astraveda_god_mode_secret_key_999")
    smtp_host: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_user: str = os.getenv("SMTP_USER", "")
    smtp_pass: str = os.getenv("SMTP_PASS", "")
    smtp_from: str = os.getenv("SMTP_FROM", "auth@astraveda.com")
