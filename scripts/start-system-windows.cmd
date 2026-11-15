@echo off
cd /d "%~dp0\.."
if not exist backend\.env (
 echo Configure backend\.env from backend\.env.example first. See docs\emulator-setup.md.
 pause
 exit /b 1
)
call npm --prefix backend run build
if errorlevel 1 exit /b 1
start "EcoCollect API" cmd /k "cd /d backend && node dist\server.js"
start "EcoCollect Web" cmd /k "cd /d admin-web && npm run dev"
node scripts\android-emulator.mjs start
pause
