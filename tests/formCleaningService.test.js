/**
 * Integration Tests for Form Cleaning Service
 * 
 * Tests the formCleaningService module with database interactions.
 * REQUIRES: Database connection and test data
 * 
 * Run with: node tests/formCleaningService.test.js
 */

const formCleaningService = require('../src/services/formCleaningService');
const sessionService = require('../src/services/cleaningSessionService');

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

function assertNotNull(value, testName) {
  if (value !== null && value !== undefined) {
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

async function runTests() {
  console.log('===========================================');
  console.log('Form Cleaning Service Integration Tests');
  console.log('===========================================\n');

  try {
    // ========================================
    // Test Suite 1: Get Statistics
    // ========================================
    console.log('Test Suite 1: Get Form Cleaning Statistics');
    console.log('-------------------------------------------');

    const stats = await formCleaningService.getFormStats();
    
    assertNotNull(stats, 'getFormStats returns result');
    assertNotNull(stats.totalDrugs, 'Stats include totalDrugs');
    assertNotNull(stats.drugsWithForm, 'Stats include drugsWithForm');
    assertNotNull(stats.drugsWithFormRaw, 'Stats include drugsWithFormRaw');
    assertNotNull(stats.drugsWithoutForm, 'Stats include drugsWithoutForm');
    assertNotNull(stats.uniqueFormRaws, 'Stats include uniqueFormRaws');
    assertNotNull(stats.cleanPercentage, 'Stats include cleanPercentage');
    
    assertTrue(
      stats.totalDrugs >= 0,
      'Total drugs is non-negative'
    );
    
    assertTrue(
      stats.drugsWithForm >= 0,
      'Drugs with form is non-negative'
    );
    
    assertTrue(
      stats.drugsWithoutForm >= 0,
      'Drugs without form is non-negative'
    );
    
    assertTrue(
      stats.totalDrugs === stats.drugsWithForm + stats.drugsWithoutForm,
      'Total drugs equals sum of with and without form'
    );
    
    assertTrue(
      parseFloat(stats.cleanPercentage) >= 0 && parseFloat(stats.cleanPercentage) <= 100,
      'Clean percentage is between 0 and 100'
    );
    
    console.log(`  📊 Database Stats:`);
    console.log(`     Total Drugs: ${stats.totalDrugs}`);
    console.log(`     With Forms: ${stats.drugsWithForm} (${stats.cleanPercentage}%)`);
    console.log(`     Without Forms: ${stats.drugsWithoutForm}`);
    console.log(`     Unique FormRaw Values: ${stats.uniqueFormRaws}`);
    console.log('');

    // ========================================
    // Test Suite 2: Get Unique FormRaw Values
    // ========================================
    console.log('Test Suite 2: Get Unique FormRaw Values');
    console.log('-------------------------------------------');

    const uniqueValues = await formCleaningService.getUniqueFormRaw();
    
    assertNotNull(uniqueValues, 'getUniqueFormRaw returns result');
    assertTrue(Array.isArray(uniqueValues), 'Result is an array');
    
    if (uniqueValues.length > 0) {
      const firstValue = uniqueValues[0];
      assertNotNull(firstValue.formRaw, 'First value has formRaw');
      assertNotNull(firstValue.drugCount, 'First value has drugCount');
      
      assertTrue(
        firstValue.drugCount > 0,
        'Drug count is positive'
      );
      
      console.log(`  📋 Found ${uniqueValues.length} unique FormRaw values`);
      console.log(`  📌 Top 5 FormRaw values:`);
      uniqueValues.slice(0, 5).forEach((v, i) => {
        console.log(`     ${i + 1}. "${v.formRaw}" (${v.drugCount} drugs) → Sample: ${v.sampleForm || 'N/A'}`);
      });
    } else {
      console.log(`  ⚠ No FormRaw values found in database`);
    }
    console.log('');

    // ========================================
    // Test Suite 3: Get Unique Values with Options
    // ========================================
    console.log('Test Suite 3: Get Unique FormRaw with Filters');
    console.log('-------------------------------------------');

    const valuesWithMinCount = await formCleaningService.getUniqueFormRaw({ minCount: 10 });
    assertTrue(
      valuesWithMinCount.every(v => v.drugCount >= 10),
      'All values have drugCount >= 10 when minCount=10'
    );
    console.log(`  ✓ Found ${valuesWithMinCount.length} FormRaw values with count >= 10`);

    const valuesIncludingNull = await formCleaningService.getUniqueFormRaw({ includeNull: true });
    assertTrue(
      valuesIncludingNull.length >= uniqueValues.length,
      'Including null returns same or more results'
    );
    console.log(`  ✓ Found ${valuesIncludingNull.length} FormRaw values (including null)`);
    console.log('');

    // ========================================
    // Test Suite 4: Suggest Form Matches
    // ========================================
    console.log('Test Suite 4: Suggest Form Matches');
    console.log('-------------------------------------------');

    if (uniqueValues.length > 0) {
      const testFormRaw = uniqueValues[0].formRaw;
      const suggestions = await formCleaningService.suggestFormMatch(testFormRaw);
      
      assertNotNull(suggestions, 'suggestFormMatch returns result');
      assertTrue(Array.isArray(suggestions), 'Suggestions is an array');
      
      console.log(`  🔍 Testing suggestions for FormRaw: "${testFormRaw}"`);
      console.log(`  📋 Found ${suggestions.length} suggestions`);
      
      if (suggestions.length > 0) {
        const topSuggestion = suggestions[0];
        assertNotNull(topSuggestion.dosageFormClean, 'Suggestion has dosageFormClean');
        assertNotNull(topSuggestion.confidence, 'Suggestion has confidence score');
        assertNotNull(topSuggestion.matchType, 'Suggestion has matchType');
        
        assertTrue(
          topSuggestion.confidence >= 0 && topSuggestion.confidence <= 100,
          'Confidence score is between 0 and 100'
        );
        
        console.log(`  🎯 Top suggestion: "${topSuggestion.dosageFormClean}"`);
        console.log(`     Confidence: ${topSuggestion.confidence}%`);
        console.log(`     Match Type: ${topSuggestion.matchType}`);
        console.log(`     Physical State: ${topSuggestion.physicalState || 'N/A'}`);
        
        // Test with limit
        const limitedSuggestions = await formCleaningService.suggestFormMatch(testFormRaw, 3);
        assertTrue(
          limitedSuggestions.length <= 3,
          'Limit parameter restricts results'
        );
        console.log(`  ✓ Limited suggestions (max 3): ${limitedSuggestions.length} returned`);
      }
    } else {
      console.log(`  ⚠ No FormRaw values to test suggestions with`);
    }
    console.log('');

    // ========================================
    // Test Suite 5: Get Drugs by FormRaw
    // ========================================
    console.log('Test Suite 5: Get Drugs by FormRaw');
    console.log('-------------------------------------------');

    if (uniqueValues.length > 0) {
      const testFormRaw = uniqueValues[0].formRaw;
      const drugs = await formCleaningService.getDrugsByFormRaw(testFormRaw);
      
      assertNotNull(drugs, 'getDrugsByFormRaw returns result');
      assertTrue(Array.isArray(drugs), 'Result is an array');
      
      console.log(`  🔍 Testing drugs with FormRaw: "${testFormRaw}"`);
      console.log(`  📋 Found ${drugs.length} drugs`);
      
      if (drugs.length > 0) {
        const firstDrug = drugs[0];
        assertNotNull(firstDrug.DrugID, 'Drug has DrugID');
        assertEquals(firstDrug.FormRaw, testFormRaw, 'Drug has matching FormRaw');
        assertEquals(firstDrug.NotMarketed, false, 'Drug is marketed (NotMarketed=false)');
        
        console.log(`  📌 Sample drug: ${firstDrug.DrugName || 'N/A'}`);
        console.log(`     DrugID: ${firstDrug.DrugID}`);
        console.log(`     Form: ${firstDrug.Form || 'N/A'}`);
        console.log(`     FormRaw: ${firstDrug.FormRaw || 'N/A'}`);
        
        // Test with limit
        const limitedDrugs = await formCleaningService.getDrugsByFormRaw(testFormRaw, 5);
        assertTrue(
          limitedDrugs.length <= 5,
          'Limit parameter restricts results'
        );
        console.log(`  ✓ Limited drugs (max 5): ${limitedDrugs.length} returned`);
      }
    } else {
      console.log(`  ⚠ No FormRaw values to test with`);
    }
    console.log('');

    // ========================================
    // Test Suite 6: Preview Form Mappings
    // ========================================
    console.log('Test Suite 6: Preview Form Mappings');
    console.log('-------------------------------------------');

    if (uniqueValues.length > 0) {
      const testMappings = uniqueValues.slice(0, 2).map(v => ({
        formRaw: v.formRaw,
        newForm: 'Test Form Value'
      }));
      
      const preview = await formCleaningService.previewFormMappings(testMappings);
      
      assertNotNull(preview, 'previewFormMappings returns result');
      assertNotNull(preview.totalMappings, 'Preview has totalMappings');
      assertNotNull(preview.totalAffectedDrugs, 'Preview has totalAffectedDrugs');
      assertNotNull(preview.mappingDetails, 'Preview has mappingDetails');
      assertTrue(Array.isArray(preview.mappingDetails), 'mappingDetails is an array');
      
      assertEquals(
        preview.totalMappings,
        testMappings.length,
        'Total mappings matches input'
      );
      
      assertEquals(
        preview.mappingDetails.length,
        testMappings.length,
        'mappingDetails length matches input'
      );
      
      console.log(`  📋 Preview for ${testMappings.length} mappings:`);
      console.log(`     Total affected drugs: ${preview.totalAffectedDrugs}`);
      
      preview.mappingDetails.forEach((detail, i) => {
        console.log(`     ${i + 1}. "${detail.formRaw}" → "${detail.newForm}": ${detail.affectedCount} drugs`);
        
        assertEquals(
          detail.formRaw,
          testMappings[i].formRaw,
          `Mapping ${i + 1} has correct formRaw`
        );
        
        assertEquals(
          detail.newForm,
          testMappings[i].newForm,
          `Mapping ${i + 1} has correct newForm`
        );
        
        assertTrue(
          detail.affectedCount > 0,
          `Mapping ${i + 1} affects drugs`
        );
        
        assertTrue(
          Array.isArray(detail.sampleDrugs),
          `Mapping ${i + 1} has sampleDrugs array`
        );
      });
    } else {
      console.log(`  ⚠ No FormRaw values to test preview with`);
    }
    console.log('');

    // ========================================
    // Test Suite 7: Session Integration
    // ========================================
    console.log('Test Suite 7: Session Integration');
    console.log('-------------------------------------------');

    const session = sessionService.createSession('form', 1, { 
      description: 'Test form cleaning session' 
    });
    
    assertNotNull(session, 'Session created successfully');
    assertTrue(
      session.sessionId.startsWith('form_cleaning_'),
      'Session ID has correct prefix'
    );
    assertEquals(session.type, 'form', 'Session type is "form"');
    assertEquals(session.status, 'initialized', 'Session status is "initialized"');
    
    console.log(`  ✓ Created test session: ${session.sessionId}`);
    console.log(`     Type: ${session.type}`);
    console.log(`     Status: ${session.status}`);
    console.log('');

    // ========================================
    // Test Suite 8: Apply Form Mappings (DRY RUN)
    // ========================================
    console.log('Test Suite 8: Apply Form Mappings (DRY RUN)');
    console.log('-------------------------------------------');
    console.log('  ⚠ Skipping actual apply to avoid modifying database');
    console.log('  ℹ To test apply, uncomment the code in formCleaningService.test.js');
    console.log('');
    
    /*
    // UNCOMMENT TO TEST ACTUAL APPLY (WARNING: MODIFIES DATABASE)
    if (uniqueValues.length > 0) {
      const testFormRaw = uniqueValues[0].formRaw;
      const testMapping = [
        { formRaw: testFormRaw, newForm: 'TEST_FORM_VALUE_12345' }
      ];
      
      console.log(`  🧪 Testing apply for: "${testFormRaw}" → "TEST_FORM_VALUE_12345"`);
      
      const applyResult = await formCleaningService.applyFormMappings(
        session.sessionId,
        testMapping
      );
      
      assertNotNull(applyResult, 'applyFormMappings returns result');
      assertNotNull(applyResult.totalUpdated, 'Result has totalUpdated');
      assertTrue(Array.isArray(applyResult.mappingResults), 'Result has mappingResults array');
      
      console.log(`  ✓ Applied changes: ${applyResult.totalUpdated} drugs updated`);
      
      // Test rollback
      console.log(`  🔄 Testing rollback...`);
      const rollbackResult = await formCleaningService.rollbackFormChanges(session.sessionId);
      
      assertNotNull(rollbackResult, 'rollbackFormChanges returns result');
      assertTrue(rollbackResult.success, 'Rollback was successful');
      assertNotNull(rollbackResult.restoredCount, 'Rollback has restoredCount');
      
      console.log(`  ✓ Rolled back: ${rollbackResult.restoredCount} drugs restored`);
    }
    */

    // ========================================
    // Test Suite 9: Edge Cases
    // ========================================
    console.log('Test Suite 9: Edge Cases');
    console.log('-------------------------------------------');

    // Empty mappings
    try {
      const emptyPreview = await formCleaningService.previewFormMappings([]);
      assertEquals(emptyPreview.totalMappings, 0, 'Empty mappings preview has 0 total');
      assertEquals(emptyPreview.totalAffectedDrugs, 0, 'Empty mappings affect 0 drugs');
      console.log(`  ✓ Empty mappings handled correctly`);
    } catch (error) {
      console.log(`  ✗ Empty mappings threw error: ${error.message}`);
      testsFailed++;
    }

    // Non-existent FormRaw
    try {
      const nonExistentDrugs = await formCleaningService.getDrugsByFormRaw('__NON_EXISTENT_FORM__');
      assertTrue(Array.isArray(nonExistentDrugs), 'Non-existent FormRaw returns array');
      assertEquals(nonExistentDrugs.length, 0, 'Non-existent FormRaw returns empty array');
      console.log(`  ✓ Non-existent FormRaw handled correctly`);
    } catch (error) {
      console.log(`  ✗ Non-existent FormRaw threw error: ${error.message}`);
      testsFailed++;
    }

    // Null/undefined FormRaw
    try {
      const nullSuggestions = await formCleaningService.suggestFormMatch(null);
      assertTrue(Array.isArray(nullSuggestions), 'Null FormRaw returns array');
      console.log(`  ✓ Null FormRaw handled correctly`);
    } catch (error) {
      console.log(`  ✗ Null FormRaw threw error: ${error.message}`);
      testsFailed++;
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

  } catch (error) {
    console.error('\n❌ Test suite failed with error:');
    console.error(error);
    process.exit(1);
  }
}

// Run tests
runTests();
