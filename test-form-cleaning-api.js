/**
 * API Integration Tests for Form Cleaning Endpoints
 * 
 * Tests all form cleaning API endpoints with HTTP requests.
 * REQUIRES: Server running on http://localhost:8066
 * 
 * Run with: node test-form-cleaning-api.js
 */

const axios = require('axios');

const API_BASE = 'http://localhost:8066/form-cleaning';
let testSession = null;

// Test counter
let testsPassed = 0;
let testsFailed = 0;

// Utility functions
function log(message, type = 'info') {
  const icons = {
    info: 'ℹ',
    success: '✓',
    error: '✗',
    warning: '⚠',
    test: '🧪'
  };
  console.log(`${icons[type] || '•'} ${message}`);
}

function assertEquals(actual, expected, testName) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    log(`${testName}`, 'success');
    testsPassed++;
  } else {
    log(`${testName}`, 'error');
    console.log(`  Expected: ${JSON.stringify(expected)}`);
    console.log(`  Actual:   ${JSON.stringify(actual)}`);
    testsFailed++;
  }
}

function assertTrue(condition, testName) {
  if (condition) {
    log(`${testName}`, 'success');
    testsPassed++;
  } else {
    log(`${testName}`, 'error');
    testsFailed++;
  }
}

function assertNotNull(value, testName) {
  if (value !== null && value !== undefined) {
    log(`${testName}`, 'success');
    testsPassed++;
  } else {
    log(`${testName}`, 'error');
    testsFailed++;
  }
}

// Test functions
async function testGetStats() {
  console.log('\n📊 Test Suite 1: GET /form-cleaning/stats');
  console.log('─────────────────────────────────────────');
  
  try {
    const response = await axios.get(`${API_BASE}/stats`);
    
    assertEquals(response.status, 200, 'Response status is 200');
    assertTrue(response.data.success, 'Response success is true');
    assertNotNull(response.data.stats, 'Response has stats object');
    assertNotNull(response.data.stats.totalDrugs, 'Stats has totalDrugs');
    assertNotNull(response.data.stats.drugsWithForm, 'Stats has drugsWithForm');
    assertNotNull(response.data.stats.drugsWithoutForm, 'Stats has drugsWithoutForm');
    assertNotNull(response.data.stats.uniqueFormRaws, 'Stats has uniqueFormRaws');
    assertNotNull(response.data.stats.cleanPercentage, 'Stats has cleanPercentage');
    
    console.log('\n  Database Statistics:');
    console.log(`    Total Drugs: ${response.data.stats.totalDrugs}`);
    console.log(`    With Forms: ${response.data.stats.drugsWithForm} (${response.data.stats.cleanPercentage}%)`);
    console.log(`    Without Forms: ${response.data.stats.drugsWithoutForm}`);
    console.log(`    Unique FormRaw: ${response.data.stats.uniqueFormRaws}`);
    
    return response.data.stats;
  } catch (error) {
    log(`API call failed: ${error.message}`, 'error');
    testsFailed++;
    throw error;
  }
}

async function testGetUniqueValues() {
  console.log('\n📋 Test Suite 2: GET /form-cleaning/unique-values');
  console.log('──────────────────────────────────────────────────');
  
  try {
    const response = await axios.get(`${API_BASE}/unique-values`);
    
    assertEquals(response.status, 200, 'Response status is 200');
    assertTrue(response.data.success, 'Response success is true');
    assertNotNull(response.data.data, 'Response has data array');
    assertTrue(Array.isArray(response.data.data), 'Data is an array');
    assertNotNull(response.data.count, 'Response has count');
    
    console.log(`\n  Found ${response.data.count} unique FormRaw values`);
    
    if (response.data.data.length > 0) {
      const first = response.data.data[0];
      assertNotNull(first.formRaw, 'First item has formRaw');
      assertNotNull(first.drugCount, 'First item has drugCount');
      
      console.log('\n  Top 5 FormRaw values:');
      response.data.data.slice(0, 5).forEach((item, i) => {
        console.log(`    ${i + 1}. "${item.formRaw}" (${item.drugCount} drugs) → ${item.sampleForm || 'N/A'}`);
      });
    }
    
    return response.data.data;
  } catch (error) {
    log(`API call failed: ${error.message}`, 'error');
    testsFailed++;
    throw error;
  }
}

