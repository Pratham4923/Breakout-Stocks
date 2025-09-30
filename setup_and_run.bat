@echo off
echo =======================================
echo   Stock Scanner Setup and Launcher
echo =======================================

:: Step 1 - Create virtual environment if it doesn’t exist
IF NOT EXIST .venv (
    echo Creating virtual environment...
    python -m venv .venv
)

:: Step 2 - Activate virtual environment
call .venv\Scripts\activate

:: Step 3 - Upgrade pip
python -m pip install --upgrade pip

:: Step 4 - Install requirements
echo Installing dependencies...
pip install -r requirements.txt

:: Step 5 - Run the Streamlit app
echo Starting Streamlit app...
streamlit run main.py

pause
