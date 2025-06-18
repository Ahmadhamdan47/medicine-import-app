# PowerShell script to create NSSF Pricing table in MySQL database
# Make sure to update the connection parameters below

param(
    [string]$Server = "localhost",
    [string]$Database = "ommal_medapiv2",
    [string]$Username = "root",
    [string]$Password = ""
)

Write-Host "Creating NSSF Pricing table in MySQL database..." -ForegroundColor Yellow

try {
    # Check if mysql client is available
    $mysqlPath = Get-Command mysql -ErrorAction SilentlyContinue
    if (-not $mysqlPath) {
        Write-Host "ERROR: MySQL client not found in PATH. Please install MySQL client or add it to your PATH." -ForegroundColor Red
        exit 1
    }

    Write-Host "MySQL client found at: $($mysqlPath.Source)" -ForegroundColor Green

    # Construct the mysql command
    $sqlFile = Join-Path $PSScriptRoot "createNSSFPricingTable.sql"
    
    if (-not (Test-Path $sqlFile)) {
        Write-Host "ERROR: SQL file not found at: $sqlFile" -ForegroundColor Red
        exit 1
    }

    Write-Host "Using SQL file: $sqlFile" -ForegroundColor Green

    # Prompt for password if not provided
    if ([string]::IsNullOrEmpty($Password)) {
        $SecurePassword = Read-Host "Enter MySQL password for user '$Username'" -AsSecureString
        $Password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePassword))
    }

    # Build the mysql command
    $mysqlArgs = @(
        "-h", $Server,
        "-u", $Username,
        "-p$Password",
        $Database
    )

    Write-Host "Connecting to MySQL server: $Server" -ForegroundColor Yellow
    Write-Host "Database: $Database" -ForegroundColor Yellow
    Write-Host "Username: $Username" -ForegroundColor Yellow

    # Execute the SQL script
    Get-Content $sqlFile | & mysql @mysqlArgs

    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nSUCCESS: NSSF Pricing table created successfully!" -ForegroundColor Green
        Write-Host "The table includes:" -ForegroundColor Cyan
        Write-Host "  - All required fields for NSSF pricing data" -ForegroundColor Cyan
        Write-Host "  - Automatic calculation of real_nssf_coverage_percentage" -ForegroundColor Cyan
        Write-Host "  - Proper indexes for performance" -ForegroundColor Cyan
        Write-Host "  - Foreign key constraint to drug table" -ForegroundColor Cyan
        Write-Host "  - Database triggers for automatic calculations" -ForegroundColor Cyan
    } else {
        Write-Host "ERROR: Failed to create NSSF Pricing table. Check the error messages above." -ForegroundColor Red
        exit 1
    }

} catch {
    Write-Host "ERROR: An unexpected error occurred: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`nYou can now use the NSSF pricing functionality in your application!" -ForegroundColor Green
