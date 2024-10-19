@echo off
title Blum V III
setlocal

:: Open terminal here
cd /d %~dp0

:: Set Welcome
echo Tool ne thang Tam ngu

:: Check version Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js Not installed yet. Please install Node.js first
    exit /b 1
)

:: Run npm install
if not exist node_modules (
    echo The node_modules directory not found. Run npm install...
    npm install
) else (
    echo Installed successfully. Blum
)

:: Run index.js for Node.js
echo Loading Tool...
npm run start

:: pause
pause

endlocal