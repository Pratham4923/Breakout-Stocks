@echo off
:: --- NUVAMA CREDENTIALS ---
set NUVAMA_API_KEY=Pp9FBwuTG0K9OA
set "NUVAMA_API_SECRET=Mz+WO1RHfAJk0b^E"

:: --- DAILY REQUEST ID (expires end of day) ---
set NUVAMA_REQUEST_ID=636639d0ce021275

echo Starting Breakout Stocks Scanner with Nuvama Feed...
python main.py
pause
