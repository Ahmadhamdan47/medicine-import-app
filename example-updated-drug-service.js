// Example usage of the updated DrugUpdateService with header mapping
const DrugUpdateService = require('../src/services/drugUpdateService');
const path = require('path');

async function demonstrateUpdatedService() {
    const drugService = new DrugUpdateService();
    
    try {
        console.log('=== Drug Update Service - Enhanced Version ===\n');
        
        // Show available header mappings
        console.log('1. Available Header Mappings:');
        const mappingInfo = drugService.getHeaderMappingInfo();
        console.log(JSON.stringify(mappingInfo, null, 2));
        console.log('\n');
        
        // Example CSV file path (adjust as needed)
        const csvFilePath = './example-drug-data.csv';
        
        // Validate headers (if CSV file exists)
        try {
            console.log('2. Validating CSV Headers:');
            const headerValidation = await drugService.validateCsvHeaders(csvFilePath);
            console.log('Original Headers:', headerValidation.originalHeaders);
            console.log('Mapped Headers:', headerValidation.mappedHeaders);
            console.log('Unmapped Headers:', headerValidation.unmappedHeaders);
            console.log('Has Required MoPHCode Column:', headerValidation.hasRequiredColumn);
            console.log('\n');
        } catch (error) {
            console.log('CSV file not found or error validating headers:', error.message);
            console.log('This is normal if you don\'t have a test CSV file yet.\n');
        }
        
        // Example of how to use the service
        console.log('3. Example Usage Workflow:');
        console.log(`
// Initialize session
const session = await drugService.initializeSession();
console.log('Session:', session);

// Create backup
const backup = await drugService.createBackup();
console.log('Backup created:', backup);

// Parse CSV with header mapping and currency conversion
const csvData = await drugService.parseCsvFile('path/to/your/file.csv', '\\t');
console.log('Parsed CSV data with normalized headers');

// Preview changes
const preview = await drugService.previewChanges(csvData);
console.log('Preview:', preview.summary);
console.log('Skipped columns (not in DB):', preview.summary.skippedColumns);

// Create working copy
await drugService.createWorkingCopy();

// Apply changes
const result = await drugService.applyChangesToWorkingTable(csvData);
console.log('Applied changes:', result);
console.log('Skipped columns:', result.skippedColumns);

// Preview final changes
const finalChanges = await drugService.getFinalChanges();
console.log('Final changes to be committed:', finalChanges.length);

// Commit or rollback
if (confirm('Commit changes?')) {
    await drugService.commitChanges();
    console.log('Changes committed successfully');
} else {
    await drugService.rollbackChanges();
    console.log('Changes rolled back');
}

// Cleanup
await drugService.cleanupSession();
        `);
        
        console.log('\n4. Key Enhancements:');
        console.log('✓ Header mapping: CSV headers automatically mapped to database columns');
        console.log('✓ Currency conversion: "Public Price LL" automatically converted from LBP to USD');
        console.log('✓ Optional columns: Missing columns are gracefully handled');
        console.log('✓ Validation: Detailed feedback on which columns exist/don\'t exist');
        console.log('✓ Flexible parsing: Handles both mapped and direct column names');
        
    } catch (error) {
        console.error('Error demonstrating service:', error.message);
    }
}

// Create a sample CSV content for testing
function createSampleCSV() {
    const sampleCSVContent = `Code	Registration number	Brand name	Strength	Presentation	Form	Agent	Manufacturer	Country	Public Price LL	Pharmacist Margin	Stratum	public price Decision 119/1 20230126	Responsible Party Name	Responsible Party Country	Exch_Dates
12345	REG001	Sample Drug	10mg	Box of 20 tablets	Tablet	Sample Agent	Sample Pharma	Lebanon	1790000	15%	A	Yes	Sample Company	Lebanon	2024-01-01
67890	REG002	Another Med	5mg	Bottle of 100ml	Syrup	Test Agent	Test Pharma	France	895000	12%	B	No	Test Corp	France	2024-01-15`;

    return sampleCSVContent;
}

if (require.main === module) {
    demonstrateUpdatedService();
    
    // Optionally create a sample CSV file
    console.log('\n=== Sample CSV Content ===');
    console.log('You can save this to a file for testing:');
    console.log(createSampleCSV());
}

module.exports = { demonstrateUpdatedService, createSampleCSV };