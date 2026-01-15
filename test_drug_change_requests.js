// Test file for Drug Change Request System
// Run with: node test_drug_change_requests.js

const sequelize = require('./config/databasePharmacy');
const DrugChangeRequestService = require('./src/services/drugChangeRequestService');
const Drug = require('./src/models/pharmacyDrug');
const UserAccounts = require('./src/models/userAccounts');
const Role = require('./src/models/roles');
const DrugChangeRequest = require('./src/models/drugChangeRequest');
const DrugChangeHistory = require('./src/models/drugChangeHistory');

// Test data
let testDrugId;
let testAdminUserId;
let testDataEntryUserId;
let testChangeRequestId;

async function setup() {
  console.log('\n═══════════════════════════════════════════');
  console.log('🧪 Drug Change Request System - Test Suite');
  console.log('═══════════════════════════════════════════\n');

  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Find existing roles (they should already exist)
    const adminRole = await Role.findOne({
      where: { RoleName: 'Admin' }
    });

    const dataEntryRole = await Role.findOne({
      where: { RoleName: 'data-entry' }
    });

    if (!adminRole || !dataEntryRole) {
      throw new Error('Required roles not found. Please run setup script first.');
    }

    console.log('✓ Roles verified (Admin, data-entry)');

    // Create test users
    const adminUser = await UserAccounts.findOne({
      where: { RoleId: adminRole.RoleId, Username: 'test_admin_user' }
    }) || await UserAccounts.create({
      Username: 'test_admin_user',
      Email: 'admin@test.com',
      PasswordHash: 'test_hash',
      RoleId: adminRole.RoleId,
      IsActive: true
    });

    const dataEntryUser = await UserAccounts.findOne({
      where: { RoleId: dataEntryRole.RoleId, Username: 'test_dataentry_user' }
    }) || await UserAccounts.create({
      Username: 'test_dataentry_user',
      Email: 'dataentry@test.com',
      PasswordHash: 'test_hash',
      RoleId: dataEntryRole.RoleId,
      IsActive: true
    });

    testAdminUserId = adminUser.UserId;
    testDataEntryUserId = dataEntryUser.UserId;

    console.log(`✓ Test users created (Admin: ${testAdminUserId}, Data-Entry: ${testDataEntryUserId})`);

    // Create or find a test drug
    const testDrug = await Drug.findOne({ where: { DrugName: 'TEST_DRUG_FOR_CHANGE_REQUESTS' } })
      || await Drug.create({
        MoPHCode: '1111111',
        DrugName: 'TEST_DRUG_FOR_CHANGE_REQUESTS',
        DrugNameAR: 'دواء اختبار',
        Price: 10.00,
        Form: 'Tablet',
        Dosage: '500mg',
        Presentation: '30 tablets',
        NotMarketed: false,
        isOTC: false,
        Substitutable: true
      });

    testDrugId = testDrug.DrugID;
    console.log(`✓ Test drug created (DrugID: ${testDrugId})`);
    console.log('\n✓ Setup complete!\n');

    return true;
  } catch (error) {
    console.error('✗ Setup failed:', error.message);
    throw error;
  }
}

async function testCreateChangeRequest() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 1: Create Change Request (Data-Entry User)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const proposedChanges = {
      Price: 15.00,
      DrugName: 'TEST_DRUG_UPDATED_NAME',
      NotMarketed: true
    };

    const changeRequest = await DrugChangeRequestService.createChangeRequest(
      testDataEntryUserId,
      'data-entry',
      testDrugId,
      proposedChanges
    );

    testChangeRequestId = changeRequest.ChangeRequestId;

    console.log('✓ Change request created successfully');
    console.log(`  Request ID: ${changeRequest.ChangeRequestId}`);
    console.log(`  Status: ${changeRequest.Status}`);
    console.log(`  Proposed Changes:`, changeRequest.ChangesJSON);
    console.log(`  Previous Values:`, changeRequest.PreviousValuesJSON);
    
    return true;
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    return false;
  }
}

async function testGetPendingRequests() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 2: Get Pending Change Requests');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const pendingRequests = await DrugChangeRequestService.getPendingRequests();

    console.log(`✓ Found ${pendingRequests.length} pending request(s)`);
    
    if (pendingRequests.length > 0) {
      const request = pendingRequests[0];
      console.log(`  First Request ID: ${request.ChangeRequestId}`);
      console.log(`  Drug: ${request.drug.DrugName}`);
      console.log(`  Requested by: ${request.requester.Username}`);
      console.log(`  Created: ${request.CreatedAt}`);
    }
    
    return true;
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    return false;
  }
}

async function testGetChangeRequestById() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 3: Get Change Request with Before/After Comparison');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const comparison = await DrugChangeRequestService.getChangeRequestById(testChangeRequestId);

    console.log('✓ Change request details retrieved');
    console.log(`  Drug: ${comparison.drugInfo.DrugName}`);
    console.log(`  Status: ${comparison.requestInfo.status}`);
    console.log(`  Requested by: ${comparison.requestInfo.requestedBy.Username}`);
    console.log('\n  Changes:');
    
    comparison.changes.forEach((change, index) => {
      console.log(`    ${index + 1}. Field: ${change.field}`);
      console.log(`       Before: ${change.previousValue}`);
      console.log(`       After:  ${change.proposedValue}`);
    });
    
    return true;
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    return false;
  }
}

