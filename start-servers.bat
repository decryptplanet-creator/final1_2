@echo off
echo ========================================
echo    SialkotHub - Starting All Servers
echo ========================================

echo.
echo [1/3] Starting Auth Server (port 5003)...
start "Auth Server :5003" cmd /k "cd /d C:\Users\hp\final1_2 && node authServer.js"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Chat Server (port 5001)...
start "Chat Server :5001" cmd /k "cd /d C:\Users\hp\final1_2 && node server.js"

timeout /t 2 /nobreak >nul

echo [3/3] Starting FastAPI Server (port 8000)...
start "FastAPI :8000" cmd /k "cd /d C:\Users\hp\final1_2 && .venv\Scripts\python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000"

echo.
echo ========================================
echo  All servers started!
echo  Auth  : http://10.3.11.33:5003
echo  Chat  : http://10.3.11.33:5001
echo  CNIC  : http://10.3.11.33:8000
echo ========================================
pause
