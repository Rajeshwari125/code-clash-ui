@echo off
echo ===================================================
echo   CODE CLASH - OFFLINE SERVER LAUNCHER
echo ===================================================
echo.
echo 1. Getting your Local IP Address...
echo    (Share this IP with students to connect)
echo.
ipconfig | findstr "IPv4"
echo.
echo ===================================================
echo 2. Starting the Server...
echo.
echo    When the server starts:
echo      - YOU access: http://localhost:3000
echo      - STUDENTS access: http://[YOUR-IP-ADDRESS]:3000
echo.
echo    Example: http://192.168.1.5:3000
echo ===================================================
echo.
npm run dev
pause
