# PowerShell script to run API tests for Importation Module
# Make sure your server is running before executing this script

param(
    [string]$ServerUrl = "http://localhost:3000",
    [string]$TestType = "quick",
    [switch]$Verbose,
    [switch]$Help
)

if ($Help) {
    Write-Host "Importation Module API Test Runner" -ForegroundColor Cyan
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\runTests.ps1 [-ServerUrl <url>] [-TestType <quick|full>] [-Verbose] [-Help]"
    Write-Host ""
    Write-Host "Parameters:" -ForegroundColor Yellow
    Write-Host "  -ServerUrl   Base URL of your server (default: http://localhost:3000)"
    Write-Host "  -TestType    Type of test to run: 'quick' or 'full' (default: quick)"
    Write-Host "  -Verbose     Show detailed output"
    Write-Host "  -Help        Show this help message"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host "  .\runTests.ps1                           # Run quick tests on localhost:3000"
    Write-Host "  .\runTests.ps1 -ServerUrl http://localhost:8080 -TestType full"
    Write-Host "  .\runTests.ps1 -Verbose                  # Run with detailed output"
    exit 0
}

# Colors for output
function Write-Info($message) {
    Write-Host "[INFO] $message" -ForegroundColor Cyan
}

function Write-Success($message) {
    Write-Host "[SUCCESS] $message" -ForegroundColor Green
}

function Write-Error($message) {
    Write-Host "[ERROR] $message" -ForegroundColor Red
}

function Write-Warning($message) {
    Write-Host "[WARNING] $message" -ForegroundColor Yellow
}

# Check if Node.js is installed
function Test-NodeJS {
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-Success "Node.js found: $nodeVersion"
            return $true
        }
    } catch {
        Write-Error "Node.js is not installed or not in PATH"
        Write-Info "Please install Node.js from https://nodejs.org/"
        return $false
    }
}

# Check if server is running
function Test-Server($url) {
    Write-Info "Checking if server is running at $url..."
    try {
        $response = Invoke-WebRequest -Uri "$url/health" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "Server is running and responding"
            return $true
        }
    } catch {
        Write-Warning "Server health check failed: $($_.Exception.Message)"
        Write-Info "Make sure your server is running at $url"
        return $false
    }
}

# Install dependencies if needed
function Install-Dependencies {
    Write-Info "Checking dependencies..."
    
    if (-not (Test-Path "node_modules")) {
        Write-Info "Installing Node.js dependencies..."
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install dependencies"
            return $false
        }
        Write-Success "Dependencies installed"
    } else {
        Write-Success "Dependencies already installed"
    }
    return $true
}

# Main execution
Write-Host "🚀 Importation Module API Test Runner" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Validate environment
if (-not (Test-NodeJS)) {
    exit 1
}

# Check current directory
$currentDir = Get-Location
Write-Info "Current directory: $currentDir"

if (-not (Test-Path "package.json")) {
    Write-Error "package.json not found. Please run this script from the project root directory."
    exit 1
}

# Install dependencies
if (-not (Install-Dependencies)) {
    exit 1
}

# Test server connectivity
if (-not (Test-Server $ServerUrl)) {
    Write-Warning "Proceeding with tests anyway (server might not have health endpoint yet)"
}

# Determine which test script to run
$testScript = if ($TestType -eq "full") { "testAllAPIs.js" } else { "quickAPITest.js" }
$testScriptPath = "scripts\$testScript"

if (-not (Test-Path $testScriptPath)) {
    Write-Error "Test script not found: $testScriptPath"
    exit 1
}

# Prepare environment variables
$env:BASE_URL = $ServerUrl
if ($Verbose) {
    $env:LOG_LEVEL = "DEBUG"
}

Write-Info "Running $TestType tests..."
Write-Info "Server URL: $ServerUrl"
Write-Info "Test script: $testScript"
Write-Host ""

# Run the tests
try {
    if ($TestType -eq "full") {
        Write-Info "Running comprehensive API tests..."
        Write-Warning "Note: Full tests require test users to be set up in the database"
        Write-Info "Edit scripts/testAllAPIs.js to configure test users if needed"
    } else {
        Write-Info "Running quick API tests..."
        Write-Info "Edit scripts/quickAPITest.js to set correct username/password"
    }
    
    Write-Host ""
    node $testScriptPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Success "Tests completed successfully! ✅"
    } else {
        Write-Host ""
        Write-Warning "Some tests failed. Check the output above for details."
    }
} catch {
    Write-Error "Failed to run tests: $($_.Exception.Message)"
    exit 1
}

Write-Host ""
Write-Info "Test execution finished."

# Provide helpful information
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "• Check test results above"
Write-Host "• Review any failed tests"
Write-Host "• Check server logs for errors"
Write-Host "• Verify database setup if tests fail"
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "• API Documentation: docs/api_documentation.md"
Write-Host "• Endpoints Reference: docs/endpoints_reference.md"
Write-Host "• Database Schema: docs/database_documentation.md"
