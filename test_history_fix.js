// Test the fixed change history
const sequelize = require('./config/databasePharmacy');
const DrugChangeRequestService = require('./src/services/drugChangeRequestService');

async function testHistoryFix() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected\n');

    // Test with DrugID 12740 (the one from your example)
    const drugId = 12740;
    
    console.log(`Fetching change history for Drug ID: ${drugId}\n`);
    const history = await DrugChangeRequestService.getChangeHistory(drugId, 10);

    console.log(`Found ${history.length} valid history records (numeric field names filtered out)\n`);

    history.forEach((record, index) => {
      console.log(`Record ${index + 1}:`);
      console.log(`  Drug: ${record.drug?.DrugName} (${record.drug?.MoPHCode})`);
      console.log(`  Field: ${record.FieldName}`);
      console.log(`  Old Value: ${record.OldValue}`);
      console.log(`  New Value: ${record.NewValue}`);
      console.log(`  Changed by: ${record.changer?.Username} (${record.ChangedByRole})`);
      console.log(`  Approved by: ${record.approver?.Username || 'N/A'}`);
      console.log(`  Timestamp: ${record.ChangeTimestamp}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testHistoryFix();
