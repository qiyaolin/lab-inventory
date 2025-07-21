@echo off
setlocal enabledelayedexpansion

:: Lab Inventory System - Git Cleanup Script (Windows)
:: This script removes unnecessary files from git tracking

echo 🧹 Starting Git Cleanup for Lab Inventory System...
echo =================================================

:: Check if we're in a git repository
if not exist ".git" (
    echo ❌ Error: Not in a git repository. Please run this script from the project root.
    pause
    exit /b 1
)

:: Remove large directories and files from git tracking
echo 📁 Removing large directories from git tracking...

:: Frontend node_modules and build files
git rm -r --cached frontend/node_modules/ >nul 2>&1 || echo    - node_modules/ not tracked
git rm -r --cached frontend/build/ >nul 2>&1 || echo    - build/ not tracked
git rm -r --cached frontend/dist/ >nul 2>&1 || echo    - dist/ not tracked

:: Backend virtual environment
git rm -r --cached backend/venv/ >nul 2>&1 || echo    - venv/ not tracked
git rm -r --cached backend/env/ >nul 2>&1 || echo    - env/ not tracked

:: Database files
git rm --cached backend/db.sqlite3 >nul 2>&1 || echo    - db.sqlite3 not tracked

:: Python cache files
echo 🐍 Removing Python cache files...
for /r . %%i in (__pycache__) do (
    if exist "%%i" (
        git rm -r --cached "%%i" >nul 2>&1
    )
)

:: Log files
echo 📄 Removing log files...
for /r . %%i in (*.log) do (
    if exist "%%i" (
        git rm --cached "%%i" >nul 2>&1
    )
)

:: Environment files
echo 🔐 Removing environment files...
git rm --cached .env >nul 2>&1 || echo    - .env not tracked
git rm --cached backend/.env >nul 2>&1 || echo    - backend/.env not tracked
git rm --cached frontend/.env >nul 2>&1 || echo    - frontend/.env not tracked

:: IDE files
echo 💻 Removing IDE files...
git rm -r --cached .vscode/ >nul 2>&1 || echo    - .vscode/ not tracked
git rm -r --cached .idea/ >nul 2>&1 || echo    - .idea/ not tracked

:: OS files
echo 🖥️  Removing OS files...
for /r . %%i in (.DS_Store) do (
    if exist "%%i" (
        git rm --cached "%%i" >nul 2>&1
    )
)
for /r . %%i in (Thumbs.db) do (
    if exist "%%i" (
        git rm --cached "%%i" >nul 2>&1
    )
)

echo.
echo 📊 Repository Statistics:
echo ========================
for /f %%i in ('git ls-files ^| find /c /v ""') do echo 📁 Tracked files: %%i

echo.
echo ✅ Cleanup completed!
echo.
echo 🔄 Next steps:
echo    1. Review changes: git status
echo    2. Commit changes: git add . ^&^& git commit -m "chore: add .gitignore and cleanup tracked files"
echo    3. Push changes: git push
echo.
echo 💡 Note: This cleanup will significantly reduce your repository size.
echo.
pause