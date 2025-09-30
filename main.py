import streamlit as st
import yfinance as yf
import pandas as pd
import datetime as dt
import pytz
import gc
from streamlit_autorefresh import st_autorefresh

# Timezone for India
IST = pytz.timezone("Asia/Kolkata")

# List of NSE stock symbols
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

BATCH_SIZE = 7  # Small batch size for memory optimization

# Auto-refresh every 2 seconds (2000 milliseconds)
count = st_autorefresh(interval=2000, limit=None, key="datarefresh")

def to_float(val):
    try:
        return float(val)
    except Exception:
        return None

def check_breakouts_batch(symbols):
    results = []
    now_time = dt.datetime.now(IST).strftime("%H:%M:%S")
    today = dt.datetime.now(IST).date()

    try:
        hist = yf.download(
            symbols,
            period="2d",
            interval="1m",
            progress=False,
            group_by='ticker',
            auto_adjust=False,
            threads=True,
            prepost=False
        )
    except Exception as e:
        st.error(f"Error downloading batch data: {e}")
        return results

    if hist.empty:
        return results

    for symbol in symbols:
        try:
            if len(symbols) == 1:
                df = hist[['Close', 'High', 'Low']].copy()
            else:
                if symbol not in hist.columns.levels[0]:
                    continue
                df = hist[symbol][['Close', 'High', 'Low']].astype('float32').copy()

            df = df[~df.index.duplicated(keep='last')]

            today_data = df[df.index.date == today]
            if today_data.empty:
                continue

            ltp = to_float(df["Close"].iloc[-1])
            today_high = to_float(today_data["High"].max())
            today_low = to_float(today_data["Low"].min())

            if ltp is None or today_high is None or today_low is None:
                continue

            if ltp >= today_high or ltp <= today_low:
                results.append([
                    symbol.replace(".NS", ""),
                    "DAY HIGH" if ltp >= today_high else "DAY LOW",
                    round(ltp, 2),
                    now_time
                ])

            del df
            gc.collect()

        except Exception as e:
            st.warning(f"Error processing {symbol}: {e}")
            continue

    del hist
    gc.collect()

    return results

# Custom CSS for better table visibility
st.markdown("""
    <style>
    .dataframe th, .dataframe td {
        padding: 10px 12px !important;
        font-size: 15px !important;
    }
    .dataframe th {
        font-weight: bold !important;
        background-color: #f0f0f0 !important;
    }
    </style>
""", unsafe_allow_html=True)

st.set_page_config(page_title="Live Breakout Scanner", layout="wide")
st.title("📈 Live Breakout Stocks (NSE India)")

all_results = []

for i in range(0, len(STOCKS), BATCH_SIZE):
    batch = STOCKS[i:i+BATCH_SIZE]
    batch_results = check_breakouts_batch(batch)
    if batch_results:
        all_results.extend(batch_results)

if all_results:
    columns = ["Name", "Breakout for", "LTP", "Time"]
    df = pd.DataFrame(all_results, columns=columns)

    def highlight_breakout(row):
        if row["Breakout for"] == "DAY HIGH":
            return ['background-color: #4CAF50; color: white; font-weight: bold; font-size: 16px'] * len(row)
        elif row["Breakout for"] == "DAY LOW":
            return ['background-color: #F44336; color: white; font-weight: bold; font-size: 16px'] * len(row)
        else:
            return [''] * len(row)

    st.markdown("### 🔥 Breakout Stocks Detected")
    st.dataframe(df.style.apply(highlight_breakout, axis=1), hide_index=True, use_container_width=True)
else:
    st.info("No breakout detected right now.")