async function testApproveChangeRequest() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 4: Approve Change Request (Admin)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const result = await DrugChangeRequestService.approveChangeRequest(
      testChangeRequestId,
      testAdminUserId,
      'Approved after review - changes look good!'
    );

    console.log('✓ Change request approved successfully');
    console.log(`  Request ID: ${result.changeRequestId}`);
    console.log(`  Drug ID: ${result.drugId}`);
    console.log(`  Message: ${result.message}`);

    // Verify the drug was actually updated
    const updatedDrug = await Drug.findByPk(testDrugId);
    console.log('\n  Verified drug updates:');
    console.log(`    Price: ${updatedDrug.Price}`);
    console.log(`    DrugName: ${updatedDrug.DrugName}`);
    console.log(`    NotMarketed: ${updatedDrug.NotMarketed}`);
    
    return true;
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    return false;
  }
}

async function testGetChangeHistory() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 5: Get Change History for Drug');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const history = await DrugChangeRequestService.getChangeHistory(testDrugId);

    console.log(`✓ Found ${history.length} history record(s)`);
    
    history.forEach((record, index) => {
      console.log(`\n  Record ${index + 1}:`);
      console.log(`    Field: ${record.FieldName}`);
      console.log(`    Old Value: ${record.OldValue}`);
      console.log(`    New Value: ${record.NewValue}`);
      console.log(`    Changed by: ${record.changer.Username}`);
      console.log(`    Approved by: ${record.approver ? record.approver.Username : 'N/A'}`);
      console.log(`    Timestamp: ${record.ChangeTimestamp}`);
    });
    
    return true;
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    return false;
  }
}

async function testRejectChangeRequest() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 6: Reject Change Request (Admin)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Create another change request to reject
    const proposedChanges = {
      Price: 5.00,
      Form: 'Capsule'
    };

    const changeRequest = await DrugChangeRequestService.createChangeRequest(
      testDataEntryUserId,
      'data-entry',
      testDrugId,
      proposedChanges
    );

    console.log(`✓ Created new change request ID: ${changeRequest.ChangeRequestId}`);

    // Now reject it
    const result = await DrugChangeRequestService.rejectChangeRequest(
      changeRequest.ChangeRequestId,
      testAdminUserId,
      'Price is too low, please reconsider.'
    );

    console.log('✓ Change request rejected successfully');
    console.log(`  Request ID: ${result.changeRequestId}`);
    console.log(`  Message: ${result.message}`);
    
    return true;
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    return false;
  }
}

async function testDirectAdminEdit() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 7: Direct Admin Edit (No Approval Needed)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const previousDrug = await Drug.findByPk(testDrugId);
    const previousValues = previousDrug.toJSON();

    const directChanges = {
      Dosage: '1000mg',
      Amount: 60
    };

    // Update drug directly
    await previousDrug.update(directChanges);

    // Log the direct change
    await DrugChangeRequestService.logDirectChange(
      testDrugId,
      testAdminUserId,
      'admin',
      directChanges,
      previousValues
    );

    console.log('✓ Direct admin edit logged successfully');
    console.log('  Changes:', directChanges);

    // Check history
    const history = await DrugChangeRequestService.getChangeHistory(testDrugId, 5);
    const adminDirectEdits = history.filter(h => h.ChangeRequestId === null);
    
    console.log(`✓ Found ${adminDirectEdits.length} direct admin edit(s) in history`);
    
    return true;
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    return false;
  }
}

async function testGetStatistics() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 8: Get Change Request Statistics');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const stats = await DrugChangeRequestService.getStatistics();

    console.log('✓ Statistics retrieved successfully');
    console.log(`  Pending: ${stats.pending}`);
    console.log(`  Approved: ${stats.approved}`);
    console.log(`  Rejected: ${stats.rejected}`);
    console.log(`  Total: ${stats.total}`);
    
    return true;
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };

  try {
    await setup();

    const tests = [
      { name: 'Create Change Request', fn: testCreateChangeRequest },
      { name: 'Get Pending Requests', fn: testGetPendingRequests },
      { name: 'Get Change Request Details', fn: testGetChangeRequestById },
      { name: 'Approve Change Request', fn: testApproveChangeRequest },
      { name: 'Get Change History', fn: testGetChangeHistory },
      { name: 'Reject Change Request', fn: testRejectChangeRequest },
      { name: 'Direct Admin Edit', fn: testDirectAdminEdit },
      { name: 'Get Statistics', fn: testGetStatistics }
    ];

    for (const test of tests) {
      results.total++;
      const success = await test.fn();
      if (success) {
        results.passed++;
      } else {
        results.failed++;
      }
    }

    console.log('\n═══════════════════════════════════════════');
    console.log('📊 TEST RESULTS');
    console.log('═══════════════════════════════════════════');
    console.log(`Total Tests: ${results.total}`);
    console.log(`✓ Passed: ${results.passed}`);
    console.log(`✗ Failed: ${results.failed}`);
    console.log('═══════════════════════════════════════════\n');

    if (results.failed === 0) {
      console.log('🎉 All tests passed successfully!\n');
    } else {
      console.log('⚠️  Some tests failed. Please review the errors above.\n');
    }

  } catch (error) {
    console.error('\n✗ Test suite failed:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

// Run tests
runAllTests();
