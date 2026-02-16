/**
 * Unit Tests for Dosage Parser Extensions (Route & Dosage Cleaning)
 * 
 * Tests the new reconstruction functions added for the cleaning feature.
 * 
 * Run with: node tests/dosageParserExtensions.test.js
 */

const { 
  convertDosageTableRow,
  reconstructDrugDosageString,
  canReconstructDosage,
  formatMultipleDosages
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
console.log('Dosage Parser Extensions Unit Tests');
console.log('===========================================\n');

// ========================================
// Test Suite 1: convertDosageTableRow
// ========================================
console.log('Test Suite 1: convertDosageTableRow');
console.log('-------------------------------------------');

assertEquals(
  convertDosageTableRow({
    Numerator1: 500,
    Numerator1Unit: 'mg',
    Denominator1: 0,
    Denominator1Unit: ''
  }),
  [{ numerator: 500, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }],
  'Convert simple dosage table row'
);

assertEquals(
  convertDosageTableRow({
    Numerator1: 100,
    Numerator1Unit: 'mg',
    Denominator1: 5,
    Denominator1Unit: 'ml'
  }),
  [{ numerator: 100, numeratorUnit: 'mg', denominator: 5, denominatorUnit: 'ml' }],
  'Convert ratio dosage table row'
);

assertEquals(
  convertDosageTableRow({
    Numerator1: 500,
    Numerator1Unit: 'mg',
    Denominator1: 0,
    Denominator1Unit: '',
    Numerator2: 250,
    Numerator2Unit: 'mg',
    Denominator2: 0,
    Denominator2Unit: ''
  }),
  [
    { numerator: 500, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' },
    { numerator: 250, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }
  ],
  'Convert multiple dosage components'
);

assertEquals(
  convertDosageTableRow({
    Numerator1: 0.1,
    Numerator1Unit: 'mg',
    Denominator1: 1,
    Denominator1Unit: 'g',
    Numerator2: 2.5,
    Numerator2Unit: 'mg',
    Denominator2: 0,
    Denominator2Unit: '',
    Numerator3: 50,
    Numerator3Unit: 'mg',
    Denominator3: 0,
    Denominator3Unit: ''
  }),
  [
    { numerator: 0.1, numeratorUnit: 'mg', denominator: 1, denominatorUnit: 'g' },
    { numerator: 2.5, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' },
    { numerator: 50, numeratorUnit: 'mg', denominator: 0, denominatorUnit: '' }
  ],
  'Convert three dosage components with decimals'
);

assertEquals(
  convertDosageTableRow({
    Numerator1: null,
    Numerator1Unit: null
  }),
  [],
  'Convert empty dosage row returns empty array'
);

assertEquals(
  convertDosageTableRow(null),
  [],
  'Convert null returns empty array'
);

console.log();

// ========================================
// Test Suite 2: reconstructDrugDosageString
// ========================================
console.log('Test Suite 2: reconstructDrugDosageString');
console.log('-------------------------------------------');

assertEquals(
  reconstructDrugDosageString({
    Numerator1: 500,
    Numerator1Unit: 'mg',
    Denominator1: 0,
    Denominator1Unit: ''
  }),
  '500mg',
  'Reconstruct simple dosage string'
);

assertEquals(
  reconstructDrugDosageString({
    Numerator1: 100,
    Numerator1Unit: 'mg',
    Denominator1: 5,
    Denominator1Unit: 'ml'
  }),
  '100mg/5ml',
  'Reconstruct ratio dosage string'
);

assertEquals(
  reconstructDrugDosageString({
    Numerator1: 500,
    Numerator1Unit: 'mg',
    Denominator1: 0,
    Denominator1Unit: '',
    Numerator2: 250,
    Numerator2Unit: 'mg',
    Denominator2: 0,
    Denominator2Unit: ''
  }),
  '500mg + 250mg',
  'Reconstruct multiple components'
);

assertEquals(
  reconstructDrugDosageString({
    Numerator1: 0.1,
    Numerator1Unit: 'mg',
    Denominator1: 1,
    Denominator1Unit: 'g',
    Numerator2: 2.5,
    Numerator2Unit: 'mg',
    Denominator2: 0,
    Denominator2Unit: '',
    Numerator3: 50,
    Numerator3Unit: 'mg',
    Denominator3: 0,
    Denominator3Unit: ''
  }),
  '0.1mg/1g + 2.5mg + 50mg',
  'Reconstruct complex multi-component dosage'
);

assertEquals(
  reconstructDrugDosageString({
    Numerator1: null,
    Numerator1Unit: null
  }),
  '',
  'Reconstruct empty dosage returns empty string'
);

console.log();

// ========================================
// Test Suite 3: canReconstructDosage
// ========================================
console.log('Test Suite 3: canReconstructDosage');
console.log('-------------------------------------------');

assertTrue(
  canReconstructDosage({
    Numerator1: 500,
    Numerator1Unit: 'mg',
    Denominator1: 0,
    Denominator1Unit: ''
  }),
  'Valid simple dosage can be reconstructed'
);

assertTrue(
  canReconstructDosage({
    Numerator1: 100,
    Numerator1Unit: 'mg',
    Denominator1: 5,
    Denominator1Unit: 'ml'
  }),
  'Valid ratio dosage can be reconstructed'
);

assertFalse(
  canReconstructDosage({
    Numerator1: null,
    Numerator1Unit: null
  }),
  'Empty dosage cannot be reconstructed'
);

assertFalse(
  canReconstructDosage({
    Numerator1: 500,
    Numerator1Unit: null
  }),
  'Dosage without unit cannot be reconstructed'
);

assertFalse(
  canReconstructDosage({
    Numerator1: -500,
    Numerator1Unit: 'mg',
    Denominator1: 0,
    Denominator1Unit: ''
  }),
  'Negative numerator cannot be reconstructed'
);

assertFalse(
  canReconstructDosage(null),
  'Null input cannot be reconstructed'
);

assertTrue(
  canReconstructDosage({
    Numerator1: 0.1,
    Numerator1Unit: 'mg',
    Denominator1: 1,
    Denominator1Unit: 'g'
  }),
  'Decimal values can be reconstructed'
);

console.log();

// ========================================
// Test Suite 4: formatMultipleDosages
// ========================================
console.log('Test Suite 4: formatMultipleDosages');
console.log('-------------------------------------------');

assertEquals(
  formatMultipleDosages([
    {
      Numerator1: 500,
      Numerator1Unit: 'mg',
      Denominator1: 0,
      Denominator1Unit: ''
    }
  ]),
  '500mg',
  'Format single dosage record'
);

assertEquals(
  formatMultipleDosages([
    {
      Numerator1: 500,
      Numerator1Unit: 'mg',
      Denominator1: 0,
      Denominator1Unit: ''
    },
    {
      Numerator1: 250,
      Numerator1Unit: 'mg',
      Denominator1: 0,
      Denominator1Unit: ''
    }
  ]),
  '500mg + 250mg',
  'Format multiple dosage records'
);

assertEquals(
  formatMultipleDosages([
    {
      Numerator1: 100,
      Numerator1Unit: 'mg',
      Denominator1: 5,
      Denominator1Unit: 'ml',
      Numerator2: 50,
      Numerator2Unit: 'mcg',
      Denominator2: 0,
      Denominator2Unit: ''
    }
  ]),
  '100mg/5ml + 50mcg',
  'Format record with multiple components'
);

assertEquals(
  formatMultipleDosages([]),
  '',
  'Format empty array returns empty string'
);

assertEquals(
  formatMultipleDosages(null),
  '',
  'Format null returns empty string'
);

// Test limiting to 3 components
const result = formatMultipleDosages([
  { Numerator1: 100, Numerator1Unit: 'mg', Denominator1: 0, Denominator1Unit: '' },
  { Numerator1: 200, Numerator1Unit: 'mg', Denominator1: 0, Denominator1Unit: '' },
  { Numerator1: 300, Numerator1Unit: 'mg', Denominator1: 0, Denominator1Unit: '' },
  { Numerator1: 400, Numerator1Unit: 'mg', Denominator1: 0, Denominator1Unit: '' }
]);

assertTrue(
  result === '100mg + 200mg + 300mg',
  'Format limits to 3 components'
);

console.log();

// ========================================
// Test Suite 5: Integration Tests
// ========================================
console.log('Test Suite 5: Integration Tests');
console.log('-------------------------------------------');

// Test round-trip: table row → parse → format → should match original string
const tableRow1 = {
  Numerator1: 500,
  Numerator1Unit: 'mg',
  Denominator1: 0,
  Denominator1Unit: ''
};
const reconstructed1 = reconstructDrugDosageString(tableRow1);
assertEquals(
  reconstructed1,
  '500mg',
  'Round-trip test: simple dosage'
);

const tableRow2 = {
  Numerator1: 100,
  Numerator1Unit: 'mg',
  Denominator1: 5,
  Denominator1Unit: 'ml'
};
const reconstructed2 = reconstructDrugDosageString(tableRow2);
assertEquals(
  reconstructed2,
  '100mg/5ml',
  'Round-trip test: ratio dosage'
);

const tableRow3 = {
  Numerator1: 0.1,
  Numerator1Unit: 'mg',
  Denominator1: 1,
  Denominator1Unit: 'g',
  Numerator2: 2.5,
  Numerator2Unit: 'mg',
  Denominator2: 0,
  Denominator2Unit: '',
  Numerator3: 50,
  Numerator3Unit: 'mg',
  Denominator3: 0,
  Denominator3Unit: ''
};
const reconstructed3 = reconstructDrugDosageString(tableRow3);
assertEquals(
  reconstructed3,
  '0.1mg/1g + 2.5mg + 50mg',
  'Round-trip test: complex multi-component'
);

console.log();

// ========================================
// Test Summary
// ========================================
console.log('===========================================');
console.log('Test Summary');
console.log('===========================================');
console.log(`Total Tests: ${testsPassed + testsFailed}`);
console.log(`✓ Passed: ${testsPassed}`);
console.log(`✗ Failed: ${testsFailed}`);
console.log('===========================================\n');

if (testsFailed === 0) {
  console.log('🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('❌ Some tests failed. Please review the output above.');
  process.exit(1);
}
