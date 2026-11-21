@echo off
title SkillMate - Database Seeder (MongoDB & Mongoose)
echo =====================================================================
echo                SKILLMATE DATABASE SETUP (MONGODB)
echo =====================================================================
echo.
echo Make sure MongoDB Service is running on your machine (port 27017).
echo Database: skillmate_ai
echo.
echo Running Mongoose database sync and seeding collections...
cd /d "%~dp0backend"
node src/utils/seedData.js
echo.
echo =====================================================================
echo Setup completed! Press any key to exit.
echo =====================================================================
pause
