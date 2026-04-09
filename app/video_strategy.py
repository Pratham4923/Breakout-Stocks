from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any
from urllib.parse import parse_qs, quote, urlparse
from urllib.request import urlopen


@dataclass(frozen=True)
class StrategyProfile:
    code: str
    label: str
    summary: str
    scan_focus: str
    keywords: tuple[str, ...]
    categories: tuple[str, ...]


STRATEGY_PROFILES: tuple[StrategyProfile, ...] = (
    StrategyProfile(
        code="orb",
        label="Opening Range Breakout",
        summary="Looks for names breaking the early session range with momentum and participation.",
        scan_focus="Favor fresh breakouts, expanding movers, and recent bullish alerts near session highs.",
        keywords=("opening range", "orb", "opening breakout", "first 5 minute", "first 15 minute", "range breakout"),
        categories=("breakout", "momentum"),
    ),
    StrategyProfile(
        code="vwap",
        label="VWAP Strategy",
        summary="Focuses on reclaim, pullback, or rejection around VWAP with intraday confirmation.",
        scan_focus="Favor movers with trend continuation and alerts that suggest reclaim, pullback, or trend control.",
        keywords=("vwap", "volume weighted average price", "vwap reclaim", "vwap pullback", "vwap rejection"),
        categories=("breakout", "mean_reversion"),
    ),
    StrategyProfile(
        code="smc",
        label="Smart Money Concepts",
        summary="Uses structure, liquidity, order blocks, fair value gaps, and sweeps for execution.",
        scan_focus="Favor live SMC signals, structure breaks, sweeps, CHoCH, BOS, and imbalance behavior.",
        keywords=("bos", "choch", "smart money", "smc", "order block", "fair value gap", "fvg", "liquidity sweep", "liquidity", "mitigation"),
        categories=("smc",),
    ),
    StrategyProfile(
        code="price-action",
        label="Price Action",
        summary="Reads trend, support or resistance, candles, and retests without heavy indicator dependence.",
        scan_focus="Favor clean breakouts or breakdowns with readable structure and straightforward continuation.",
        keywords=("price action", "support resistance", "engulfing", "inside bar", "trend continuation", "retest"),
        categories=("breakout", "breakdown"),
    ),
    StrategyProfile(
        code="pullback",
        label="Pullback Trend",
        summary="Waits for controlled retracement inside strong trend structure before entry.",
        scan_focus="Favor stronger names that are still constructive, not exhausted, and aligned with live breadth.",
        keywords=("pullback", "retracement", "buy the dip", "trend continuation", "ema pullback"),
        categories=("breakout",),
    ),
    StrategyProfile(
        code="gap-and-go",
        label="Gap and Go",
        summary="Targets stocks with strong opening gap and immediate continuation.",
        scan_focus="Favor leading movers, broad participation, and the strongest recent alert flow.",
        keywords=("gap and go", "gapper", "gap up", "opening momentum", "pre market"),
        categories=("breakout", "momentum"),
    ),
    StrategyProfile(
        code="mean-reversion",
        label="Mean Reversion",
        summary="Looks for overstretched price to return toward intraday mean after extension.",
        scan_focus="Favor opposing-side opportunities only when the tape is not broadly one-directional.",
        keywords=("mean reversion", "reversion", "fade move", "overextended", "return to mean"),
        categories=("mean_reversion",),
    ),
    StrategyProfile(
        code="momentum",
        label="Momentum Scalping",
        summary="Hunts fast expansion with volume, continuation, and quick execution.",
        scan_focus="Favor fastest movers, live alert bursts, and symbols already showing expansion.",
        keywords=("momentum", "scalp", "scalping", "volume spike", "range expansion"),
        categories=("momentum", "breakout", "breakdown"),
    ),
    StrategyProfile(
        code="swing",
        label="Swing Breakout",
        summary="Uses daily or weekly structure to find continuation names with room to run.",
        scan_focus="Favor cleaner higher timeframe leadership and symbols carrying multiple high-side flags.",
        keywords=("swing", "daily breakout", "weekly breakout", "positional", "multi day"),
        categories=("breakout",),
    ),
)


def extract_youtube_id(url: str) -> str | None:
    try:
        parsed = urlparse(url.strip())
    except Exception:
        return None
    host = parsed.netloc.lower()
    if "youtu.be" in host:
        candidate = parsed.path.strip("/").split("/", 1)[0]
        return candidate or None
    if "youtube.com" in host:
        if parsed.path == "/watch":
            return parse_qs(parsed.query).get("v", [None])[0]
        if parsed.path.startswith("/shorts/") or parsed.path.startswith("/embed/"):
            return parsed.path.strip("/").split("/", 1)[1].split("/", 1)[0]
    return None


def fetch_video_title(url: str) -> str | None:
    endpoint = f"https://www.youtube.com/oembed?url={quote(url, safe=':/?=&')}&format=json"
    try:
        with urlopen(endpoint, timeout=8) as response:
            payload = json.loads(response.read().decode("utf-8"))
        return payload.get("title")
    except Exception:
        return None


def fetch_transcript_text(video_id: str) -> str:
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except Exception as exc:
        raise RuntimeError(
            "YouTube transcript support is not installed yet. Add youtube-transcript-api and restart the server."
        ) from exc

    api = YouTubeTranscriptApi()
    try:
        transcript = api.fetch(video_id, languages=["en"])
    except Exception:
        try:
            transcript = api.fetch(video_id)
        except Exception as exc:
            raise RuntimeError(
                "Could not fetch a transcript for this video. The video may not have captions or may block transcript access."
            ) from exc

    return " ".join(getattr(chunk, "text", "") for chunk in transcript).strip()


