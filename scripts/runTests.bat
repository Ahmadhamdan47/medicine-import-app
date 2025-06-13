@echo off
REM Batch file to run API tests for Importation Module
REM Make sure your server is running before executing this script

echo.
echo ================================================
echo  Importation Module API Test Runner
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js found
echo [INFO] Current directory: %CD%

REM Check if we're in the right directory
if not exist package.json (
    echo [ERROR] package.json not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist node_modules (
    echo [INFO] Installing dependencies...
    npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies installed
) else (
    echo [SUCCESS] Dependencies already available
)

REM Show menu
echo.
echo Select test type:
echo 1. Quick Test (recommended for first run)
echo 2. Full Test Suite (requires test users setup)
echo 3. Exit
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto quick_test
if "%choice%"=="2" goto full_test
if "%choice%"=="3" goto exit
goto invalid_choice

:quick_test
echo.
echo [INFO] Running quick API tests...
echo [INFO] Edit scripts\quickAPITest.js to set correct username/password
echo.
node scripts\quickAPITest.js
goto test_complete

:full_test
echo.
echo [INFO] Running comprehensive API tests...
echo [WARNING] Make sure test users are configured in scripts\testAllAPIs.js
echo.
node scripts\testAllAPIs.js
goto test_complete

:test_complete
echo.
if errorlevel 1 (
    echo [WARNING] Some tests failed. Check the output above.
) else (
    echo [SUCCESS] Tests completed successfully!
)
echo.
echo Next steps:
echo - Check test results above
echo - Review any failed tests  
echo - Check server logs for errors
echo - Verify database setup if tests fail
echo.
echo Documentation:
echo - API Documentation: docs\api_documentation.md
echo - Endpoints Reference: docs\endpoints_reference.md
echo - Database Schema: docs\database_documentation.md
echo.
pause
goto exit

:invalid_choice
echo [ERROR] Invalid choice. Please select 1, 2, or 3.
goto :eof

:exit
echo.
echo Goodbye!
exit /b 0
