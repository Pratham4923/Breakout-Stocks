import streamlit as st
import yfinance as yf
import pandas as pd
import datetime as dt
import time

# Config
REFRESH_INTERVAL = 8  # seconds
INDIAN_MARKET_START = dt.time(9, 30)
INDIAN_MARKET_END = dt.time(15, 30)

# NSE F&O + Extra US stocks
stocks = [
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

# Breakout periods
periods = {
    "DAY HIGH": "1d",
    "DAY LOW": "1d",
    "WEEK HIGH": "5d",
    "WEEK LOW": "5d",
    "MONTH HIGH": "1mo",
    "MONTH LOW": "1mo",
    "3M HIGH": "3mo",
    "3M LOW": "3mo",
    "52W HIGH": "1y",
    "52W LOW": "1y"
}

@st.cache_data
def get_history(symbol, period="1y"):
    try:
        return yf.Ticker(symbol).history(period=period)
    except Exception:
        return pd.DataFrame()

def check_breakouts(symbol):
    results = []
    data = get_history(symbol)
    if data.empty:
        return results

    ltp = data["Close"].iloc[-1]
    prev_close = data["Close"].iloc[-2] if len(data) > 1 else ltp
    change_pct = ((ltp - prev_close) / prev_close) * 100 if prev_close else 0
    now = dt.datetime.now().strftime("%d %b %Y, %I:%M:%S %p")

    for label, period in periods.items():
        df = get_history(symbol, period=period)
        if df.empty:
            continue
        high = df["High"].max()
        low = df["Low"].min()

        if "HIGH" in label and ltp >= high:
            results.append([symbol, round(ltp, 2), round(change_pct, 2), label, now, "High"])
        elif "LOW" in label and ltp <= low:
            results.append([symbol, round(ltp, 2), round(change_pct, 2), label, now, "Low"])
    return results

# Streamlit app
st.set_page_config(page_title="Stock Breakout Scanner", layout="wide")
st.title("📊 Stock Breakout Scanner (NSE F&O + US Stocks)")

current_time = dt.datetime.now().time()
if not (INDIAN_MARKET_START <= current_time <= INDIAN_MARKET_END):
    st.warning("⚠️ Market closed. App runs between 9:30 AM - 3:30 PM IST.")
else:
    all_results = []
    for stock in stocks:
        all_results.extend(check_breakouts(stock))

    if all_results:
        df = pd.DataFrame(all_results, columns=["Symbol", "LTP", "%change", "Event", "Time", "Type"])
        df = df.drop(columns=["Type"])  # Keep only display columns

        def highlight(row):
            if "HIGH" in row["Event"]:
                return ["background-color: lightgreen"] * len(row)
            elif "LOW" in row["Event"]:
                return ["background-color: salmon"] * len(row)
            return [""] * len(row)

        st.dataframe(df.style.apply(highlight, axis=1), use_container_width=True)
    else:
        st.info("No breakouts found right now.")

    # Auto refresh logic
    time.sleep(REFRESH_INTERVAL)
    st.rerun()
