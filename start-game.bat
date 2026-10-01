@echo off
setlocal
cd /d "%~dp0"
start "Photo Runner 3D" powershell -NoProfile -ExecutionPolicy Bypass -Command "$ready=$false; for($i=0;$i -lt 30;$i++){try{Invoke-WebRequest -UseBasicParsing http://localhost:5173/ -TimeoutSec 1 | Out-Null; $ready=$true; break}catch{Start-Sleep -Milliseconds 500}}; if($ready){Start-Process http://localhost:5173/}"
call npm run dev -- --host 0.0.0.0
endlocal
