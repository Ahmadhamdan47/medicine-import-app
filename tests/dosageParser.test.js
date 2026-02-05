/**
 * Unit Tests for Dosage Parser
 * 
 * Run with: npm test tests/dosageParser.test.js
 * or: node tests/dosageParser.test.js
 */

const { 
  parseDosage, 
  formatDosage, 
  isValidParsedDosage,
  parseSingleDosage 
} = require('../src/utils/dosageParser');

// Simple test framework
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

function assertTrue(condition, testName) {
  if (condition) {
    console.log(`✓ ${testName}`);
    testsPassed++;
  } else {
    console.log(`✗ ${testName}`);
    testsFailed++;
  }
}

function assertFalse(condition, testName) {
  if (!condition) {
    console.log(`✓ ${testName}`);
    testsPassed++;
  } else {
    console.log(`✗ ${testName}`);
    testsFailed++;
  }
}

console.log('===========================================');
console.log('Dosage Parser Unit Tests');
console.log('===========================================\n');

// ========================================
// Test Suite 1: Simple Dosages
// ========================================
console.log('Test Suite 1: Simple Dosages');
console.log('-------------------------------------------');

assertEquals(
  parseDosage('500mg'),
  [{ numerator: 500, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }],
  'Parse simple dosage: 500mg'
);

assertEquals(
  parseDosage('20mcg'),
  [{ numerator: 20, numeratorUnit: 'mcg', denominator: 0, denominatorUnit: '' }],
  'Parse simple dosage: 20mcg'
);

assertEquals(
  parseDosage('1g'),
  [{ numerator: 1, numeratorUnit: 'g', denominator: 0, denominatorUnit: '' }],
  'Parse simple dosage: 1g'
);

assertEquals(
  parseDosage('40 mg'),
  [{ numerator: 40, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }],
  'Parse simple dosage with space: 40 mg'
);

assertEquals(
  parseDosage('100IU'),
  [{ numerator: 100, numeratorUnit: 'IU', denominator: 0, denominatorUnit: '' }],
  'Parse international units: 100IU'
);

// ========================================
// Test Suite 2: Ratio Dosages
// ========================================
console.log('\nTest Suite 2: Ratio Dosages');
console.log('-------------------------------------------');

assertEquals(
  parseDosage('100mg/5ml'),
  [{ numerator: 100, numeratorUnit: 'mg', denominator: 5, denominatorUnit: 'ml' }],
  'Parse ratio: 100mg/5ml'
);

assertEquals(
  parseDosage('50mg/ml'),
  [{ numerator: 50, numeratorUnit: 'mg', denominator: 1, denominatorUnit: 'ml' }],
  'Parse ratio with denominator 1: 50mg/ml'
);

assertEquals(
  parseDosage('20mg/g'),
  [{ numerator: 20, numeratorUnit: 'mg', denominator: 1, denominatorUnit: 'g' }],
  'Parse ratio: 20mg/g'
);

assertEquals(
  parseDosage('0.5ml/100ml'),
  [{ numerator: 0.5, numeratorUnit: 'ml', denominator: 100, denominatorUnit: 'ml' }],
  'Parse concentration: 0.5ml/100ml'
);

assertEquals(
  parseDosage('1g/100ml'),
  [{ numerator: 1, numeratorUnit: 'g', denominator: 100, denominatorUnit: 'ml' }],
  'Parse solution: 1g/100ml'
);

// ========================================
// Test Suite 3: Decimal Values
// ========================================
console.log('\nTest Suite 3: Decimal Values');
console.log('-------------------------------------------');

assertEquals(
  parseDosage('2.5mg'),
  [{ numerator: 2.5, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }],
  'Parse decimal: 2.5mg'
);

assertEquals(
  parseDosage('2.5mg/ml'),
  [{ numerator: 2.5, numeratorUnit: 'mg', denominator: 1, denominatorUnit: 'ml' }],
  'Parse decimal ratio: 2.5mg/ml'
);

