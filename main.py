import streamlit as st
import yfinance as yf
import pandas as pd
import datetime

# ---------------- SETTINGS ---------------- #
STOCKS = [
    "360ONE.NS", "ABB.NS", "ABBOTINDIA.NS", "ABCAPITAL.NS", "ABFRL.NS", "ACC.NS",
    "ADANIENSOL.NS", "ADANIENT.NS", "ADANIGREEN.NS", "ADANIPORTS.NS", "ALKEM.NS",
    "AMBER.NS", "AMBUJACEM.NS", "ANGELONE.NS", "APOLLOHOSP.NS", "APOLLOTYRE.NS",
    "ASHOKLEY.NS", "ASIANPAINT.NS", "ASTRAL.NS", "ATUL.NS", "AUBANK.NS",
    "AUROPHARMA.NS", "AXISBANK.NS", "BAJAJ-AUTO.NS", "BAJAJFINSV.NS",
    "BAJFINANCE.NS", "BALKRISIND.NS", "BALRAMCHIN.NS", "BANDHANBNK.NS",
    "BANKBARODA.NS", "BANKINDIA.NS", "BATAINDIA.NS", "BDL.NS", "BEL.NS",
    "BERGEPAINT.NS", "BHARATFORG.NS", "BHARTIARTL.NS", "BHEL.NS", "BIOCON.NS",
    "BLUESTARCO.NS", "BOSCHLTD.NS", "BPCL.NS", "BRITANNIA.NS", "BSOFT.NS",
    "BSE.NS", "CANBK.NS", "CANFINHOME.NS", "CDSL.NS", "CHAMBLFERT.NS",
    "CHOLAFIN.NS", "CIPLA.NS", "COALINDIA.NS", "COFORGE.NS", "COLPAL.NS",
    "CONCOR.NS", "COROMANDEL.NS", "CROMPTON.NS", "CUB.NS", "CUMMINSIND.NS",
    "CYIENT.NS", "DABUR.NS", "DALBHARAT.NS", "DEEPAKNTR.NS", "DELHIVERY.NS",
    "DELTACORP.NS", "DIVISLAB.NS", "DIXON.NS", "DLF.NS", "DRREDDY.NS",
    "EICHERMOT.NS", "ESCORTS.NS", "EXIDEIND.NS", "FEDERALBNK.NS", "FORTIS.NS",
    "FSL.NS", "GAIL.NS", "GLENMARK.NS", "GMRAIRPORT.NS", "GNFC.NS",
    "GODREJCP.NS", "GODREJPROP.NS", "GRANULES.NS", "GRASIM.NS", "GSPL.NS",
    "GUJGASLTD.NS", "HAL.NS", "HAVELLS.NS", "HCLTECH.NS", "HDFCAMC.NS",
    "HDFCBANK.NS", "HDFCLIFE.NS", "HEROMOTOCO.NS", "HINDALCO.NS",
    "HINDCOPPER.NS", "HINDPETRO.NS", "HINDUNILVR.NS", "HINDZINC.NS", "HONAUT.NS",
    "HUDCO.NS", "ICICIBANK.NS", "ICICIGI.NS", "ICICIPRULI.NS", "IDEA.NS",
    "IDFCFIRSTB.NS", "IEX.NS", "IGL.NS", "INDHOTEL.NS", "INDIANB.NS",
    "INDIACEM.NS", "INDIAMART.NS", "INDIGO.NS", "INDUSINDBK.NS", "INDUSTOWER.NS",
    "INFY.NS", "INTELLECT.NS", "IOC.NS", "IPCALAB.NS", "IRCTC.NS", "IRFC.NS",
    "IREDA.NS", "ITC.NS", "JINDALSTEL.NS", "JKCEMENT.NS", "JIOFIN.NS",
    "JSWENERGY.NS", "JSWSTEEL.NS", "JUBLFOOD.NS", "KALYANKJIL.NS", "KAYNES.NS",
    "KEI.NS", "KFINTECH.NS", "KOTAKBANK.NS", "LALPATHLAB.NS", "LAURUSLABS.NS",
    "LICHSGFIN.NS", "LICI.NS", "LODHA.NS", "LT.NS", "LTF.NS", "LTIM.NS",
    "LTTS.NS", "LUPIN.NS", "M&M.NS", "M&MFIN.NS", "MANAPPURAM.NS", "MANKIND.NS",
    "MARICO.NS", "MARUTI.NS", "MAZDOCK.NS", "MCX.NS", "METROPOLIS.NS",
    "MFSL.NS", "MGL.NS", "MOTHERSON.NS", "MPHASIS.NS", "MRF.NS", "MUTHOOTFIN.NS",
    "NBCC.NS", "NCC.NS", "NHPC.NS", "NMDC.NS", "NTPC.NS", "NATIONALUM.NS",
    "NAUKRI.NS", "NAVINFLUOR.NS", "NESTLEIND.NS", "NMDC.NS", "NTPC.NS",
    "NUVAMA.NS", "NYKAA.NS", "OBEROIRLTY.NS", "OFSS.NS", "OIL.NS", "ONGC.NS",
    "PAGEIND.NS", "PATANJALI.NS", "PAYTM.NS", "PERSISTENT.NS",
    "PETRONET.NS", "PFC.NS", "PIDILITIND.NS", "PIIND.NS", "PNB.NS", "PNBHOUSING.NS",
    "POLICYBZR.NS", "POLYCAB.NS", "POWERGRID.NS", "PRESTIGE.NS", "PPLPHARMA.NS",
    "PSB.NS", "RAIN.NS", "RAMCOCEM.NS", "RBLBANK.NS", "RECLTD.NS", "RELIANCE.NS",
    "RVNL.NS", "SAIL.NS", "SBICARD.NS", "SBILIFE.NS", "SBIN.NS", "SHREECEM.NS",
    "SHRIRAMFIN.NS", "SIEMENS.NS", "SOLARINDS.NS", "SONACOMS.NS", "SRF.NS",
    "SUNPHARMA.NS", "SUNTV.NS", "SYNGENE.NS", "SAMMAANCAP.NS", "SUPREMEIND.NS",
    "SUZLON.NS", "TATACHEM.NS", "TATACOMM.NS", "TATACONSUM.NS", "TATAELXSI.NS",
    "TATAMOTORS.NS", "TATAPOWER.NS", "TATASTEEL.NS", "TATATECH.NS", "TCS.NS",
    "TECHM.NS", "TIINDIA.NS", "TITAGARH.NS", "TITAN.NS", "TORNTPHARM.NS",
    "TORNTPOWER.NS", "TRENT.NS", "TVSMOTOR.NS", "UBL.NS", "ULTRACEMCO.NS",
    "UNIONBANK.NS", "UNITDSPR.NS", "UNOMINDA.NS", "UPL.NS", "VBL.NS", "VEDL.NS",
    "VOLTAS.NS", "WHIRLPOOL.NS", "WIPRO.NS", "YESBANK.NS", "ZEEL.NS", "ZYDUSLIFE.NS"
]
REFRESH_INTERVAL = 8  # seconds
MARKET_OPEN = datetime.time(9, 30)
MARKET_CLOSE = datetime.time(15, 30)
# ------------------------------------------ #

