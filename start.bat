@echo off
title Quantum Digital Twin Launchpad
echo ==========================================
echo   Quantum Digital Twin - Platform Starter
echo ==========================================
echo.

:: Check for node_modules
if not exist "node_modules\" (
    echo [!] Frontend dependencies missing. Running setup...
    call npm install
)

echo [1/2] Starting Backend Server...
start "Quantum-Backend" cmd /k "cd backend && python app.py"

echo.
echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server...
start "Quantum-Frontend" cmd /k "npm run dev"

echo.
echo ==========================================
echo   Servers are starting!
echo.
echo   - DASHBOARD: http://localhost:3000
echo   - BACKEND API: http://localhost:5000
echo.
echo   Happy Hacking!
echo ==========================================
echo.
pause
