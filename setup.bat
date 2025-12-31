@echo off
echo ==========================================
echo   Quantum Digital Twin - Setup Script
echo ==========================================
echo.

echo [1/2] Installing Frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Frontend installation failed.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Installing Backend dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Backend installation failed.
    pause
    exit /b %errorlevel%
)

echo.
echo ==========================================
echo   Setup Complete!
echo   Run 'start.bat' to launch the platform.
echo ==========================================
echo.
pause
