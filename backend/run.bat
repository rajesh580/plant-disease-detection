@echo off
cd /d C:\Users\rajes\Desktop\ai-leaf-disease\backend
python -m uvicorn server:app --port 4000 --reload
pause
