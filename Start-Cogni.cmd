@echo off
REM Start Cogni Next.js app (run python worker separately: Start-Parser.cmd)
cd /d "%~dp0"
if not exist .env.local (
  echo WARNING: .env.local missing. Copy .env.example to .env.local and set required keys.
)
npm run dev