def _score_profiles(text: str) -> list[dict[str, Any]]:
    haystack = f" {text.lower()} "
    scored: list[dict[str, Any]] = []
    for profile in STRATEGY_PROFILES:
        matches = [keyword for keyword in profile.keywords if keyword in haystack]
        if matches:
            scored.append(
                {
                    "code": profile.code,
                    "label": profile.label,
                    "summary": profile.summary,
                    "scan_focus": profile.scan_focus,
                    "keyword_hits": matches,
                    "score": len(matches),
                    "categories": list(profile.categories),
                }
            )
    scored.sort(key=lambda item: (-item["score"], item["label"]))
    return scored


def analyze_video_strategy(url: str) -> dict[str, Any]:
    video_id = extract_youtube_id(url)
    if not video_id:
        raise ValueError("Paste a valid YouTube watch, short, or share link.")

    title = fetch_video_title(url)
    transcript_text = ""
    transcript_status = "available"
    transcript_note = ""
    try:
        transcript_text = fetch_transcript_text(video_id)
    except RuntimeError as exc:
        transcript_status = "unavailable"
        transcript_note = str(exc)

    combined_text = " ".join(part for part in (title, transcript_text) if part)
    scored = _score_profiles(combined_text)

    if scored:
        primary = scored[0]
        tags = [item["label"] for item in scored[:4]]
        base_confidence = 55 + primary["score"] * 12
        confidence = min(96, base_confidence if transcript_text else max(32, base_confidence - 18))
    else:
        primary = {
            "code": "general-price-action",
            "label": "General Price Action",
            "summary": "The video discusses trading concepts but no single named framework dominated the available video context.",
            "scan_focus": "Use broader breakout, breakdown, and structure pages to review live opportunities.",
            "keyword_hits": [],
            "score": 0,
            "categories": ["breakout", "breakdown", "smc"],
        }
        tags = ["General Price Action"]
        confidence = 38 if transcript_text else 24

    transcript_preview = transcript_text[:700].strip()
    if len(transcript_text) > 700:
        transcript_preview += "..."
    if not transcript_preview:
        transcript_preview = "Transcript unavailable. Strategy was inferred from the video title and available YouTube metadata."

    return {
        "url": url,
        "video_id": video_id,
        "title": title or f"YouTube video {video_id}",
        "primary_strategy": primary,
        "detected_strategies": scored[:5],
        "transcript_preview": transcript_preview,
        "transcript_length": len(transcript_text.split()),
        "confidence": confidence,
        "tags": tags,
        "analysis_source": "transcript" if transcript_text else "title_only",
        "transcript_status": transcript_status,
        "transcript_note": transcript_note,
    }


def build_strategy_matches(analysis: dict[str, Any], snapshot: dict[str, Any]) -> dict[str, Any]:
    primary = analysis.get("primary_strategy", {})
    categories = set(primary.get("categories", []))
    movers = snapshot.get("movers", [])
    recent_alerts = snapshot.get("recent_alerts", [])
    smc_signals = snapshot.get("smc_signals", [])

    breakout_candidates = [
        mover for mover in movers
        if any("HIGH" in flag for flag in mover.get("flags", [])) or float(mover.get("change_percent") or 0) >= 0
    ]
    breakdown_candidates = [
        mover for mover in movers
        if any("LOW" in flag for flag in mover.get("flags", [])) or float(mover.get("change_percent") or 0) < 0
    ]

    if "smc" in categories:
        matched_movers = [
            {
                "symbol": signal.get("display_symbol"),
                "setup": signal.get("signal"),
                "bias": signal.get("bias"),
                "price": signal.get("live_price"),
                "detail": signal.get("detail"),
            }
            for signal in smc_signals[:8]
        ]
    elif "breakdown" in categories and "breakout" not in categories:
        matched_movers = [
            {
                "symbol": mover.get("symbol"),
                "setup": "Breakdown",
                "bias": "Bearish",
                "price": mover.get("price"),
                "detail": ", ".join(mover.get("flags", [])) or "Weakness building",
            }
            for mover in breakdown_candidates[:8]
        ]
    else:
        source = breakout_candidates if breakout_candidates else movers
        matched_movers = [
            {
                "symbol": mover.get("symbol"),
                "setup": "Breakout" if float(mover.get("change_percent") or 0) >= 0 else "Breakdown",
                "bias": "Bullish" if float(mover.get("change_percent") or 0) >= 0 else "Bearish",
                "price": mover.get("price"),
                "detail": ", ".join(mover.get("flags", [])) or "Momentum building",
            }
            for mover in source[:8]
        ]

    alert_matches = [
        {
            "symbol": alert.get("display_symbol"),
            "scope": alert.get("scope"),
            "direction": alert.get("direction"),
            "price": alert.get("price"),
            "detail": f"{alert.get('scope')} {alert.get('direction')}",
        }
        for alert in recent_alerts[:6]
    ]

    if "smc" in categories:
        lens = "SMC lens"
        guidance = "Focus on liquidity events, structure shifts, order-block behavior, and fair value gap continuation."
    elif "mean_reversion" in categories:
        lens = "Mean reversion lens"
        guidance = "Be selective. Best results usually come when the market is balanced rather than in broad one-way expansion."
    elif "momentum" in categories:
        lens = "Momentum lens"
        guidance = "Favor names already expanding with fresh alerts, strong breadth, and visible continuation."
    else:
        lens = "Breakout lens"
        guidance = "Favor clean continuation names, especially those with multiple high-side flags and recent signal flow."

    return {
        "scanner_lens": lens,
        "guidance": guidance,
        "matched_movers": matched_movers,
        "matched_alerts": alert_matches,
        "matched_smc": smc_signals[:6],
    }
