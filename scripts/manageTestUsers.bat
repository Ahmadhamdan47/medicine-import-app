@echo off
setlocal enabledelayedexpansion

REM Batch script to manage test users for importation system
REM Run this script from the project root directory

set "COMMAND=%1"

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: This script must be run from the project root directory
    echo Make sure you're in the medicine-import-app directory
    exit /b 1
)

if not exist "scripts\createTestUsers.js" (
    echo ❌ Error: scripts\createTestUsers.js not found
    echo Make sure the test user script exists
    exit /b 1
)

REM Check Node.js installation
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

REM Main command logic
if "%COMMAND%"=="create" goto :create
if "%COMMAND%"=="delete" goto :delete
if "%COMMAND%"=="verify" goto :verify
if "%COMMAND%"=="recreate" goto :recreate
if "%COMMAND%"=="help" goto :help
if "%COMMAND%"=="" goto :help
goto :unknown

:create
echo 👥 Creating test users...
echo.
node "scripts\createTestUsers.js" create
goto :end

:delete
echo ⚠️  This will delete all test users!
set /p "confirm=Are you sure? (y/N): "
if /i "!confirm!"=="y" (
    echo 🗑️  Deleting test users...
    echo.
    node "scripts\createTestUsers.js" delete
) else (
    echo Operation cancelled.
)
goto :end

:verify
echo 🔍 Verifying test users...
echo.
node "scripts\createTestUsers.js" verify
goto :end

:recreate
echo ⚠️  This will delete and recreate all test users!
set /p "confirm=Are you sure? (y/N): "
if /i "!confirm!"=="y" (
    echo 🔄 Recreating test users...
    echo.
    node "scripts\createTestUsers.js" recreate
) else (
    echo Operation cancelled.
)
goto :end

:help
echo.
echo 🛠️  Test User Management for Importation System
echo.
echo USAGE:
echo   scripts\manageTestUsers.bat [command]
echo.
echo COMMANDS:
echo   create    - Create all test users for API testing
echo   delete    - Delete all test users (with confirmation)
echo   verify    - Verify that test users exist and can login
echo   recreate  - Delete and recreate all test users (with confirmation)
echo   help      - Show this help message
echo.
echo EXAMPLES:
echo   scripts\manageTestUsers.bat create
echo   scripts\manageTestUsers.bat verify
echo   scripts\manageTestUsers.bat recreate
echo.
echo TEST USERS CREATED:
echo   • agent_test (Agent role)
echo   • import_export_test (Import/Export role)
echo   • head_pharmacy_test (Head Pharmacy role)
echo   • inspector_test (Inspector role)
echo   • admin_test (Admin role)
echo.
echo DEFAULT PASSWORD: password123
echo.
echo 💡 Run 'create' first, then 'verify' to ensure everything is working
echo.
goto :end

:unknown
echo ❌ Unknown command: %COMMAND%
echo Run 'scripts\manageTestUsers.bat help' for usage information
exit /b 1

:end
echo.
