// Utility script to test and demonstrate the enhanced DrugUpdateService features
const DrugUpdateService = require('./src/services/drugUpdateService');
const fs = require('fs').promises;
const path = require('path');

async function testCurrencyConversion() {
    const drugService = new DrugUpdateService();
    
    console.log('=== Currency Conversion Test ===');
    console.log(`Exchange Rate: 1 USD = ${drugService.LBP_TO_USD_RATE} LBP\n`);
    
    const testPrices = [
        { lbp: 1790000, description: 'High price medicine' },
        { lbp: 895000, description: 'Medium price medicine' },
        { lbp: 179000, description: 'Low price medicine' },
        { lbp: 89500, description: 'Very low price (1 USD)' }
    ];
    
    testPrices.forEach(item => {
        const usdPrice = item.lbp / drugService.LBP_TO_USD_RATE;
        console.log(`${item.description}:`);
        console.log(`  LBP: ${item.lbp.toLocaleString()}`);
        console.log(`  USD: $${usdPrice.toFixed(6)}`);
        console.log('');
    });
}

async function testHeaderMapping() {
    const drugService = new DrugUpdateService();
    
    console.log('=== Header Mapping Test ===');
    
    // Simulate CSV headers
    const testHeaders = {
        'Code': 'value1',
        'Registration number': 'value2', 
        'Brand name': 'value3',
        'Strength': 'value4',
        'Public Price LL': '1790000',
        'Unknown Column': 'value6',
        'MoPHCode': 'direct_value' // Direct database column
    };
    
    console.log('Original CSV headers:');
    Object.keys(testHeaders).forEach(header => {
        console.log(`  "${header}"`);
    });
    
    const normalized = drugService.normalizeHeaders(testHeaders);
    
    console.log('\nNormalized headers:');
    Object.keys(normalized).forEach(header => {
        console.log(`  "${header}"`);
    });
    
    console.log('\nMapping details:');
    Object.keys(testHeaders).forEach(originalHeader => {
        const mapped = drugService.headerMapping[originalHeader];
        if (mapped) {
            console.log(`  "${originalHeader}" → "${mapped}"`);
        } else {
            console.log(`  "${originalHeader}" → (no mapping, kept as-is)`);
        }
    });
}

async function createTestCSV() {
    const testCSVContent = `Code	Registration number	Brand name	Strength	Presentation	Form	Agent	Manufacturer	Country	Public Price LL	Pharmacist Margin	Stratum
12345	REG/2024/001	Paracetamol Tablets	500mg	Box of 20 tablets	Tablet	Local Pharma	PharmaCorp Lebanon	Lebanon	179000	15%	A
23456	REG/2024/002	Amoxicillin Capsules	250mg	Box of 12 capsules	Capsule	Import Agent	Euro Pharma	Germany	895000	12%	B
34567	REG/2024/003	Insulin Pen	100 units/ml	1 pen	Injectable	Diabetes Care	Novo Nordisk	Denmark	3580000	10%	C
45678	REG/2024/004	Cough Syrup	100ml	1 bottle	Syrup	Cough Relief Co	Local Meds	Lebanon	268500	18%	A`;

    const fileName = 'test-drug-import.csv';
    await fs.writeFile(fileName, testCSVContent);
    console.log(`\nTest CSV file created: ${fileName}`);
    console.log('Content preview:');
    console.log(testCSVContent.split('\n')[0]); // Header row
    console.log('...(3 more data rows)');
    
    return fileName;
}

async function validateTestFile(fileName) {
    const drugService = new DrugUpdateService();
    
    try {
        console.log(`\n=== Validating ${fileName} ===`);
        const validation = await drugService.validateCsvHeaders(fileName, '\t');
        
        console.log('✓ File validation results:');
        console.log(`  Original headers found: ${validation.originalHeaders.length}`);
        console.log(`  Mapped headers: ${Object.keys(validation.mappedHeaders).length}`);
        console.log(`  Unmapped headers: ${validation.unmappedHeaders.length}`);
        console.log(`  Has required MoPHCode: ${validation.hasRequiredColumn}`);
        
        if (validation.unmappedHeaders.length > 0) {
            console.log('  Unmapped headers:', validation.unmappedHeaders);
        }
        
        console.log('\n✓ Header mapping results:');
        Object.keys(validation.mappedHeaders).forEach(original => {
            const mapped = validation.mappedHeaders[original];
            console.log(`    "${original}" → "${mapped}"`);
        });
        
    } catch (error) {
        console.error('✗ Validation failed:', error.message);
    }
}

async function parseTestFile(fileName) {
    const drugService = new DrugUpdateService();
    
    try {
        console.log(`\n=== Parsing ${fileName} ===`);
        const data = await drugService.parseCsvFile(fileName, '\t');
        
        console.log(`✓ Successfully parsed ${data.length} rows`);
        console.log('✓ Sample parsed data (first row):');
        
        if (data.length > 0) {
            const firstRow = data[0];
            Object.keys(firstRow).forEach(column => {
                const value = firstRow[column];
                if (column === 'PublicPrice' && value !== null) {
                    console.log(`    ${column}: ${value} (converted from LBP to USD)`);
                } else {
                    console.log(`    ${column}: ${value}`);
                }
            });
        }
        
    } catch (error) {
        console.error('✗ Parsing failed:', error.message);
    }
}

async function runAllTests() {
    console.log('🧪 Drug Update Service - Enhanced Features Test\n');
    
    // Test currency conversion
    await testCurrencyConversion();
    
    // Test header mapping
    await testHeaderMapping();
    
    // Create and test with actual CSV file
    const testFileName = await createTestCSV();
    await validateTestFile(testFileName);
    await parseTestFile(testFileName);
    
    console.log('\n✅ All tests completed!');
    console.log('\nNext steps:');
    console.log('1. Use the test CSV file to test the full import workflow');
    console.log('2. Replace with your actual drug data CSV');
    console.log('3. Run the import using the enhanced DrugUpdateService');
}

if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    testCurrencyConversion,
    testHeaderMapping,
    createTestCSV,
    validateTestFile,
    parseTestFile,
    runAllTests
};