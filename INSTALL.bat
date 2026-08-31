@echo off
title Pandaverse Setup
color 0E

echo ============================================================
echo   PANDAVERSE - SETUP HELPER
echo ============================================================
echo.

REM Check if running from the project root
if not exist "%~dp0package.json" (
    echo X ERROR: This script must be inside the pandaverse-gharana-portal folder!
    echo.
    echo This folder should contain package.json
    echo If the folder is in a different location, move this script there.
    pause
    exit /b 1
)

echo [OK] Found project folder!
echo [OK] package.json found
echo.

REM Check Node.js
echo [1] Checking Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo     X Node.js is NOT installed!
    echo.
    echo     Please install from: https://nodejs.org
    echo     Download the LTS version (big green button)
    echo     Run the installer, accept defaults, restart computer
    echo     Then run this script again.
    echo.
    start https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%a in ('node -v') do echo     Node.js: %%a
for /f "tokens=*" %%a in ('npm -v') do echo     npm: %%a
echo.

REM Ask user to proceed
echo [2] Ready to install project dependencies
echo.
echo This will run: npm install
echo It takes 2-5 minutes.
echo.
echo Make sure your .env.local file is ready with your Supabase credentials.
echo.
pause

REM Run npm install
echo.
echo [3] Running npm install...
echo.
call npm install

echo.
echo ============================================================
echo   INSTALLATION COMPLETE
echo ============================================================
echo.
echo Next steps:
echo   1. Start the app: npm run dev
echo   2. Open browser: http://localhost:3000
echo.
echo To start the app now, type: npm run dev
echo.

pause
