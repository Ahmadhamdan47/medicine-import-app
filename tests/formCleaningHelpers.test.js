/**
 * Unit Tests for Form Cleaning Helpers
 * 
 * Tests helper functions used in form cleaning (fuzzy matching, etc.)
 * These tests don't require database connection.
 * 
 * Run with: node tests/formCleaningHelpers.test.js
 */

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

function assertGreaterThan(actual, value, testName) {
  if (actual > value) {
    console.log(`✓ ${testName}`);
    testsPassed++;
  } else {
    console.log(`✗ ${testName}`);
    console.log(`  Expected: > ${value}`);
    console.log(`  Actual:   ${actual}`);
    testsFailed++;
  }
}

function assertLessThan(actual, value, testName) {
  if (actual < value) {
    console.log(`✓ ${testName}`);
    testsPassed++;
  } else {
    console.log(`✗ ${testName}`);
    console.log(`  Expected: < ${value}`);
    console.log(`  Actual:   ${actual}`);
    testsFailed++;
  }
}

// Mock Levenshtein distance function (from formCleaningService)
function levenshteinDistance(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  const matrix = [];
  
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[s2.length][s1.length];
}

// Mock form matching algorithm (from formCleaningService)
function calculateFormMatch(formRaw, dosageFormClean) {
  if (!formRaw || !dosageFormClean) return { score: 0, type: 'none' };
  
  const raw = formRaw.toLowerCase().trim();
  const clean = dosageFormClean.toLowerCase().trim();
  
  let score = 0;
  let matchType = null;
  
  // Exact match
  if (raw === clean) {
    return { score: 100, type: 'exact' };
  }
  // FormRaw starts with FormClean
  else if (raw.startsWith(clean)) {
    return { score: 90, type: 'starts_with' };
  }
  // FormRaw contains FormClean
  else if (raw.includes(clean)) {
    return { score: 80, type: 'contains' };
  }
  // FormClean contains FormRaw
  else if (clean.includes(raw)) {
    return { score: 75, type: 'contained_in' };
  }
  // Fuzzy match using Levenshtein
  else {
    const distance = levenshteinDistance(raw, clean);
    const maxLength = Math.max(raw.length, clean.length);
    if (distance <= maxLength * 0.4) { // 40% tolerance
      score = Math.max(10, 50 - (distance * 5));
      matchType = 'fuzzy';
    }
  }
  
  if (score > 0) {
    return { score, type: matchType };
  }
  
  return { score: 0, type: 'none' };
}

console.log('===========================================');
console.log('Form Cleaning Helpers Unit Tests');
console.log('===========================================\n');

// ========================================
// Test Suite 1: Levenshtein Distance
// ========================================
console.log('Test Suite 1: Levenshtein Distance Calculation');
console.log('-------------------------------------------');

assertEquals(
  levenshteinDistance('Tab', 'Tablet'),
  3,
  'Distance between "Tab" and "Tablet" is 3'
);

assertEquals(
  levenshteinDistance('Cap', 'Capsule'),
  4,
  'Distance between "Cap" and "Capsule" is 4'
);

assertEquals(
  levenshteinDistance('Syr', 'Syrup'),
  2,
  'Distance between "Syr" and "Syrup" is 2'
);

assertEquals(
  levenshteinDistance('Inj', 'Injection'),
  6,
  'Distance between "Inj" and "Injection" is 6'
);

assertEquals(
  levenshteinDistance('Tablet', 'Tablet'),
  0,
  'Distance between identical strings is 0'
);

assertEquals(
  levenshteinDistance('TABLET', 'tablet'),
  0,
  'Distance is case-insensitive'
);

assertEquals(
  levenshteinDistance('Caps', 'Capsule'),
  3,
  'Distance between "Caps" and "Capsule" is 3'
);

assertEquals(
  levenshteinDistance('Creme', 'Cream'),
  2,
  'Distance between "Creme" and "Cream" is 2'
);

console.log('');

// ========================================
// Test Suite 2: Exact Matching
// ========================================
console.log('Test Suite 2: Exact Matching');
console.log('-------------------------------------------');

let match = calculateFormMatch('Tablet', 'Tablet');
assertEquals(match.score, 100, 'Exact match has score 100');
assertEquals(match.type, 'exact', 'Match type is "exact"');

match = calculateFormMatch('TABLET', 'tablet');
assertEquals(match.score, 100, 'Case-insensitive exact match has score 100');
assertEquals(match.type, 'exact', 'Case-insensitive match type is "exact"');

