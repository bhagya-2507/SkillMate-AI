@echo off
title SkillMate AI - One Click Launcher
echo =====================================================================
echo                    SKILLMATE AI LAUNCHER
echo          Your Personal AI Learning & Career Assistant
echo =====================================================================
echo.
echo 1. Launching Backend Server on Port 5000...
cd /d "%~dp0backend"
start "SkillMate Backend (Port 5000)" cmd /k "npm start"

echo Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak >nul

echo 2. Launching Frontend Server on Port 5173...
cd /d "%~dp0frontend"
start "SkillMate Frontend (Port 5173)" cmd /k "npm run dev"

echo Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo 3. Opening SkillMate AI in your browser...
start http://localhost:5173

echo.
echo =====================================================================
echo [SUCCESS] Backend & Frontend are running!
echo URL: http://localhost:5173
echo.
echo Demo Accounts:
echo - Student: student@skillmate.ai  (Password: Student@123)
echo - Mentor:  mentor@skillmate.ai   (Password: Mentor@123)
echo - Admin:   admin@skillmate.ai    (Password: Admin@123)
echo =====================================================================
pause
