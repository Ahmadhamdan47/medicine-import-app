/**
 * Unit Tests for Route Cleaning Helpers
 * 
 * Tests helper functions used in route cleaning (fuzzy matching, etc.)
 * These tests don't require database connection.
 * 
 * Run with: node tests/routeCleaningHelpers.test.js
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

// Mock Levenshtein distance function (copied from routeCleaningService)
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

// Mock fuzzy matching logic
function testFuzzyMatch(routeRaw, acronym, route) {
  // Handle empty or invalid routeRaw (matching actual service behavior)
  if (!routeRaw || typeof routeRaw !== 'string') {
    return { score: 0, matchType: null };
  }
  
  const routeRawLower = routeRaw.toLowerCase().trim();
  const acronymLower = (acronym || '').toLowerCase().trim();
  const routeLower = (route || '').toLowerCase().trim();
  
  let score = 0;
  let matchType = null;

  // Exact match on acronym (highest priority)
  if (acronymLower === routeRawLower) {
    score = 100;
    matchType = 'exact_acronym';
  }
  // Exact match on route
  else if (routeLower === routeRawLower) {
    score = 95;
    matchType = 'exact_route';
  }
  // Starts with match on acronym
  else if (acronymLower && routeRawLower.startsWith(acronymLower)) {
    score = 90;
    matchType = 'starts_acronym';
  }
  // Contains match on acronym
  else if (acronymLower && routeRawLower.includes(acronymLower)) {
    score = 80;
    matchType = 'contains_acronym';
  }
  // Starts with match on route
  else if (routeLower && routeRawLower.startsWith(routeLower.substring(0, 3))) {
    score = 70;
    matchType = 'starts_route';
  }
  // Contains match on route
  else if (routeLower && routeRawLower.includes(routeLower.substring(0, 4))) {
    score = 60;
    matchType = 'contains_route';
  }
  // Fuzzy match - use Levenshtein distance
  else {
    const distAcronym = acronymLower ? levenshteinDistance(routeRawLower, acronymLower) : 999;
    const distRoute = routeLower ? levenshteinDistance(routeRawLower, routeLower) : 999;
    const minDist = Math.min(distAcronym, distRoute);
    
    const maxLen = Math.max(routeRawLower.length, acronymLower ? acronymLower.length : 0, routeLower ? routeLower.length : 0);
    if (minDist <= maxLen * 0.4) { // 40% tolerance
      score = Math.max(10, 50 - (minDist * 5));
      matchType = minDist === distAcronym ? 'fuzzy_acronym' : 'fuzzy_route';
    }
  }

  return { score, matchType };
}

console.log('===========================================');
console.log('Route Cleaning Helpers Unit Tests');
console.log('===========================================\n');

// ========================================
// Test Suite 1: Levenshtein Distance
// ========================================
console.log('Test Suite 1: Levenshtein Distance');
console.log('-------------------------------------------');

assertEquals(
  levenshteinDistance('', ''),
  0,
  'Empty strings have distance 0'
);

assertEquals(
  levenshteinDistance('abc', 'abc'),
  0,
  'Identical strings have distance 0'
);

assertEquals(
  levenshteinDistance('ABC', 'abc'),
  0,
  'Case-insensitive comparison'
);

assertEquals(
  levenshteinDistance('cat', 'cut'),
  1,
  'Single substitution has distance 1'
);

assertEquals(
  levenshteinDistance('cat', 'cats'),
  1,
  'Single insertion has distance 1'
);

assertEquals(
  levenshteinDistance('cats', 'cat'),
  1,
  'Single deletion has distance 1'
);

assertEquals(
  levenshteinDistance('kitten', 'sitting'),
  3,
  'Complex string has correct distance'
);

assertEquals(
  levenshteinDistance('IV', 'Intravenous'),
  9,
  'Very different strings have large distance'
);

console.log();

// ========================================
// Test Suite 2: Exact Matching
// ========================================
console.log('Test Suite 2: Exact Matching');
console.log('-------------------------------------------');

let match = testFuzzyMatch('O', 'O', 'Oral');
assertEquals(
  [match.score, match.matchType],
  [100, 'exact_acronym'],
  'Exact acronym match returns 100 score'
);

match = testFuzzyMatch('Oral', 'O', 'Oral');
assertEquals(
  [match.score, match.matchType],
  [95, 'exact_route'],
  'Exact route match returns 95 score'
);

match = testFuzzyMatch('IV', 'IV', 'Intravenous');
assertEquals(
  [match.score, match.matchType],
  [100, 'exact_acronym'],
  'IV exact match'
);

match = testFuzzyMatch('Intravenous', 'IV', 'Intravenous');
assertEquals(
  [match.score, match.matchType],
  [95, 'exact_route'],
  'Intravenous exact match'
);

console.log();

// ========================================
// Test Suite 3: Starts With Matching
// ========================================
console.log('Test Suite 3: Starts With Matching');
console.log('-------------------------------------------');

match = testFuzzyMatch('Oral+Topical', 'O', 'Oral');
assertEquals(
  [match.score, match.matchType],
  [90, 'starts_acronym'],
  'Starts with acronym match'
);

match = testFuzzyMatch('Ora', 'O', 'Oral');
assertEquals(
  [match.score, match.matchType],
  [90, 'starts_acronym'],
  'Starts with route match (prioritizes acronym)'
);

console.log();

// ========================================
// Test Suite 4: Contains Matching
// ========================================
console.log('Test Suite 4: Contains Matching');
console.log('-------------------------------------------');

match = testFuzzyMatch('TopicalO', 'O', 'Oral');
assertEquals(
  [match.score, match.matchType],
  [80, 'contains_acronym'],
  'Contains acronym match'
);

match = testFuzzyMatch('SublingualOral', 'O', 'Oral');
assertTrue(
  match.score >= 60,
  'Contains route match has score >= 60'
);

console.log();

// ========================================
// Test Suite 5: Fuzzy Matching
// ========================================
console.log('Test Suite 5: Fuzzy Matching');
console.log('-------------------------------------------');

match = testFuzzyMatch('Oraal', '', 'Oral');
assertTrue(
  match.score > 0 && match.score < 90,
  'Fuzzy match for misspelled route'
);

match = testFuzzyMatch('Intrav', 'IV', 'Intravenous');
assertTrue(
  match.score > 0,
  'Fuzzy match for abbreviated route'
);

match = testFuzzyMatch('xyz', 'O', 'Oral');
assertTrue(
  match.score === 0 || match.score < 30,
  'Very different strings have low or zero score'
);

console.log();

// ========================================
// Test Suite 6: Case Insensitivity
// ========================================
console.log('Test Suite 6: Case Insensitivity');
console.log('-------------------------------------------');

match = testFuzzyMatch('oral', 'O', 'Oral');
assertEquals(
  match.matchType,
  'exact_route',
  'Lowercase matches uppercase route'
);

match = testFuzzyMatch('ORAL', 'O', 'Oral');
assertEquals(
  match.matchType,
  'exact_route',
  'Uppercase matches mixed case route'
);

match = testFuzzyMatch('o', 'O', 'Oral');
assertEquals(
  match.matchType,
  'exact_acronym',
  'Lowercase matches uppercase acronym'
);

console.log();

// ========================================
// Test Suite 7: Edge Cases
// ========================================
console.log('Test Suite 7: Edge Cases');
console.log('-------------------------------------------');

match = testFuzzyMatch('', 'O', 'Oral');
assertEquals(
  match.score,
  0,
  'Empty RouteRaw returns 0 score'
);

match = testFuzzyMatch('Test', null, null);
assertTrue(
  match.score === 0,
  'Null acronym and route returns 0 score'
);

match = testFuzzyMatch('Test', '', '');
assertTrue(
  match.score === 0,
  'Empty acronym and route returns 0 score'
);

console.log();

// ========================================
// Test Suite 8: Common Routes
// ========================================
console.log('Test Suite 8: Common Routes Matching');
console.log('-------------------------------------------');

const commonRoutes = [
  { raw: 'O', acronym: 'O', route: 'Oral', expectedType: 'exact_acronym' },
  { raw: 'IV', acronym: 'IV', route: 'Intravenous', expectedType: 'exact_acronym' },
  { raw: 'IM', acronym: 'IM', route: 'Intramuscular', expectedType: 'exact_acronym' },
  { raw: 'SC', acronym: 'SC', route: 'Subcutaneous', expectedType: 'exact_acronym' },
  { raw: 'Top', acronym: 'Top', route: 'Topical', expectedType: 'exact_acronym' },
  { raw: 'Oph', acronym: 'Oph', route: 'Ophthalmic', expectedType: 'exact_acronym' },
  { raw: 'Nas', acronym: 'Nas', route: 'Nasal', expectedType: 'exact_acronym' },
  { raw: 'Rec', acronym: 'Rec', route: 'Rectal', expectedType: 'exact_acronym' }
];

for (const { raw, acronym, route, expectedType } of commonRoutes) {
  match = testFuzzyMatch(raw, acronym, route);
  assertTrue(
    match.score === 100 && match.matchType === expectedType,
    `${raw} matches ${route} correctly`
  );
}

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
