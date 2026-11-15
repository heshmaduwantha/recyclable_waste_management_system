@echo off
cd /d "%~dp0\.."
node scripts\android-emulator.mjs start
pause
