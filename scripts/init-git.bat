@echo off
echo Initializing Git repository for AcademiQR...
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please download and install Git from https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Git is installed!
echo.

REM Initialize repository
if not exist .git (
    echo Initializing Git repository...
    git init
    echo.
) else (
    echo Git repository already initialized.
    echo.
)

REM Configure git (if not already configured)
echo Checking Git configuration...
git config user.name >nul 2>&1
if errorlevel 1 (
    echo Please configure your Git identity:
    set /p GIT_NAME="Enter your name: "
    set /p GIT_EMAIL="Enter your email: "
    git config user.name "%GIT_NAME%"
    git config user.email "%GIT_EMAIL%"
)

echo.
echo Git configuration:
git config user.name
git config user.email
echo.

REM Make initial commit
echo Making initial commit...
git add .
git commit -m "Initial commit: AcademiQR v0.4.1"

echo.
echo ✅ Git repository initialized!
echo.
echo Next steps:
echo   1. Create a repository on GitHub/GitLab (optional)
echo   2. Add remote: git remote add origin YOUR_REPO_URL
echo   3. Push: git push -u origin main
echo.
pause


