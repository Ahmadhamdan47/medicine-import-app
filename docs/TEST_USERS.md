# Test User Management Guide

This guide explains how to create and manage test users for the Importation Module API testing.

## Overview

The test user management system creates standardized test users with different roles for comprehensive API testing. These users are defined in `scripts/testConfig.js` and can be created, verified, and deleted using the provided scripts.

## Test Users

The system creates 7 test users with different roles:

| Username | Role | Description |
|----------|------|-------------|
| `agent_test` | Agent | Can create importation requests and upload files |
| `import_export_test` | Import/Export | Can process RFD requests and manage proforma invoices |
| `head_pharmacy_test` | Head Pharmacy | Can approve swift payments and final approvals |
| `inspector_test` | Inspector | Can inspect shipments and manage quality control |
| `admin_test` | Admin | Full system access including user management |
| `quality_committee_test` | Quality Study Committee | Can review and approve quality studies |
| `pricing_committee_test` | Pricing Committee | Can review and approve pricing decisions |

**Default Password:** `password123` (for all test users)

## Quick Start

### 1. Create Test Users
```bash
# Using npm script (recommended)
npm run create-test-users

# Or directly
node scripts/createTestUsers.js create
```

### 2. Verify Test Users
```bash
# Check if users were created correctly
npm run verify-test-users

# Or directly
node scripts/createTestUsers.js verify
```

### 3. Run API Tests
```bash
# Run full test suite
npm run test-apis

# Or run quick tests
npm run test-quick
```

## Available Commands

### NPM Scripts
```bash
npm run create-test-users    # Create all test users
npm run verify-test-users    # Verify test users exist and can login
npm run delete-test-users    # Delete all test users
npm run recreate-test-users  # Delete and recreate all test users
```

### Direct Node.js Commands
```bash
node scripts/createTestUsers.js create     # Create users
node scripts/createTestUsers.js verify     # Verify users
node scripts/createTestUsers.js delete     # Delete users
node scripts/createTestUsers.js recreate   # Recreate users
```

### PowerShell Script (Windows)
```powershell
# From project root directory
.\scripts\manageTestUsers.ps1 create     # Create users
.\scripts\manageTestUsers.ps1 verify     # Verify users
.\scripts\manageTestUsers.ps1 delete     # Delete users (with confirmation)
.\scripts\manageTestUsers.ps1 recreate   # Recreate users (with confirmation)
.\scripts\manageTestUsers.ps1 help       # Show help
```

### Batch Script (Windows CMD)
```cmd
REM From project root directory
scripts\manageTestUsers.bat create     REM Create users
scripts\manageTestUsers.bat verify     REM Verify users
scripts\manageTestUsers.bat delete     REM Delete users (with confirmation)
scripts\manageTestUsers.bat recreate   REM Recreate users (with confirmation)
scripts\manageTestUsers.bat help       REM Show help
```

## Prerequisites

Before creating test users, ensure:

1. **Database is running** and accessible
2. **Required roles exist** in the database:
   ```bash
   npm run add-roles
   ```
3. **Importation tables are created**:
   ```bash
   npm run create-tables
   ```

## Troubleshooting

### Role Not Found Error
If you see "Role not found" errors:
```bash
# Create missing roles first
npm run add-roles

# Then create test users
npm run create-test-users
```

### Database Connection Error
Ensure your database configuration in `config/databasePharmacy.js` is correct and the database is running.

### User Already Exists
If users already exist:
```bash
# Verify existing users
npm run verify-test-users

# Or recreate them
npm run recreate-test-users
```

## Manual User Creation

If you need to create users manually, here's the SQL template:

```sql
-- Example for agent_test user
INSERT INTO useraccounts (Username, PasswordHash, RoleId, Email, IsActive) 
VALUES (
    'agent_test', 
    '$2a$10$[BCRYPT_HASH_HERE]',  -- Hash of 'password123'
    2,  -- Role ID for Agent
    'agent_test@testmail.com',
    1
);
```

## Security Notes

⚠️ **Important Security Considerations:**

- Test users use a **default password** (`password123`)
- These users should **only be used in development/testing environments**
- **Delete test users** before deploying to production
- Test user emails use `@testmail.com` domain to avoid conflicts

## Integration with API Tests

The test users are automatically used by:

- `scripts/testAllAPIs.js` - Full API test suite
- `scripts/quickAPITest.js` - Quick validation tests

Both test scripts will:
1. Login with each test user
2. Test role-specific permissions
3. Validate API responses
4. Clean up test data

## Files

| File | Purpose |
|------|---------|
| `scripts/createTestUsers.js` | Main script for user management |
| `scripts/manageTestUsers.ps1` | PowerShell wrapper script |
| `scripts/manageTestUsers.bat` | Batch wrapper script |
| `scripts/testConfig.js` | Test configuration including user definitions |
| `docs/TEST_USERS.md` | This documentation file |

## Example Output

When creating test users successfully:

```
🚀 Starting test user creation process...

✅ Database connection established successfully.

📋 Available roles in database:
   RoleId: 1 | RoleName: Admin
   RoleId: 2 | RoleName: Agent
   RoleId: 3 | RoleName: Donor
   RoleId: 4 | RoleName: Recipient
   RoleId: 5 | RoleName: Import/Export
   RoleId: 6 | RoleName: Head Pharmacy
   RoleId: 7 | RoleName: Inspector

📝 Creating test users...

🔄 Processing agent user: agent_test
   ✅ Created user: agent_test (Role: Agent, ID: 15)

🔄 Processing importExport user: import_export_test
   ✅ Created user: import_export_test (Role: Import/Export, ID: 16)

[... continued for all users ...]

============================================================
📊 SUMMARY
============================================================
✅ Successfully created 5 test users:
   • agent_test (Agent) - ID: 15
   • import_export_test (Import/Export) - ID: 16
   • head_pharmacy_test (Head Pharmacy) - ID: 17
   • inspector_test (Inspector) - ID: 18
   • admin_test (Admin) - ID: 19

🔑 Default password for all test users: password123

🧪 These users can now be used for API testing!
```

## Next Steps

After creating test users:

1. **Verify the users work**: `npm run verify-test-users`
2. **Run API tests**: `npm run test-apis`
3. **Start development**: Users are ready for testing your APIs

For questions or issues, refer to the main project documentation or check the error logs for specific database/configuration issues.