st.set_page_config(page_title="Stock Breakout Scanner", layout="wide")

# Check if market is open
def is_market_open():
    now = datetime.datetime.now().time()
    return MARKET_OPEN <= now <= MARKET_CLOSE

# Fetch stock data
def fetch_stock_data(symbol):
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="1y")
        if hist.empty:
            return None

        ltp = hist["Close"].iloc[-1]
        prev_close = hist["Close"].iloc[-2] if len(hist) > 1 else ltp
        change_pct = ((ltp - prev_close) / prev_close) * 100 if prev_close else 0

        return {
            "Symbol": symbol,
            "LTP": round(ltp, 2),
            "Change %": round(change_pct, 2),
            "Day High": hist["High"].iloc[-1],
            "Day Low": hist["Low"].iloc[-1],
            "2D High": hist["High"].iloc[-2:].max(),
            "2D Low": hist["Low"].iloc[-2:].min(),
            "Week High": hist["High"].iloc[-5:].max(),
            "Week Low": hist["Low"].iloc[-5:].min(),
            "2W High": hist["High"].iloc[-10:].max(),
            "2W Low": hist["Low"].iloc[-10:].min(),
            "Month High": hist["High"].iloc[-22:].max(),
            "Month Low": hist["Low"].iloc[-22:].min(),
            "3M High": hist["High"].iloc[-66:].max(),
            "3M Low": hist["Low"].iloc[-66:].min(),
            "52W High": hist["High"].max(),
            "52W Low": hist["Low"].min(),
        }
    except Exception:
        return None

# Find breakout entries
def breakout_entries(row):
    ltp = row["LTP"]
    entries = []
    conditions = {
        "Day High": ltp >= row["Day High"],
        "Day Low": ltp <= row["Day Low"],
        "2D High": ltp >= row["2D High"],
        "2D Low": ltp <= row["2D Low"],
        "Week High": ltp >= row["Week High"],
        "Week Low": ltp <= row["Week Low"],
        "2W High": ltp >= row["2W High"],
        "2W Low": ltp <= row["2W Low"],
        "Month High": ltp >= row["Month High"],
        "Month Low": ltp <= row["Month Low"],
        "3M High": ltp >= row["3M High"],
        "3M Low": ltp <= row["3M Low"],
        "52W High": ltp >= row["52W High"],
        "52W Low": ltp <= row["52W Low"],
    }
    for cond, hit in conditions.items():
        if hit:
            entries.append({
                "Symbol": row["Symbol"],
                "LTP": row["LTP"],
                "Change %": row["Change %"],
                "Condition": cond,
                "Time": datetime.datetime.now().strftime("%H:%M:%S")
            })
    return entries

# Highlight rows
def highlight_row(row):
    if "High" in row["Condition"]:
        return ["background-color: lightgreen"] * len(row)
    elif "Low" in row["Condition"]:
        return ["background-color: salmon"] * len(row)
    return [""] * len(row)

# Title
st.title("📊 Stock Breakout Scanner")

# Main app
if is_market_open():
    all_entries = []
    for stock in STOCKS:
        data = fetch_stock_data(stock)
        if data:
            all_entries.extend(breakout_entries(data))

    if all_entries:
        df = pd.DataFrame(all_entries)
        st.dataframe(df.style.apply(highlight_row, axis=1), use_container_width=True)
    else:
        st.info("✅ No breakouts at the moment.")

else:
    st.warning("⏳ Market is closed. The scanner runs from 9:30 AM to 3:30 PM.")
