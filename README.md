# Breakout Stocks

Real-time NSE breakout scanner rebuilt around a websocket-first architecture.

## What changed

- Replaced the old single-file Streamlit poller with a `FastAPI` app
- Added a browser dashboard that updates over a websocket connection
- Added live alert feed with sound alerts and browser notifications
- Switched quote ingestion to `yfinance.AsyncWebSocket` for faster updates
- Moved breakout reference calculations into a background refresh job
- Added a separate `SMC Concepts` section for BOS, liquidity sweeps, and fair value gap context
- Added self-healing watchdog logic for stale stream detection and automatic session recovery
- Added a health endpoint and snapshot API for easier debugging

## Breakout scopes

- `Live Day`
- `Day`
- `2 Days`
- `Week`
- `2 Weeks`
- `Month`
- `3 Months`
- `52 Weeks`

`Live Day` uses the quote stream's current session high and low. The other scopes are built from refreshed daily history.

## Run locally

```bash
python -m pip install -r requirements.txt
python main.py
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Optional environment variables

- `HOST` default `127.0.0.1`
- `PORT` default `8000`
- `SCANNER_SYMBOLS` comma-separated custom symbol list
- `REFRESH_INTERVAL_SECONDS` default `300`
- `ALERT_COOLDOWN_SECONDS` default `300`
- `QUOTE_SUBSCRIPTION_CHUNK` default `80`
- `HISTORY_DOWNLOAD_CHUNK` default `30`

## Endpoints

- `/` dashboard
- `/ws` dashboard websocket
- `/api/snapshot` current scanner snapshot
- `/healthz` health information

## Notes

- Yahoo Finance data is intended for personal and educational use.
- The scanner is optimized for NSE symbols from the original project list.
- If Yahoo temporarily drops the stream, the app retries automatically.
