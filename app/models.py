from __future__ import annotations

from dataclasses import asdict, dataclass


@dataclass(slots=True)
class BreakoutLevel:
    label: str
    high: float | None = None
    low: float | None = None


@dataclass(slots=True)
class Quote:
    symbol: str
    price: float
    change_percent: float | None
    day_high: float | None
    day_low: float | None
    timestamp: str

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass(slots=True)
class BreakoutAlert:
    symbol: str
    display_symbol: str
    scope: str
    direction: str
    price: float
    threshold: float
    change_percent: float | None
    timestamp: str

    def key(self) -> tuple[str, str, str]:
        return (self.symbol, self.scope, self.direction)

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass(slots=True)
class SmcSignal:
    symbol: str
    display_symbol: str
    signal: str
    bias: str
    reference_price: float | None
    live_price: float | None
    detail: str
    timestamp: str

    def to_dict(self) -> dict:
        return asdict(self)