async function testGetUniqueValuesWithParams() {
  console.log('\n📋 Test Suite 3: GET /form-cleaning/unique-values (with params)');
  console.log('─────────────────────────────────────────────────────────────────');
  
  try {
    // Test with minCount
    const response1 = await axios.get(`${API_BASE}/unique-values`, {
      params: { minCount: 10 }
    });
    assertEquals(response1.status, 200, 'Response with minCount=10 status is 200');
    assertTrue(
      response1.data.data.every(item => item.drugCount >= 10),
      'All items have drugCount >= 10'
    );
    console.log(`  Found ${response1.data.count} FormRaw values with count >= 10`);
    
    // Test with includeNull
    const response2 = await axios.get(`${API_BASE}/unique-values`, {
      params: { includeNull: true }
    });
    assertEquals(response2.status, 200, 'Response with includeNull=true status is 200');
    console.log(`  Found ${response2.data.count} FormRaw values (including null)`);
    
  } catch (error) {
    log(`API call failed: ${error.message}`, 'error');
    testsFailed++;
    throw error;
  }
}

async function testSuggestMatches(uniqueValues) {
  console.log('\n🎯 Test Suite 4: POST /form-cleaning/suggest-matches');
  console.log('─────────────────────────────────────────────────────');
  
  if (!uniqueValues || uniqueValues.length === 0) {
    log('No unique values to test with', 'warning');
    return;
  }
  
  try {
    const testFormRaw = uniqueValues[0].formRaw;
    const response = await axios.post(`${API_BASE}/suggest-matches`, {
      formRaw: testFormRaw,
      limit: 5
    });
    
    assertEquals(response.status, 200, 'Response status is 200');
    assertTrue(response.data.success, 'Response success is true');
    assertNotNull(response.data.suggestions, 'Response has suggestions array');
    assertTrue(Array.isArray(response.data.suggestions), 'Suggestions is an array');
    assertEquals(response.data.formRaw, testFormRaw, 'Response echoes formRaw');
    
    console.log(`\n  Suggestions for FormRaw: "${testFormRaw}"`);
    console.log(`  Found ${response.data.suggestions.length} suggestions:`);
    
    response.data.suggestions.forEach((suggestion, i) => {
      assertNotNull(suggestion.dosageFormClean, `Suggestion ${i + 1} has dosageFormClean`);
      assertNotNull(suggestion.confidence, `Suggestion ${i + 1} has confidence`);
      assertNotNull(suggestion.matchType, `Suggestion ${i + 1} has matchType`);
      
      console.log(`    ${i + 1}. "${suggestion.dosageFormClean}"`);
      console.log(`       Confidence: ${suggestion.confidence}% (${suggestion.matchType})`);
      console.log(`       Physical State: ${suggestion.physicalState || 'N/A'}`);
      console.log(`       Substitution: ${suggestion.substitutionRelationship || 'N/A'}`);
    });
    
    return response.data.suggestions;
  } catch (error) {
    log(`API call failed: ${error.message}`, 'error');
    testsFailed++;
    throw error;
  }
}

