import streamlit as st
import yfinance as yf
import pandas as pd
from datetime import datetime, time
from streamlit_autorefresh import st_autorefresh

# ---------------- STOCK LIST ---------------- #
stocks = [ 
    # NSE
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
    "NAUKRI.NS", "NAVINFLUOR.NS", "NESTLEIND.NS", "NUVAMA.NS", "NYKAA.NS",
    "OBEROIRLTY.NS", "OFSS.NS", "OIL.NS", "ONGC.NS", "PAGEIND.NS",
    "PATANJALI.NS", "PAYTM.NS", "PERSISTENT.NS", "PETRONET.NS", "PFC.NS",
    "PIDILITIND.NS", "PIIND.NS", "PNB.NS", "PNBHOUSING.NS", "POLICYBZR.NS",
    "POLYCAB.NS", "POWERGRID.NS", "PRESTIGE.NS", "PPLPHARMA.NS", "PSB.NS",
    "RAIN.NS", "RAMCOCEM.NS", "RBLBANK.NS", "RECLTD.NS", "RELIANCE.NS",
    "RVNL.NS", "SAIL.NS", "SBICARD.NS", "SBILIFE.NS", "SBIN.NS", "SHREECEM.NS",
    "SHRIRAMFIN.NS", "SIEMENS.NS", "SOLARINDS.NS", "SONACOMS.NS", "SRF.NS",
    "SUNPHARMA.NS", "SUNTV.NS", "SYNGENE.NS", "SAMMAANCAP.NS", "SUPREMEIND.NS",
    "SUZLON.NS", "TATACHEM.NS", "TATACOMM.NS", "TATACONSUM.NS", "TATAELXSI.NS",
    "TATAMOTORS.NS", "TATAPOWER.NS", "TATASTEEL.NS", "TATATECH.NS", "TCS.NS",
    "TECHM.NS", "TIINDIA.NS", "TITAGARH.NS", "TITAN.NS", "TORNTPHARM.NS",
    "TORNTPOWER.NS", "TRENT.NS", "TVSMOTOR.NS", "UBL.NS", "ULTRACEMCO.NS",
    "UNIONBANK.NS", "UNITDSPR.NS", "UNOMINDA.NS", "UPL.NS", "VBL.NS", "VEDL.NS",
    "VOLTAS.NS", "WHIRLPOOL.NS", "WIPRO.NS", "YESBANK.NS", "ZEEL.NS", "ZYDUSLIFE.NS",
]

# ---------------- STREAMLIT SETUP ---------------- #
st.set_page_config(page_title="Stock Scanner", layout="wide")

# Hide Streamlit UI
hide_st = """
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    </style>
"""
st.markdown(hide_st, unsafe_allow_html=True)

# ---------------- FUNCTIONS ---------------- #
@st.cache_data(ttl=60)
def get_history(symbol, period="1y"):
    try:
        return yf.Ticker(symbol).history(period=period, interval="1d")
    except:
        return pd.DataFrame()

def check_breakouts(symbol):
    data = get_history(symbol)
    if data.empty:
        return []

    ltp = data["Close"].iloc[-1]
    prev_close = data["Close"].iloc[-2] if len(data) > 1 else ltp
    change_pct = round(((ltp - prev_close) / prev_close) * 100, 2) if prev_close else 0

    conditions = {
        "Day High": ltp >= data["High"].iloc[-1],
        "2-Day High": ltp >= data["High"].iloc[-2:].max(),
        "Week High": ltp >= data["High"].iloc[-5:].max(),
        "2-Week High": ltp >= data["High"].iloc[-10:].max(),
        "Month High": ltp >= data["High"].iloc[-22:].max(),
        "3-Month High": ltp >= data["High"].iloc[-66:].max(),
        "52-Week High": ltp >= data["High"].max(),
        "Day Low": ltp <= data["Low"].iloc[-1],
        "2-Day Low": ltp <= data["Low"].iloc[-2:].min(),
        "Week Low": ltp <= data["Low"].iloc[-5:].min(),
        "2-Week Low": ltp <= data["Low"].iloc[-10:].min(),
        "Month Low": ltp <= data["Low"].iloc[-22:].min(),
        "3-Month Low": ltp <= data["Low"].iloc[-66:].min(),
        "52-Week Low": ltp <= data["Low"].min(),
    }

    results = []
    for label, condition in conditions.items():
        if condition:
            results.append({
                "Symbol": symbol,
                "LTP": round(ltp, 2),
                "Change %": change_pct,
                "Condition": label,
                "Time": datetime.now().strftime("%H:%M:%S")
            })
    return results

# ---------------- MARKET HOURS CHECK ---------------- #
def is_market_open():
    now = datetime.now().time()
    start, end = time(9, 30), time(15, 30)
    return start <= now <= end

# ---------------- MAIN APP ---------------- #
st.title("📈 NSE Stock High/Low Scanner")

if is_market_open():
    all_results = []
    for stock in stocks:
        all_results.extend(check_breakouts(stock))

    df = pd.DataFrame(all_results)

    if not df.empty:
        def highlight(row):
            color = "background-color: green; color: white;" if "High" in row["Condition"] else "background-color: red; color: white;"
            return [color] * len(row)

        st.dataframe(df.style.apply(highlight, axis=1), use_container_width=True)
    else:
        st.info("⚡ No breakouts detected right now")

    # Auto refresh every 8s
    st_autorefresh(interval=8000, limit=None, key="refresh_key")

else:
    st.warning("⏳ Market is closed. Scanner runs between **9:30 AM - 3:30 PM IST**.")
