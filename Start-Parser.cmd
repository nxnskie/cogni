@echo off
cd /d "%~dp0python-worker"
if not exist .venv\Scripts\uvicorn.exe (
  echo Creating venv and installing requirements...
  python -m venv .venv
  call .venv\Scripts\activate.bat
  pip install -r requirements.txt
) else (
  call .venv\Scripts\activate.bat
)
uvicorn main:app --reload --port 8001