assertEquals(
  parseDosage('0.9g'),
  [{ numerator: 0.9, numeratorUnit: 'g', denominator: 0, denominatorUnit: '' }],
  'Parse decimal less than 1: 0.9g'
);

assertEquals(
  parseDosage('.5mg'),
  [{ numerator: 0.5, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }],
  'Parse decimal without leading zero: .5mg'
);

assertEquals(
  parseDosage('12.5mg/5ml'),
  [{ numerator: 12.5, numeratorUnit: 'mg', denominator: 5, denominatorUnit: 'ml' }],
  'Parse decimal ratio: 12.5mg/5ml'
);

// ========================================
// Test Suite 4: Percentages
// ========================================
console.log('\nTest Suite 4: Percentages');
console.log('-------------------------------------------');

assertEquals(
  parseDosage('2%'),
  [{ numerator: 2, numeratorUnit: '%', denominator: 0, denominatorUnit: '' }],
  'Parse percentage: 2%'
);

assertEquals(
  parseDosage('10%'),
  [{ numerator: 10, numeratorUnit: '%', denominator: 0, denominatorUnit: '' }],
  'Parse percentage: 10%'
);

assertEquals(
  parseDosage('0.9%'),
  [{ numerator: 0.9, numeratorUnit: '%', denominator: 0, denominatorUnit: '' }],
  'Parse decimal percentage: 0.9%'
);

// ========================================
// Test Suite 5: Complex Units
// ========================================
console.log('\nTest Suite 5: Complex Units');
console.log('-------------------------------------------');

assertEquals(
  parseDosage('1440 ELISA units/ml'),
  [{ numerator: 1440, numeratorUnit: 'ELISA units', denominator: 1, denominatorUnit: 'ml' }],
  'Parse complex unit: 1440 ELISA units/ml'
);

assertEquals(
  parseDosage('50,000IU'),
  [{ numerator: 50000, numeratorUnit: 'IU', denominator: 0, denominatorUnit: '' }],
  'Parse with comma separator: 50,000IU'
);

assertEquals(
  parseDosage('1033 PFU'),
  [{ numerator: 1033, numeratorUnit: 'PFU', denominator: 0, denominatorUnit: '' }],
  'Parse PFU unit: 1033 PFU'
);

// ========================================
// Test Suite 6: Multi-Ingredient Dosages
// ========================================
console.log('\nTest Suite 6: Multi-Ingredient Dosages');
console.log('-------------------------------------------');

