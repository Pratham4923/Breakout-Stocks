from __future__ import annotations

import csv
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")
LOG_FILE = Path(__file__).parent.parent / "signals_log.csv"

HEADERS = [
    "timestamp", "symbol", "signal_type", "scope",
    "price_at_signal", "prev_high", "prev_low",
]


def _ensure_file() -> None:
    if not LOG_FILE.exists():
        with open(LOG_FILE, "w", newline="") as f:
            csv.DictWriter(f, fieldnames=HEADERS).writeheader()


def log_signal(
    symbol: str,
    signal_type: str,
    scope: str,
    price_at_signal: float,
    volume: float = 0,
    prev_high: float = 0,
    prev_low: float = 0,
    notes: str = "",
) -> None:
    try:
        _ensure_file()
        row = {
            "timestamp": datetime.now(IST).strftime("%Y-%m-%d %H:%M:%S"),
            "symbol": symbol.replace(".NS", ""),
            "signal_type": signal_type.upper(),
            "scope": scope,
            "price_at_signal": round(float(price_at_signal), 2),
            "prev_high": round(float(prev_high), 2),
            "prev_low": round(float(prev_low), 2),
        }
        with open(LOG_FILE, "a", newline="") as f:
            csv.DictWriter(f, fieldnames=HEADERS).writerow(row)
    except Exception:
        pass  # never crash the scanner due to logging
