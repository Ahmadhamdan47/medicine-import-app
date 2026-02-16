# Form Cleaning API Test Suite

This directory contains comprehensive tests for the Form Cleaning feature APIs.

## 📋 Test Files

### 1. **formCleaningHelpers.test.js**
- **Type**: Unit Tests
- **Database Required**: ❌ No
- **Server Required**: ❌ No
- **Description**: Tests helper functions like fuzzy matching, Levenshtein distance, and form matching algorithms

### 2. **formCleaningService.test.js**
- **Type**: Integration Tests
- **Database Required**: ✅ Yes
- **Server Required**: ❌ No
- **Description**: Tests the formCleaningService module directly with database interactions

### 3. **test-form-cleaning-api.js** (Root directory)
- **Type**: API Integration Tests
- **Database Required**: ✅ Yes
- **Server Required**: ✅ Yes (http://localhost:8066)
- **Description**: Tests all HTTP endpoints with actual API requests

---

## 🚀 Running the Tests

### Prerequisites

1. **Node.js** installed (v14+ recommended)
2. **Dependencies** installed:
   ```bash
   npm install
   ```
3. **Database connection** configured in `config/databasePharmacy.js`
4. **Server running** (for API tests only):
   ```bash
   npm start
   # or
   node index.js
   ```

---

### Run Unit Tests (No Database Required)

```bash
# Test helper functions and algorithms
node tests/formCleaningHelpers.test.js
```

**Expected Output:**
```
===========================================
Form Cleaning Helpers Unit Tests
===========================================

Test Suite 1: Levenshtein Distance Calculation
-------------------------------------------
✓ Distance between "Tab" and "Tablet" is 3
✓ Distance between "Cap" and "Capsule" is 4
...

✓ Tests Passed: 85
✗ Tests Failed: 0
Total Tests: 85

🎉 All tests passed!
```

---

### Run Service Integration Tests (Database Required)

```bash
# Test service layer with database
node tests/formCleaningService.test.js
```

**Expected Output:**
```
===========================================
Form Cleaning Service Integration Tests
===========================================

Test Suite 1: Get Form Cleaning Statistics
-------------------------------------------
✓ getFormStats returns result
✓ Stats include totalDrugs
...
  📊 Database Stats:
     Total Drugs: 15000
     With Forms: 12000 (80.00%)
     Without Forms: 3000
     Unique FormRaw Values: 120

✓ Tests Passed: 45
✗ Tests Failed: 0
Total Tests: 45

🎉 All tests passed!
```

---

### Run API Integration Tests (Server + Database Required)

**IMPORTANT: Start the server first!**

```bash
# Terminal 1 - Start the server
npm start

# Terminal 2 - Run API tests
node test-form-cleaning-api.js
```

**Expected Output:**
```
╔═══════════════════════════════════════════╗
║  Form Cleaning API Integration Tests     ║
╚═══════════════════════════════════════════╝

Testing API Base: http://localhost:8066/form-cleaning
Server should be running on http://localhost:8066

📊 Test Suite 1: GET /form-cleaning/stats
─────────────────────────────────────────
✓ Response status is 200
✓ Response success is true
...

╔═══════════════════════════════════════════╗
║           Test Results Summary            ║
╚═══════════════════════════════════════════╝
✓ Tests Passed: 58
✗ Tests Failed: 0
Total Tests: 58

🎉 All tests passed!
```

---

## 🧪 Test Coverage

### Unit Tests (formCleaningHelpers.test.js)

| Test Suite | Tests | Description |
|------------|-------|-------------|
| Levenshtein Distance | 8 | Distance calculations for common forms |
| Exact Matching | 3 | 100% exact matches (case-insensitive) |
| Starts With Matching | 4 | 90% confidence for abbreviations |
| Contains Matching | 2 | 80-75% confidence for partial matches |
| Fuzzy Matching | 4 | Variable confidence for similar strings |
| No Match Cases | 4 | Zero confidence for unrelated strings |
| Common Abbreviations | 15 | Real-world form abbreviations |
| Edge Cases | 5 | Punctuation, whitespace, misspellings |
| Confidence Scoring | 5 | High vs low confidence validation |
| Multiple Candidates | 3 | Ranking best matches |

**Total: ~55 assertions**

---

### Service Integration Tests (formCleaningService.test.js)

| Test Suite | Tests | Description |
|------------|-------|-------------|
| Get Statistics | 8 | Database statistics retrieval |
| Get Unique FormRaw | 5 | Retrieve distinct FormRaw values |
| Get Unique with Filters | 2 | Test minCount and includeNull params |
| Suggest Form Matches | 8 | AI-powered form suggestions |
| Get Drugs by FormRaw | 6 | Retrieve affected drugs list |
| Preview Form Mappings | 10 | Preview changes before applying |
| Session Integration | 4 | Session creation and management |
| Apply Form Mappings | 0 | **SKIPPED** (modifies database) |
| Edge Cases | 3 | Empty, null, non-existent values |

**Total: ~45 assertions**

---

### API Integration Tests (test-form-cleaning-api.js)

| Endpoint | Method | Tests | Description |
|----------|--------|-------|-------------|
| `/stats` | GET | 6 | Get database statistics |
| `/unique-values` | GET | 6 | Get unique FormRaw values |
| `/unique-values` (params) | GET | 4 | Test query parameters |
| `/suggest-matches` | POST | 7 | Get form suggestions |
| `/affected-drugs` | GET | 5 | Get drugs by FormRaw |
| `/preview` | POST | 8 | Preview form mappings |
| `/session` | POST | 8 | Create new session |
| `/session/:id` | GET | 4 | Get session details |
| `/apply` | POST | 0 | **SKIPPED** (modifies database) |
| `/rollback` | POST | 0 | **SKIPPED** (no changes applied) |
| `/session/:id` | DELETE | 2 | Delete session |
| Error Handling | Various | 2 | Test error responses |

**Total: ~52 assertions**

---

## ⚠️ Important Notes

### Database Modification Tests

Some tests are **SKIPPED by default** to avoid modifying the database:

1. **Apply Form Mappings** (`/form-cleaning/apply`)
   - Modifies drug records in the database
   - Creates automatic backups
   
2. **Rollback Changes** (`/form-cleaning/rollback`)
   - Restores drugs from backup

**To enable these tests:**

1. Open the test file:
   - `tests/formCleaningService.test.js` (line ~270)
   - `test-form-cleaning-api.js` (line ~400)

2. Uncomment the test code sections marked with:
   ```javascript
   // UNCOMMENT TO TEST ACTUAL APPLY (WARNING: MODIFIES DATABASE)
   ```

3. **⚠️ WARNING**: Only run on test/development databases!

---

## 📊 Test Data Requirements

For meaningful tests, your database should have:

- ✅ At least 100+ drugs in the `drug` table
- ✅ `NotMarketed = false` (marketed drugs)
- ✅ Various `FormRaw` values (Tab, Cap, Syr, Inj, etc.)
- ✅ At least 10+ entries in `dosageoptions` table
- ✅ `DosageFormClean` field populated in dosageoptions

**Sample Data Check:**
```sql
-- Check drug count
SELECT COUNT(*) FROM drug WHERE NotMarketed = 0;

-- Check unique FormRaw values
SELECT FormRaw, COUNT(*) FROM drug 
WHERE NotMarketed = 0 
GROUP BY FormRaw 
ORDER BY COUNT(*) DESC;

-- Check dosage options
SELECT DosageFormClean, PhysicalState 
FROM dosageoptions 
WHERE DosageFormClean IS NOT NULL;
```

---

## 🐛 Troubleshooting

### Test Failures

#### "Cannot connect to database"
```bash
# Check database connection in config/databasePharmacy.js
# Verify SQL Server is running
# Check credentials and connection string
```

#### "Cannot connect to server" (API tests)
```bash
# Ensure server is running:
npm start

# Check server logs for errors
# Verify port 8066 is not in use:
netstat -ano | findstr :8066
```

#### "No FormRaw values found"
```sql
-- Populate test data
UPDATE drug 
SET FormRaw = 'Tab' 
WHERE Form = 'Tablet' AND FormRaw IS NULL 
LIMIT 10;
```

#### Tests timeout
```bash
# Increase timeout in test file (default: none)
# Check database query performance
# Reduce test data set size
```

---

## 🎯 Best Practices

### Before Running Tests

1. **Backup your database** (especially before enabling apply/rollback tests)
   ```bash
   # SQL Server backup
   BACKUP DATABASE ommal_medlist TO DISK = 'C:\Backup\before_tests.bak'
   ```

2. **Use a test database** for apply/rollback tests
   ```javascript
   // config/databasePharmacy.js
   module.exports = {
     database: 'ommal_medlist_test', // Use test DB
     // ...
   };
   ```

3. **Check test data** before running
   ```bash
   node tests/formCleaningService.test.js
   # Review statistics output before proceeding
   ```

### After Running Tests

1. **Review logs** for any warnings or errors
2. **Check session cleanup** (sessions should be deleted after tests)
3. **Verify no data corruption** (if apply tests were run)

---

## 📈 Continuous Integration

### Add to package.json

```json
{
  "scripts": {
    "test:form-helpers": "node tests/formCleaningHelpers.test.js",
    "test:form-service": "node tests/formCleaningService.test.js",
    "test:form-api": "node test-form-cleaning-api.js",
    "test:form-all": "npm run test:form-helpers && npm run test:form-service && npm run test:form-api"
  }
}
```

### Run all tests
```bash
npm run test:form-all
```

---

## 📝 Test Maintenance

### When to Update Tests

- ✅ When adding new API endpoints
- ✅ When modifying business logic
- ✅ When changing database schema
- ✅ When fixing bugs (add regression tests)
- ✅ When adding new features

### Test File Locations

```
medicine-import-app/
├── tests/
│   ├── formCleaningHelpers.test.js      # Unit tests
│   ├── formCleaningService.test.js      # Service tests
│   └── README_FORM_CLEANING_TESTS.md    # This file
│
└── test-form-cleaning-api.js             # API tests
```

---

## 🔗 Related Documentation

- [Form Cleaning API Guide](./FRONTEND_FORM_CLEANING_GUIDE.md)
- [Backend Implementation](../src/services/formCleaningService.js)
- [Route Cleaning Tests](./routeCleaningHelpers.test.js) (similar pattern)
- [Cleaning Session Tests](./cleaningSession.test.js) (session management)

---

## 📞 Support

If tests fail or you encounter issues:

1. Check this README for troubleshooting steps
2. Review server logs in the console
3. Check database connection and data
4. Verify all dependencies are installed
5. Ensure you're using the correct Node.js version

---

**Last Updated**: February 16, 2026  
**Test Coverage**: ~150+ assertions across 3 test suites  
**Average Test Runtime**: 2-5 seconds (unit + service), 10-15 seconds (API)