assertEquals(
  parseDosage('0.1mg/g + 2.5mg + 50mg'),
  [
    { numerator: 0.1, numeratorUnit: 'mg', denominator: 1, denominatorUnit: 'g' },
    { numerator: 2.5, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' },
    { numerator: 50, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }
  ],
  'Parse 3-ingredient dosage: 0.1mg/g + 2.5mg + 50mg'
);

assertEquals(
  parseDosage('100mg + 200mg'),
  [
    { numerator: 100, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' },
    { numerator: 200, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }
  ],
  'Parse 2-ingredient dosage: 100mg + 200mg'
);

assertEquals(
  parseDosage('0.1mg/g+2.5mg+50mg+20mg'),
  [
    { numerator: 0.1, numeratorUnit: 'mg', denominator: 1, denominatorUnit: 'g' },
    { numerator: 2.5, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' },
    { numerator: 50, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }
  ],
  'Parse 4-ingredient (only first 3 captured): 0.1mg/g+2.5mg+50mg+20mg'
);

// The complex example from user
assertEquals(
  parseDosage('0.1mg/g fluocinolone acetonide +menthol 2.5mg +bismuth subgallate 50mg + lidocaine HCl 20mg'),
  [
    { numerator: 0.1, numeratorUnit: 'mg', denominator: 1, denominatorUnit: 'g' },
    { numerator: 2.5, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' },
    { numerator: 50, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }
  ],
  'Parse complex multi-ingredient with drug names'
);

// ========================================
// Test Suite 7: Edge Cases
// ========================================
console.log('\nTest Suite 7: Edge Cases');
console.log('-------------------------------------------');

assertEquals(
  parseDosage(null),
  [],
  'Handle null input'
);

assertEquals(
  parseDosage(''),
  [],
  'Handle empty string'
);

assertEquals(
  parseDosage('   '),
  [],
  'Handle whitespace-only string'
);

assertEquals(
  parseDosage(undefined),
  [],
  'Handle undefined input'
);

assertEquals(
  parseDosage('invalid text'),
  [],
  'Handle unparseable text'
);

assertEquals(
  parseDosage('mg'),
  [],
  'Handle unit without number'
);

// ========================================
// Test Suite 8: Format Dosage
// ========================================
console.log('\nTest Suite 8: Format Dosage Function');
console.log('-------------------------------------------');

assertEquals(
  formatDosage([{ numerator: 500, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }]),
  '500mg',
  'Format simple dosage'
);

assertEquals(
  formatDosage([{ numerator: 100, numeratorUnit: 'mg', denominator: 5, denominatorUnit: 'ml' }]),
  '100mg/5ml',
  'Format ratio dosage'
);

assertEquals(
  formatDosage([
    { numerator: 100, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' },
    { numerator: 200, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }
  ]),
  '100mg + 200mg',
  'Format multi-ingredient dosage'
);

assertEquals(
  formatDosage([]),
  '',
  'Format empty array'
);

// ========================================
// Test Suite 9: Validation Function
// ========================================
console.log('\nTest Suite 9: Validation Function');
console.log('-------------------------------------------');

assertTrue(
  isValidParsedDosage({ numerator: 500, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }),
  'Valid simple dosage'
);

assertTrue(
  isValidParsedDosage({ numerator: 100, numeratorUnit: 'mg', denominator: 5, denominatorUnit: 'ml' }),
  'Valid ratio dosage'
);

assertTrue(
  isValidParsedDosage({ numerator: 2.5, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }),
  'Valid decimal dosage'
);

assertFalse(
  isValidParsedDosage({ numerator: 0, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }),
  'Invalid: numerator is zero'
);

assertFalse(
  isValidParsedDosage({ numerator: -5, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }),
  'Invalid: negative numerator'
);

assertFalse(
  isValidParsedDosage({ numerator: 100, numeratorUnit: '', denominator: 0, denominatorUnit: '' }),
  'Invalid: empty numerator unit'
);

assertFalse(
  isValidParsedDosage({ numerator: 100, numeratorUnit: 'mg', denominator: 5, denominatorUnit: '' }),
  'Invalid: denominator > 0 with empty unit'
);

assertFalse(
  isValidParsedDosage({ numerator: 100, numeratorUnit: 'mg', denominator: 0, denominatorUnit: 'ml' }),
  'Invalid: denominator = 0 with non-empty unit'
);

assertFalse(
  isValidParsedDosage(null),
  'Invalid: null input'
);

// ========================================
// Test Suite 10: Real-World Examples
// ========================================
console.log('\nTest Suite 10: Real-World Examples from Database');
console.log('-------------------------------------------');

// From actual database data
assertEquals(
  parseDosage('24 mg'),
  [{ numerator: 24, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }],
  'Real: 24 mg'
);

assertEquals(
  parseDosage('50mg/ml'),
  [{ numerator: 50, numeratorUnit: 'mg', denominator: 1, denominatorUnit: 'ml' }],
  'Real: 50mg/ml'
);

assertEquals(
  parseDosage('20mcg/ml'),
  [{ numerator: 20, numeratorUnit: 'mcg', denominator: 1, denominatorUnit: 'ml' }],
  'Real: 20mcg/ml'
);

assertEquals(
  parseDosage('100mg/5ml'),
  [{ numerator: 100, numeratorUnit: 'mg', denominator: 5, denominatorUnit: 'ml' }],
  'Real: 100mg/5ml'
);

// ========================================
// Summary
// ========================================
console.log('\n===========================================');
console.log('Test Summary');
console.log('===========================================');
console.log(`Total Tests: ${testsPassed + testsFailed}`);
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);

if (testsFailed === 0) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log(`\n✗ ${testsFailed} test(s) failed`);
  process.exit(1);
}