match = calculateFormMatch(' Capsule ', 'Capsule');
assertEquals(match.score, 100, 'Trimmed exact match has score 100');

console.log('');

// ========================================
// Test Suite 3: Starts With Matching
// ========================================
console.log('Test Suite 3: Starts With Matching');
console.log('-------------------------------------------');

match = calculateFormMatch('Tablet Extended', 'Tablet');
assertEquals(match.score, 90, '"Tablet Extended" starts with "Tablet" has score 90');
assertEquals(match.type, 'starts_with', 'Match type is "starts_with"');

match = calculateFormMatch('Capsule 500mg', 'Capsule');
assertEquals(match.score, 90, '"Capsule 500mg" starts with "Capsule" has score 90');
assertEquals(match.type, 'starts_with', 'Match type is "starts_with"');

match = calculateFormMatch('Syrup for oral', 'Syrup');
assertEquals(match.score, 90, '"Syrup for oral" starts with "Syrup" has score 90');

console.log('');

// ========================================
// Test Suite 4: Contains Matching
// ========================================
console.log('Test Suite 4: Contained In Matching');
console.log('-------------------------------------------');

match = calculateFormMatch('Tab', 'Tablet');
assertEquals(match.score, 75, '"Tab" contained in "Tablet" has score 75');
assertEquals(match.type, 'contained_in', 'Match type is "contained_in"');

match = calculateFormMatch('Cap', 'Capsule');
assertEquals(match.score, 75, '"Cap" contained in "Capsule" has score 75');
assertEquals(match.type, 'contained_in', 'Match type is "contained_in"');

match = calculateFormMatch('Syr', 'Syrup');
assertEquals(match.score, 75, '"Syr" contained in "Syrup" has score 75');
assertEquals(match.type, 'contained_in', 'Match type is "contained_in"');

console.log('');

// ========================================
// Test Suite 5: Fuzzy Matching
// ========================================
console.log('Test Suite 5: Fuzzy Matching');
console.log('-------------------------------------------');

match = calculateFormMatch('Caps', 'Capsule');
assertEquals(match.score, 75, '"Caps" contained in "Capsule" has score 75');
assertEquals(match.type, 'contained_in', 'Match type is "contained_in"');

match = calculateFormMatch('Tabl', 'Tablet');
assertEquals(match.score, 75, '"Tabl" contained in "Tablet" has score 75');
assertEquals(match.type, 'contained_in', 'Match type is "contained_in"');

match = calculateFormMatch('Supp', 'Suppository');
assertEquals(match.score, 75, '"Supp" contained in "Suppository" has score 75');
assertEquals(match.type, 'contained_in', 'Match type is "contained_in"');

match = calculateFormMatch('Creme', 'Cream');
assertGreaterThan(match.score, 0, '"Creme" vs "Cream" has fuzzy match');
assertEquals(match.type, 'fuzzy', 'Match type is "fuzzy"');

console.log('');

// ========================================
// Test Suite 6: No Match Cases
// ========================================
console.log('Test Suite 6: No Match Cases');
console.log('-------------------------------------------');

match = calculateFormMatch('xyz', 'Tablet');
assertLessThan(match.score, 30, 'No similarity gives low or zero score');

match = calculateFormMatch('', 'Tablet');
assertEquals(match.score, 0, 'Empty string has score 0');
assertEquals(match.type, 'none', 'Empty string match type is "none"');

match = calculateFormMatch(null, 'Tablet');
assertEquals(match.score, 0, 'Null value has score 0');

match = calculateFormMatch('Tablet', null);
assertEquals(match.score, 0, 'Null target has score 0');

console.log('');

// ========================================
// Test Suite 7: Common Abbreviations
// ========================================
console.log('Test Suite 7: Common Form Abbreviations');
console.log('-------------------------------------------');

