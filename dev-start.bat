@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo  Reposteria - servidor de desarrollo (Next.js)
echo  Proyecto: %CD%
echo ============================================================
echo.
echo Iniciando "npm run dev" (Next.js) en http://localhost:3000
echo Para detenerlo presiona Ctrl + C (o usa dev-stop.bat).
echo.
call npm run dev
endlocal