async function testGetAffectedDrugs(uniqueValues) {
  console.log('\n💊 Test Suite 5: GET /form-cleaning/affected-drugs');
  console.log('───────────────────────────────────────────────────');
  
  if (!uniqueValues || uniqueValues.length === 0) {
    log('No unique values to test with', 'warning');
    return;
  }
  
  try {
    const testFormRaw = uniqueValues[0].formRaw;
    const response = await axios.get(`${API_BASE}/affected-drugs`, {
      params: { formRaw: testFormRaw, limit: 10 }
    });
    
    assertEquals(response.status, 200, 'Response status is 200');
    assertTrue(response.data.success, 'Response success is true');
    assertNotNull(response.data.data, 'Response has data array');
    assertTrue(Array.isArray(response.data.data), 'Data is an array');
    assertNotNull(response.data.count, 'Response has count');
    assertEquals(response.data.formRaw, testFormRaw, 'Response echoes formRaw');
    
    console.log(`\n  Drugs with FormRaw "${testFormRaw}": ${response.data.count} total`);
    console.log(`  Showing ${response.data.data.length} sample drugs:`);
    
    response.data.data.slice(0, 3).forEach((drug, i) => {
      console.log(`    ${i + 1}. ${drug.DrugName || 'N/A'}`);
      console.log(`       DrugID: ${drug.DrugID}`);
      console.log(`       Form: ${drug.Form || 'N/A'}`);
      console.log(`       FormRaw: ${drug.FormRaw || 'N/A'}`);
      console.log(`       NotMarketed: ${drug.NotMarketed}`);
    });
    
  } catch (error) {
    log(`API call failed: ${error.message}`, 'error');
    testsFailed++;
    throw error;
  }
}

async function testPreviewMappings(uniqueValues) {
  console.log('\n👁 Test Suite 6: POST /form-cleaning/preview');
  console.log('──────────────────────────────────────────────');
  
  if (!uniqueValues || uniqueValues.length === 0) {
    log('No unique values to test with', 'warning');
    return;
  }
  
  try {
    const testMappings = uniqueValues.slice(0, 2).map(v => ({
      formRaw: v.formRaw,
      newForm: 'Test Form Value'
    }));
    
    const response = await axios.post(`${API_BASE}/preview`, {
      mappings: testMappings
    });
    
    assertEquals(response.status, 200, 'Response status is 200');
    assertTrue(response.data.success, 'Response success is true');
    assertNotNull(response.data.preview, 'Response has preview object');
    assertNotNull(response.data.preview.totalMappings, 'Preview has totalMappings');
    assertNotNull(response.data.preview.totalAffectedDrugs, 'Preview has totalAffectedDrugs');
    assertNotNull(response.data.preview.mappingDetails, 'Preview has mappingDetails');
    
    assertEquals(
      response.data.preview.totalMappings,
      testMappings.length,
      'Total mappings matches input'
    );
    
    console.log(`\n  Preview Results:`);
    console.log(`    Total Mappings: ${response.data.preview.totalMappings}`);
    console.log(`    Total Affected Drugs: ${response.data.preview.totalAffectedDrugs}`);
    console.log('\n  Mapping Details:');
    
    response.data.preview.mappingDetails.forEach((detail, i) => {
      console.log(`    ${i + 1}. "${detail.formRaw}" → "${detail.newForm}"`);
      console.log(`       Affected: ${detail.affectedCount} drugs`);
      console.log(`       Sample drugs: ${detail.sampleDrugs.length}`);
    });
    
    return response.data.preview;
  } catch (error) {
    log(`API call failed: ${error.message}`, 'error');
    testsFailed++;
    throw error;
  }
}

async function testCreateSession() {
  console.log('\n🆔 Test Suite 7: POST /form-cleaning/session');
  console.log('──────────────────────────────────────────────');
  
  try {
    const response = await axios.post(`${API_BASE}/session`, {
      metadata: {
        description: 'API test session',
        user: 'Test User'
      }
    });
    
    assertEquals(response.status, 200, 'Response status is 200');
    assertTrue(response.data.success, 'Response success is true');
    assertNotNull(response.data.session, 'Response has session object');
    assertNotNull(response.data.session.sessionId, 'Session has sessionId');
    
    testSession = response.data.session;
    
    assertTrue(
      testSession.sessionId.startsWith('form_cleaning_'),
      'Session ID has correct prefix'
    );
    assertEquals(testSession.type, 'form', 'Session type is "form"');
    assertEquals(testSession.status, 'initialized', 'Session status is "initialized"');
    
    console.log(`\n  Created Session:`);
    console.log(`    Session ID: ${testSession.sessionId}`);
    console.log(`    Type: ${testSession.type}`);
    console.log(`    Status: ${testSession.status}`);
    console.log(`    Created: ${testSession.createdAt}`);
    console.log(`    Expires: ${testSession.expiresAt}`);
    
    return testSession;
  } catch (error) {
    log(`API call failed: ${error.message}`, 'error');
    testsFailed++;
    throw error;
  }
}

