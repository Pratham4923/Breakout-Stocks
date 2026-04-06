@echo off
setlocal

cd /d "%~dp0"

echo Installing dependencies...
python -m pip install -r requirements.txt
if errorlevel 1 (
  echo Dependency installation failed.
  pause
  exit /b 1
)

echo Starting Breakout Stocks dashboard...
python main.py

pause
