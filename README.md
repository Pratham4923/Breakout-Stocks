# 📈 Stock Breakout Scanner

A **real-time stock breakout scanner** built with **Streamlit** and **Yahoo Finance**.  
It scans **NSE F&O stocks** (India) and selected **US stocks** for new **Highs and Lows** across different timeframes.

---

## ⚡ Features
- Monitors **NSE F&O stocks only** (with few US tickers like TSLA, NVDA, META, etc.)
- Detects breakouts on:
  - Day High/Low  
  - 2 Days  
  - Week  
  - 2 Weeks  
  - Month  
  - 3 Months  
  - 52 Weeks  
- Displays **symbol, LTP, % change, timestamp**
- Color-coded:
  - 🟩 Green → New High  
  - 🟥 Red → New Low  
- Updates **automatically every 8 seconds**
- Lightweight and optimized for **trading hours (9:30 AM – 3:30 PM IST)**

---

## 📦 Requirements
- Python 3.9+  
- `requirements.txt` dependencies:
  ```txt
  streamlit>=1.25.0
  yfinance>=0.2.31
  pandas>=2.0.3
  numpy>=1.25.0
🚀 Setup & Run
1️⃣ Clone or download this repository
bash
Copy code
git clone https://github.com/Pratham4923/Breakout-Stocks.git
cd stock-scanner
2️⃣ Install dependencies
bash
Copy code
pip install -r requirements.txt
3️⃣ Run the app
bash
Copy code
streamlit run test.py
⚡ One-Click Launch
We’ve included launch scripts for Windows and Linux/Mac:

▶ Windows
Double-click:

Copy code
setup_and_run.bat
▶ Linux/Mac
bash
Copy code
chmod +x setup_and_run.sh
./setup_and_run.sh
📌 Notes
Only NSE F&O stocks are supported for Indian markets

Recommended usage: Run only during NSE market hours (9:30 AM – 3:30 PM IST) for best performance

Future Improvements

Alerts (email / Telegram / sound notifications)

Custom stock lists

Faster data fetching with multi-threading