async function testGetSession() {
  console.log('\n🔍 Test Suite 8: GET /form-cleaning/session/:sessionId');
  console.log('──────────────────────────────────────────────────────');
  
  if (!testSession) {
    log('No session to test with', 'warning');
    return;
  }
  
  try {
    const response = await axios.get(`${API_BASE}/session/${testSession.sessionId}`);
    
    assertEquals(response.status, 200, 'Response status is 200');
    assertTrue(response.data.success, 'Response success is true');
    assertNotNull(response.data.session, 'Response has session object');
    assertEquals(
      response.data.session.sessionId,
      testSession.sessionId,
      'Session ID matches'
    );
    
    console.log(`\n  Retrieved Session:`);
    console.log(`    Session ID: ${response.data.session.sessionId}`);
    console.log(`    Status: ${response.data.session.status}`);
    console.log(`    Affected Count: ${response.data.session.affectedCount}`);
    
  } catch (error) {
    log(`API call failed: ${error.message}`, 'error');
    testsFailed++;
    throw error;
  }
}

async function testApplyMappings(uniqueValues) {
  console.log('\n⚠️  Test Suite 9: POST /form-cleaning/apply (SKIPPED)');
  console.log('───────────────────────────────────────────────────────');
  console.log('  Skipping actual apply to avoid modifying database');
  console.log('  To test apply, uncomment code in test-form-cleaning-api.js');
  
  /*
  // UNCOMMENT TO TEST ACTUAL APPLY (WARNING: MODIFIES DATABASE)
  if (!testSession || !uniqueValues || uniqueValues.length === 0) {
    log('Missing session or unique values', 'warning');
    return;
  }
  
  try {
    const testMapping = [{
      formRaw: uniqueValues[0].formRaw,
      newForm: 'TEST_FORM_VALUE_12345'
    }];
    
    const response = await axios.post(`${API_BASE}/apply`, {
      sessionId: testSession.sessionId,
      mappings: testMapping
    });
    
    assertEquals(response.status, 200, 'Response status is 200');
    assertTrue(response.data.success, 'Response success is true');
    assertNotNull(response.data.results, 'Response has results object');
    assertNotNull(response.data.results.totalUpdated, 'Results has totalUpdated');
    
    console.log(`\n  Applied Changes:`);
    console.log(`    Total Updated: ${response.data.results.totalUpdated}`);
    
    response.data.results.mappingResults.forEach((result, i) => {
      console.log(`    ${i + 1}. "${result.formRaw}" → "${result.newForm}"`);
      console.log(`       Updated: ${result.updatedCount} drugs`);
      console.log(`       Success: ${result.success}`);
    });
    
    return response.data.results;
  } catch (error) {
    log(`API call failed: ${error.message}`, 'error');
    testsFailed++;
    throw error;
  }
  */
}

