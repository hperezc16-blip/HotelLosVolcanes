@echo off
title TRADER.AI - Activo
cd /d "%~dp0"

if not exist "venv\Scripts\activate.bat" (
    echo [ERROR] Ejecuta primero 1_INSTALAR.bat
    pause
    exit /b 1
)

echo Activando entorno virtual...
call venv\Scripts\activate.bat

echo Verificando dependencias...
python -c "import anthropic" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Instalando anthropic...
    pip install anthropic --quiet
)

echo.
echo ================================================
echo   TRADER.AI - Agente de Trading con IA
echo   Ctrl+Shift+A = Analizar pantalla ahora
echo   Ctrl+Shift+S = Detener agente
echo ================================================
echo.

python mcp_server.py
pause
