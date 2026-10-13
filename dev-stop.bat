@echo off
setlocal
set "PROJ_ROOT=%~dp0"
if "%PROJ_ROOT:~-1%"=="\" set "PROJ_ROOT=%PROJ_ROOT:~0,-1%"
echo Deteniendo el servidor de ESTE proyecto:
echo   %PROJ_ROOT%
powershell -NoProfile -ExecutionPolicy Bypass -Command "$root=$env:PROJ_ROOT; $procs=Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -and ($_.CommandLine -like ('*'+$root+'*')) }; if(-not $procs){ Write-Host 'No habia ningun servidor de este proyecto en ejecucion.'; exit 0 }; foreach($p in $procs){ Write-Host ('Deteniendo PID '+$p.ProcessId+'...'); & taskkill /PID $p.ProcessId /T /F 2>&1 | Out-Null }; Start-Sleep -Seconds 1; $left=Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq 3000 }; if($left){ Write-Host 'Aviso: el puerto 3000 sigue ocupado (puede ser otro proceso).' } else { Write-Host 'Listo: puerto 3000 libre.' }"
endlocal
