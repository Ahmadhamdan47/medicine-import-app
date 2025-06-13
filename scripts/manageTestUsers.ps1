# PowerShell script to manage test users for importation system
# Run this script from the project root directory

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("create", "delete", "verify", "recreate", "help")]
    [string]$Command = "help"
)

# Color output functions
function Write-Success { param($msg) Write-Host $msg -ForegroundColor Green }
function Write-Warning { param($msg) Write-Host $msg -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host $msg -ForegroundColor Red }
function Write-Info { param($msg) Write-Host $msg -ForegroundColor Cyan }

# Check if we're in the right directory
if (-not (Test-Path "package.json") -or -not (Test-Path "scripts\createTestUsers.js")) {
    Write-Error "❌ Error: This script must be run from the project root directory"
    Write-Error "Make sure you're in the medicine-import-app directory and that scripts\createTestUsers.js exists"
    exit 1
}

# Check Node.js installation
try {
    $nodeVersion = node --version 2>$null
    if (-not $nodeVersion) {
        throw "Node.js not found"
    }
    Write-Info "✅ Node.js detected: $nodeVersion"
} catch {
    Write-Error "❌ Node.js is not installed or not in PATH"
    Write-Error "Please install Node.js from https://nodejs.org/"
    exit 1
}

# Function to run the test user script
function Invoke-TestUserScript {
    param($action)
    
    Write-Info "🚀 Running test user script with action: $action"
    Write-Host ""
    
    try {
        node "scripts\createTestUsers.js" $action
        if ($LASTEXITCODE -eq 0) {
            Write-Success "✅ Command completed successfully"
        } else {
            Write-Error "❌ Command failed with exit code: $LASTEXITCODE"
        }
    } catch {
        Write-Error "❌ Error running script: $_"
    }
}

# Main switch for commands
switch ($Command.ToLower()) {
    "create" {
        Write-Info "👥 Creating test users..."
        Invoke-TestUserScript "create"
    }
    "delete" {
        Write-Warning "⚠️  This will delete all test users!"
        $confirm = Read-Host "Are you sure? (y/N)"
        if ($confirm -eq 'y' -or $confirm -eq 'Y') {
            Write-Info "🗑️  Deleting test users..."
            Invoke-TestUserScript "delete"
        } else {
            Write-Info "Operation cancelled."
        }
    }
    "verify" {
        Write-Info "🔍 Verifying test users..."
        Invoke-TestUserScript "verify"
    }
    "recreate" {
        Write-Warning "⚠️  This will delete and recreate all test users!"
        $confirm = Read-Host "Are you sure? (y/N)"
        if ($confirm -eq 'y' -or $confirm -eq 'Y') {
            Write-Info "🔄 Recreating test users..."
            Invoke-TestUserScript "recreate"
        } else {
            Write-Info "Operation cancelled."
        }
    }
    "help" {
        Write-Host ""
        Write-Info "🛠️  Test User Management for Importation System"
        Write-Host ""
        Write-Host "USAGE:"
        Write-Host "  .\scripts\manageTestUsers.ps1 [command]"
        Write-Host ""
        Write-Host "COMMANDS:"
        Write-Host "  create    - Create all test users for API testing"
        Write-Host "  delete    - Delete all test users (with confirmation)"
        Write-Host "  verify    - Verify that test users exist and can login"
        Write-Host "  recreate  - Delete and recreate all test users (with confirmation)"
        Write-Host "  help      - Show this help message"
        Write-Host ""
        Write-Host "EXAMPLES:"
        Write-Host "  .\scripts\manageTestUsers.ps1 create"
        Write-Host "  .\scripts\manageTestUsers.ps1 verify"
        Write-Host "  .\scripts\manageTestUsers.ps1 recreate"
        Write-Host ""
        Write-Host "TEST USERS CREATED:"
        Write-Host "  • agent_test (Agent role)"
        Write-Host "  • import_export_test (Import/Export role)"
        Write-Host "  • head_pharmacy_test (Head Pharmacy role)" 
        Write-Host "  • inspector_test (Inspector role)"
        Write-Host "  • admin_test (Admin role)"
        Write-Host ""
        Write-Host "DEFAULT PASSWORD: password123"
        Write-Host ""
        Write-Info "💡 Run 'create' first, then 'verify' to ensure everything is working"
        Write-Host ""
    }
    default {
        Write-Error "❌ Unknown command: $Command"
        Write-Host "Run '.\scripts\manageTestUsers.ps1 help' for usage information"
        exit 1
    }
}

Write-Host ""
