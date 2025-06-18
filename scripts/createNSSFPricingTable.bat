@echo off
REM Batch script to create NSSF Pricing table in MySQL database
REM This script calls the PowerShell script with default parameters

echo Creating NSSF Pricing table in MySQL database...
echo.

REM Set default connection parameters (modify as needed)
set SERVER=localhost
set DATABASE=ommal_medapiv2
set USERNAME=root

echo Server: %SERVER%
echo Database: %DATABASE%
echo Username: %USERNAME%
echo.

REM Execute the PowerShell script
PowerShell -ExecutionPolicy Bypass -File "%~dp0createNSSFPricingTable.ps1" -Server %SERVER% -Database %DATABASE% -Username %USERNAME%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo SUCCESS: NSSF Pricing table setup completed!
) else (
    echo.
    echo ERROR: Failed to create NSSF Pricing table.
)

echo.
pause
