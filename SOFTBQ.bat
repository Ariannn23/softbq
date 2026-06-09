@echo off
TITLE SOFTBQ - Sistema Convertidor Contasis
COLOR 0B

echo ========================================================
echo        Iniciando SOFTBQ (Servidor Local)
echo ========================================================
echo.

REM Verifica si node esta instalado
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [!] Node.js no esta instalado en este equipo.
    echo Por favor instala Node.js ^(version 20 o superior^) para usar la app.
    echo Descarga: https://nodejs.org/es/
    pause
    exit /b
)

IF NOT EXIST "node_modules" (
    echo [*] Instalando dependencias por primera vez...
    call npm install
    echo [*] Construyendo aplicacion...
    call npm run build
)

echo [*] Abriendo SOFTBQ en tu navegador...
start http://localhost:3001

echo [*] Servidor ejecutandose. Cierra esta ventana para apagar el sistema.
node apps/server/dist/main.js

pause
