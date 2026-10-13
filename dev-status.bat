@echo off
setlocal
set "PROJ_ROOT=%~dp0"
if "%PROJ_ROOT:~-1%"=="\" set "PROJ_ROOT=%PROJ_ROOT:~0,-1%"
echo Comprobando el servidor de ESTE proyecto:
echo   %PROJ_ROOT%
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$root=$env:PROJ_ROOT; $procs=Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -and ($_.CommandLine -like ('*'+$root+'*')) }; if(-not $procs){ Write-Host 'DETENIDO: este proyecto no tiene servidor en ejecucion.'; exit 0 }; $listen=Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue; foreach($p in $procs){ $ports=@($listen | Where-Object { $_.OwningProcess -eq $p.ProcessId } | Select-Object -ExpandProperty LocalPort -Unique); if($ports.Count -gt 0){ Write-Host ('EN EJECUCION: PID '+$p.ProcessId+' escuchando en puerto(s): '+($ports -join ', ')) } }; Write-Host 'Prueba: http://localhost:3000/muestra'"
endlocal
