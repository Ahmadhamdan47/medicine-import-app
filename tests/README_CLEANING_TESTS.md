# Route & Dosage Cleaning Tests

## Overview

This directory contains unit tests for the route and dosage cleaning functionality. The tests use a simple custom testing framework and don't require external testing libraries.

---

## Test Files

### 1. `dosageParserExtensions.test.js`
Tests the new reconstruction functions added to the dosageParser utility.

**What it tests:**
- `convertDosageTableRow()` - Converting dosage table rows to parsed format
- `reconstructDrugDosageString()` - Reconstructing drug.Dosage from structured data
- `canReconstructDosage()` - Validation of dosage records
- `formatMultipleDosages()` - Formatting multiple dosage records
- Integration tests for round-trip conversions

**Run with:**
```bash
node tests/dosageParserExtensions.test.js
```

### 2. `cleaningSession.test.js`
Tests session management functionality for route and dosage cleaning.

**What it tests:**
- Session creation (route and dosage types)
- Session retrieval and validation
- Session updates and metadata merging
- Session clearing
- User session filtering
- Session statistics
- Session expiration logic
- Status transitions (initialized → mapped → previewed → applied → rolled_back)

**Run with:**
```bash
node tests/cleaningSession.test.js
```

### 3. `routeCleaningHelpers.test.js`
Tests fuzzy matching and helper functions used in route cleaning.

**What it tests:**
- Levenshtein distance algorithm
- Exact matching (acronym and route)
- Starts-with matching
- Contains matching
- Fuzzy matching with tolerance
- Case insensitivity
- Edge cases (empty strings, null values)
- Common route matching scenarios

**Run with:**
```bash
node tests/routeCleaningHelpers.test.js
```

### 4. `dosageParser.test.js` (existing)
Original tests for dosage parsing functionality.

**Run with:**
```bash
node tests/dosageParser.test.js
```

---

## Running All Tests

### Run all cleaning-related tests:
```bash
node tests/dosageParserExtensions.test.js && node tests/cleaningSession.test.js && node tests/routeCleaningHelpers.test.js
```

### Windows PowerShell:
```powershell
node tests/dosageParserExtensions.test.js; node tests/cleaningSession.test.js; node tests/routeCleaningHelpers.test.js
```

### Run all tests (including existing):
```bash
node tests/dosageParser.test.js && node tests/dosageParserExtensions.test.js && node tests/cleaningSession.test.js && node tests/routeCleaningHelpers.test.js
```

---

## Test Framework

These tests use a simple custom testing framework with the following assertion functions:

### Assertion Functions

**`assertEquals(actual, expected, testName)`**
- Compares two values using JSON.stringify
- Useful for objects and arrays

**`assertTrue(condition, testName)`**
- Checks if condition is truthy

**`assertFalse(condition, testName)`**
- Checks if condition is falsy

**`assertNotNull(value, testName)`**
- Checks if value is not null or undefined

### Output Format

```
✓ Test name - when test passes
✗ Test name - when test fails
  Expected: {...}
  Actual: {...}
```

### Exit Codes

- `0` - All tests passed
- `1` - Some tests failed

---

## Test Coverage

### Dosage Parser Extensions
- ✅ Table row to parsed format conversion
- ✅ Dosage string reconstruction
- ✅ Validation logic
- ✅ Multiple dosage formatting
- ✅ Edge cases (null, empty, invalid data)
- ✅ Integration tests (round-trip conversions)

**Total: ~40 test cases**

### Cleaning Session Service
- ✅ Session creation and validation
- ✅ Session retrieval
- ✅ Session updates
- ✅ Session clearing
- ✅ User session filtering
- ✅ Statistics generation
- ✅ Expiration handling
- ✅ Status workflow
- ✅ Error conditions

**Total: ~35 test cases**

### Route Cleaning Helpers
- ✅ Levenshtein distance calculations
- ✅ Exact matching logic
- ✅ Partial matching (starts with, contains)
- ✅ Fuzzy matching with tolerance
- ✅ Case insensitivity
- ✅ Edge cases
- ✅ Common route scenarios

**Total: ~30 test cases**

**Grand Total: ~105 test cases**

---

## No Database Required

All these tests run **without a database connection**:

- **dosageParserExtensions.test.js** - Pure utility functions
- **cleaningSession.test.js** - In-memory session management
- **routeCleaningHelpers.test.js** - Pure helper functions

This makes tests fast and easy to run without environment setup.

---

## Integration Tests

For testing the full API endpoints with database:

1. Ensure database is running
2. Run the server: `npm start`
3. Use Postman or curl to test endpoints (see [docs/route-dosage-cleaning-api.md](../docs/route-dosage-cleaning-api.md))

Example API test:
```bash
# Get route statistics
curl http://localhost:8066/route-cleaning/stats

# Get unique RouteRaw values
curl http://localhost:8066/route-cleaning/unique-values
```

---

## Adding New Tests

To add new tests, follow this pattern:

```javascript
/**
 * Unit Tests for [Feature Name]
 * 
 * Run with: node tests/[filename].test.js
 */

// Import modules to test
const moduleToTest = require('../src/path/to/module');

// Test framework setup
let testsPassed = 0;
let testsFailed = 0;

function assertEquals(actual, expected, testName) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  
  if (actualStr === expectedStr) {
    console.log(`✓ ${testName}`);
    testsPassed++;
  } else {
    console.log(`✗ ${testName}`);
    console.log(`  Expected: ${expectedStr}`);
    console.log(`  Actual:   ${actualStr}`);
    testsFailed++;
  }
}

// Add more assertion functions as needed...

console.log('Test Suite Name');
console.log('-------------------------------------------');

// Write tests...
assertEquals(actual, expected, 'Test description');

// Test summary
console.log('===========================================');
console.log('Test Summary');
console.log('===========================================');
console.log(`Total Tests: ${testsPassed + testsFailed}`);
console.log(`✓ Passed: ${testsPassed}`);
console.log(`✗ Failed: ${testsFailed}`);

if (testsFailed === 0) {
  console.log('🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('❌ Some tests failed.');
  process.exit(1);
}
```

---

## CI/CD Integration

To integrate with CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Unit Tests
  run: |
    node tests/dosageParser.test.js
    node tests/dosageParserExtensions.test.js
    node tests/cleaningSession.test.js
    node tests/routeCleaningHelpers.test.js
```

---

## Troubleshooting

### Test fails with "Cannot find module"
- Ensure you're running from the project root directory
- Check that the module paths are correct

### All tests fail
- Check Node.js version (requires Node.js 12+)
- Verify all source files exist

### Specific test fails
- Read the Expected vs Actual output
- Check if recent code changes affected the tested functionality
- Verify the test assertions are still valid

---

## Future Test Coverage

Areas that could benefit from additional tests:

1. **Route Cleaning Service** (with database mocking)
   - Database query results
   - Transaction rollback scenarios
   - Backup file operations

2. **Dosage Cleaning Service** (with database mocking)
   - Bulk reconstruction edge cases
   - Complex dosage scenarios
   - Error handling

3. **Controllers**
   - Request validation
   - Error responses
   - Authentication checks

4. **End-to-End Tests**
   - Full workflow: create session → preview → apply → rollback
   - Multiple concurrent sessions
   - Large dataset operations

---

## Maintenance

- Update tests when adding new features
- Keep tests simple and focused
- Document complex test scenarios
- Run tests before committing changes

---

## Support

For questions or issues:
1. Check test output for specific failures
2. Review source code in `src/services/` and `src/utils/`
3. Consult API documentation: [docs/route-dosage-cleaning-api.md](../docs/route-dosage-cleaning-api.md)