async function testRollback() {
  console.log('\n⏮️  Test Suite 10: POST /form-cleaning/rollback (SKIPPED)');
  console.log('────────────────────────────────────────────────────────');
  console.log('  Skipping rollback test (no changes were applied)');
  
  /*
  // UNCOMMENT TO TEST ROLLBACK (AFTER TESTING APPLY)
  if (!testSession) {
    log('No session to rollback', 'warning');
    return;
  }
  
  try {
    const response = await axios.post(`${API_BASE}/rollback`, {
      sessionId: testSession.sessionId
    });
    
    assertEquals(response.status, 200, 'Response status is 200');
    assertTrue(response.data.success, 'Response success is true');
    assertNotNull(response.data.result, 'Response has result object');
    assertTrue(response.data.result.success, 'Rollback was successful');
    
    console.log(`\n  Rollback Results:`);
    console.log(`    Restored: ${response.data.result.restoredCount} drugs`);
    console.log(`    Backup File: ${response.data.result.backupFile}`);
    
  } catch (error) {
    log(`API call failed: ${error.message}`, 'error');
    testsFailed++;
    throw error;
  }
  */
}

async function testDeleteSession() {
  console.log('\n🗑️  Test Suite 11: DELETE /form-cleaning/session/:sessionId');
  console.log('──────────────────────────────────────────────────────────');
  
  if (!testSession) {
    log('No session to delete', 'warning');
    return;
  }
  
  try {
    const response = await axios.delete(`${API_BASE}/session/${testSession.sessionId}`);
    
    assertEquals(response.status, 200, 'Response status is 200');
    assertTrue(response.data.success, 'Response success is true');
    
    console.log(`\n  Deleted Session: ${testSession.sessionId}`);
    
  } catch (error) {
    log(`API call failed: ${error.message}`, 'error');
    testsFailed++;
    throw error;
  }
}

async function testErrorHandling() {
  console.log('\n❌ Test Suite 12: Error Handling');
  console.log('──────────────────────────────────');
  
  // Test invalid session ID
  try {
    await axios.get(`${API_BASE}/session/invalid_session_id`);
    log('Should have thrown error for invalid session', 'error');
    testsFailed++;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      log('Invalid session returns 404', 'success');
      testsPassed++;
    } else {
      log('Invalid session error type incorrect', 'error');
      testsFailed++;
    }
  }
  
  // Test invalid request body
  try {
    await axios.post(`${API_BASE}/preview`, {});
    log('Should have thrown error for missing mappings', 'error');
    testsFailed++;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      log('Missing mappings returns 400', 'success');
      testsPassed++;
    } else {
      log('Missing mappings error type incorrect', 'error');
      testsFailed++;
    }
  }
}

// Main test runner
async function runTests() {
  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║  Form Cleaning API Integration Tests     ║');
  console.log('╚═══════════════════════════════════════════╝\n');
  console.log('Testing API Base: ' + API_BASE);
  console.log('Server should be running on http://localhost:8066\n');
  
  try {
    // Run all test suites
    await testGetStats();
    const uniqueValues = await testGetUniqueValues();
    await testGetUniqueValuesWithParams();
    await testSuggestMatches(uniqueValues);
    await testGetAffectedDrugs(uniqueValues);
    await testPreviewMappings(uniqueValues);
    await testCreateSession();
    await testGetSession();
    await testApplyMappings(uniqueValues);
    await testRollback();
    await testDeleteSession();
    await testErrorHandling();
    
    // Print summary
    console.log('\n╔═══════════════════════════════════════════╗');
    console.log('║           Test Results Summary            ║');
    console.log('╚═══════════════════════════════════════════╝');
    console.log(`✓ Tests Passed: ${testsPassed}`);
    console.log(`✗ Tests Failed: ${testsFailed}`);
    console.log(`Total Tests: ${testsPassed + testsFailed}`);
    
    if (testsFailed === 0) {
      console.log('\n🎉 All tests passed!\n');
      process.exit(0);
    } else {
      console.log(`\n❌ ${testsFailed} test(s) failed.\n`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Test suite failed with error:');
    console.error(error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Check if server is running before starting tests
axios.get(`${API_BASE}/stats`)
  .then(() => {
    log('Server is running, starting tests...', 'info');
    runTests();
  })
  .catch((error) => {
    console.error('\n❌ Cannot connect to server!');
    console.error('Please ensure the server is running on http://localhost:8066');
    console.error(`Error: ${error.message}\n`);
    process.exit(1);
  });
