@echo off
echo Academiq Version Switcher
echo ========================
echo.
echo 1. Use Version 0.1 (Original - Light Theme)
echo 2. Use Version 0.2 (New - Dark Theme)
echo 3. Exit
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo Switching to Version 0.1 (Original)...
    copy academiq-v0.1.html academiq.html
    copy package-v0.1.json package.json
    copy vite-v0.1.config.js vite.config.js
    echo Done! Version 0.1 is now active.
    echo Open academiq.html in your browser.
) else if "%choice%"=="2" (
    echo Switching to Version 0.2 (New)...
    echo Version 0.2 is already active.
    echo Open academiq.html in your browser.
) else if "%choice%"=="3" (
    echo Goodbye!
    exit
) else (
    echo Invalid choice. Please run the script again.
)

pause


