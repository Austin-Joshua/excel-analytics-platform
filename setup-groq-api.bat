@echo off
REM Groq API Setup Script for Windows

echo.
echo ====================================
echo  GROQ API KEY SETUP
echo ====================================
echo.
echo This script will help you set up your Groq API key.
echo.
echo Steps:
echo 1. Go to https://console.groq.com/keys
echo 2. Copy your API key (starts with gsk_)
echo 3. Paste it below when prompted
echo.

setlocal enabledelayedexpansion

set /p GROQ_KEY="Enter your Groq API key: "

if "%GROQ_KEY%"=="" (
    echo.
    echo ERROR: No API key provided!
    echo Please try again.
    pause
    exit /b 1
)

echo.
echo Setting environment variable...
setx GROQ_API_KEY "%GROQ_KEY%"

echo.
echo ====================================
echo  SUCCESS! ✓
echo ====================================
echo.
echo Your Groq API key has been set.
echo.
echo IMPORTANT: You must RESTART your backend server for changes to take effect!
echo.
echo Steps:
echo 1. Stop the backend server (Ctrl+C)
echo 2. Run: npm start
echo 3. The AI provider should now be configured
echo.
echo For more help, see GROQ_API_SETUP.md
echo.

pause