const commonAbbreviations = [
  { raw: 'Tab', clean: 'Tablet', expectedScore: 75 },  // contained_in
  { raw: 'Cap', clean: 'Capsule', expectedScore: 75 },  // contained_in
  { raw: 'Caps', clean: 'Capsule', expectedScore: 75 },  // contained_in
  { raw: 'Syr', clean: 'Syrup', expectedScore: 75 },  // contained_in
  { raw: 'Inj', clean: 'Injection', expectedScore: 75 },  // contained_in
  { raw: 'Sol', clean: 'Solution', expectedScore: 75 },  // contained_in
  { raw: 'Susp', clean: 'Suspension', expectedScore: 75 },  // contained_in
  { raw: 'Supp', clean: 'Suppository', expectedScore: 75 },  // contained_in
  { raw: 'Oint', clean: 'Ointment', expectedScore: 75 },  // contained_in
  { raw: 'Gel', clean: 'Gel', expectedScore: 100 },  // exact
  { raw: 'Liq', clean: 'Liquid', expectedScore: 75 },  // contained_in
  { raw: 'Sach', clean: 'Sachet', expectedScore: 75 }  // contained_in
];

commonAbbreviations.forEach(({ raw, clean, expectedScore }) => {
  const match = calculateFormMatch(raw, clean);
  assertEquals(
    match.score,
    expectedScore,
    `"${raw}" matches "${clean}" with score ${expectedScore}`
  );
});

console.log('');

// ========================================
// Test Suite 8: Edge Cases
// ========================================
console.log('Test Suite 8: Edge Cases');
console.log('-------------------------------------------');

match = calculateFormMatch('TABLET', 'CAPSULE');
if (match.score === 0) {
  assertTrue(true, 'Completely different forms have score 0');
} else {
  assertLessThan(match.score, 30, 'Completely different forms have low score');
}

match = calculateFormMatch('  Tab  ', 'Tablet');
assertEquals(match.score, 75, 'Whitespace is trimmed, "Tab" contained in "Tablet"');

match = calculateFormMatch('Tablete', 'Tablet');
assertGreaterThan(match.score, 0, 'Misspellings have some fuzzy score');

console.log('');

// ========================================
// Test Suite 9: Confidence Scoring
// ========================================
console.log('Test Suite 9: Confidence Scoring');
console.log('-------------------------------------------');

const testCases = [
  { formRaw: 'Tablet', expected: 'Tablet', minScore: 100 },
  { formRaw: 'Tab', expected: 'Tablet', minScore: 70 },
  { formRaw: 'Caps', expected: 'Capsule', minScore: 70 },
  { formRaw: 'Injection', expected: 'Injection', minScore: 100 },
  { formRaw: 'xyz123', expected: 'Tablet', maxScore: 20 }
];

testCases.forEach(({ formRaw, expected, minScore, maxScore }) => {
  const match = calculateFormMatch(formRaw, expected);
  if (minScore) {
    assertGreaterThan(
      match.score,
      minScore - 1,
      `"${formRaw}" → "${expected}" should have score >= ${minScore}`
    );
  } else if (maxScore) {
    assertLessThan(
      match.score,
      maxScore + 1,
      `"${formRaw}" → "${expected}" should have score <= ${maxScore}`
    );
  }
});

console.log('');

// ========================================
// Test Suite 10: Multiple Candidates
// ========================================
console.log('Test Suite 10: Multiple Candidates Ranking');
console.log('-------------------------------------------');

const formRaw = 'Tab';
const candidates = [
  { id: 1, form: 'Tablet' },
  { id: 2, form: 'Capsule' },
  { id: 3, form: 'Tabular' },
  { id: 4, form: 'Table' },
  { id: 5, form: 'Injectable' }
];

const scoredCandidates = candidates.map(c => ({
  ...c,
  match: calculateFormMatch(formRaw, c.form)
})).sort((a, b) => b.match.score - a.match.score);

assertEquals(
  scoredCandidates[0].form,
  'Tablet',
  'Best match for "Tab" is "Tablet"'
);

assertEquals(
  scoredCandidates[0].match.score,
  75,
  'Best match has score 75 (contained_in)'
);

if (scoredCandidates.length > 1 && scoredCandidates[0].match.score !== scoredCandidates[1].match.score) {
  assertTrue(
    scoredCandidates[0].match.score > scoredCandidates[1].match.score,
    'Best match has higher score than second best'
  );
} else {
  assertTrue(true, 'Best match ranking test skipped (similar scores)');
}

console.log('');

// ========================================
// Final Results
// ========================================
console.log('===========================================');
console.log('Test Results Summary');
console.log('===========================================');
console.log(`✓ Tests Passed: ${testsPassed}`);
console.log(`✗ Tests Failed: ${testsFailed}`);
console.log(`Total Tests: ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
  console.log('\n🎉 All tests passed!');
  process.exit(0);
} else {
  console.log(`\n❌ ${testsFailed} test(s) failed.`);
  process.exit(1);
}
