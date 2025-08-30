# PowerShell script to add real_nssf_coverage column to nssf_pricing table
# Make sure to update the connection parameters below

# Database connection parameters
$server = "localhost"  # Update with your MySQL server
$database = "ommal_medapiv2"  # Update with your database name
$username = "root"  # Update with your MySQL username
$password = "your_password"  # Update with your MySQL password

# Path to the SQL script
$sqlScriptPath = ".\addRealNSSFCoverageColumn.sql"

# MySQL command
$mysqlCommand = "mysql -h $server -u $username -p$password $database"

Write-Host "Adding real_nssf_coverage column to nssf_pricing table..." -ForegroundColor Yellow

try {
    # Execute the SQL script
    Get-Content $sqlScriptPath | & mysql -h $server -u $username -p$password $database
    
    Write-Host "Successfully added real_nssf_coverage column to nssf_pricing table!" -ForegroundColor Green
    Write-Host "Column details:" -ForegroundColor Cyan
    Write-Host "- Name: real_nssf_coverage" -ForegroundColor White
    Write-Host "- Type: DECIMAL(12, 2)" -ForegroundColor White
    Write-Host "- Allow NULL: YES" -ForegroundColor White
    Write-Host "- Comment: Real NSSF Coverage Amount (non-percentage) in LBP" -ForegroundColor White
}
catch {
    Write-Host "Error executing SQL script: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check your database connection parameters and try again." -ForegroundColor Yellow
}

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
