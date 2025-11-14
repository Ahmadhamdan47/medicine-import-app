# Enhanced Drug Update Service

This document describes the improvements made to the `DrugUpdateService` to handle CSV imports with normalized headers, currency conversion, and graceful handling of optional columns.

## ✨ New Features

### 1. Header Mapping and Normalization

The service now automatically maps CSV headers to database columns:

| CSV Header | Database Column | Description |
|------------|----------------|-------------|
| `Code` | `MoPHCode` | **Required** - Ministry of Public Health Code |
| `Registration number` | `RegistrationNumber` | Drug registration number |
| `Brand name` | `DrugName` | Commercial drug name |
| `Strength` | `Dosage` | Drug strength/dosage |
| `Presentation` | `Presentation` | Drug presentation format |
| `Form` | `Form` | Drug form (tablet, capsule, etc.) |
| `Agent` | `Agent` | Distribution agent |
| `Manufacturer` | `Manufacturer` | Manufacturing company |
| `Country` | `Country` | Country of origin |
| `Public Price LL` | `PublicPrice` | **Auto-converted from LBP to USD** |
| `Pharmacist Margin` | `PharmacistMargin` | Pharmacist margin percentage |
| `Stratum` | `Stratum` | Drug stratum classification |
| `public price Decision 119/1 20230126` | `PriceDecision119` | Price decision reference |
| `Responsible Party Name` | `ResponsiblePartyName` | Responsible party information |
| `Responsible Party Country` | `ResponsiblePartyCountry` | Responsible party country |
| `Exch_Dates` | `ExchangeDates` | Exchange dates |

### 2. Currency Conversion

**Lebanese Lira (LBP) to USD Conversion:**
- Exchange rate: **1 USD = 89,500 LBP**
- The `Public Price LL` column is automatically converted to USD
- Example: 1,790,000 LBP → $20.00 USD

### 3. Optional Column Handling

- **Flexible imports**: Not all columns need to exist in every CSV file
- **Graceful skipping**: Columns that don't exist in the database are automatically skipped
- **Detailed reporting**: The service reports which columns were skipped
- **No errors**: Missing optional columns won't cause the import to fail

## 🚀 Usage Examples

### Basic Import Workflow

```javascript
const DrugUpdateService = require('./src/services/drugUpdateService');

async function importDrugs(csvFilePath) {
    const drugService = new DrugUpdateService();
    
    try {
        // 1. Initialize session
        const session = await drugService.initializeSession();
        console.log('Session created:', session.sessionId);
        
        // 2. Create backup
        await drugService.createBackup();
        console.log('Backup created successfully');
        
        // 3. Parse CSV with automatic header mapping
        const csvData = await drugService.parseCsvFile(csvFilePath, '\t');
        console.log(`Parsed ${csvData.length} rows`);
        
        // 4. Preview changes
        const preview = await drugService.previewChanges(csvData);
        console.log('Preview:', preview.summary);
        
        // Show skipped columns
        if (preview.summary.skippedColumns.length > 0) {
            console.log('Skipped columns:', preview.summary.skippedColumns);
        }
        
        // 5. Create working copy and apply changes
        await drugService.createWorkingCopy();
        const result = await drugService.applyChangesToWorkingTable(csvData);
        
        console.log(`Updated: ${result.updatedCount}, Inserted: ${result.insertedCount}`);
        
        // 6. Commit changes
        await drugService.commitChanges();
        console.log('Changes committed successfully');
        
    } catch (error) {
        console.error('Import failed:', error.message);
        await drugService.rollbackChanges();
    } finally {
        await drugService.cleanupSession();
    }
}
```

### Validate CSV Headers Before Import

```javascript
async function validateHeaders(csvFilePath) {
    const drugService = new DrugUpdateService();
    
    const validation = await drugService.validateCsvHeaders(csvFilePath);
    
    console.log('Original headers:', validation.originalHeaders);
    console.log('Mapped headers:', validation.mappedHeaders);
    console.log('Unmapped headers:', validation.unmappedHeaders);
    console.log('Has required MoPHCode:', validation.hasRequiredColumn);
    
    return validation.hasRequiredColumn;
}
```

### Get Available Mappings

```javascript
const drugService = new DrugUpdateService();
const info = drugService.getHeaderMappingInfo();

console.log('Available mappings:', info.availableMappings);
console.log('Currency conversion:', info.currencyConversion);
```

## 📊 Sample CSV Format

Your CSV file can have these headers (not all are required):

```csv
Code	Registration number	Brand name	Strength	Presentation	Form	Agent	Manufacturer	Country	Public Price LL	Pharmacist Margin	Stratum	public price Decision 119/1 20230126	Responsible Party Name	Responsible Party Country	Exch_Dates
12345	REG/2024/001	Paracetamol Tablets	500mg	Box of 20 tablets	Tablet	Local Pharma	PharmaCorp Lebanon	Lebanon	179000	15%	A	Yes	Local Company	Lebanon	2024-01-01
23456	REG/2024/002	Amoxicillin Capsules	250mg	Box of 12 capsules	Capsule	Import Agent	Euro Pharma	Germany	895000	12%	B	No	Euro Corp	Germany	2024-01-15
```

## 🔧 Testing

Run the test script to verify the enhanced features:

```bash
node test-enhanced-drug-service.js
```

This will:
- Test currency conversion calculations
- Test header mapping functionality
- Create a sample CSV file
- Validate and parse the test file
- Show detailed output for verification

## ⚠️ Important Notes

1. **Required Column**: The `Code` column (mapping to `MoPHCode`) is required for all operations
2. **Currency Conversion**: Only applies to `Public Price LL` column - other price fields are not automatically converted
3. **Delimiter**: Default delimiter is tab (`\t`) but can be customized
4. **Database Compatibility**: Only updates/inserts columns that exist in the database schema
5. **Transaction Safety**: All operations are wrapped in database transactions for data integrity

## 🛠️ Configuration

You can modify the header mapping by updating the `headerMapping` object in the constructor:

```javascript
this.headerMapping = {
    'Your CSV Header': 'DatabaseColumn',
    // Add custom mappings as needed
};
```

Update the exchange rate if needed:

```javascript
this.LBP_TO_USD_RATE = 89500; // Update this value as needed
```

## 📝 Error Handling

The service provides detailed error reporting:
- Missing required columns
- Invalid data format
- Database constraint violations
- Skipped columns (for informational purposes)

All errors include context about which row/column caused the issue for easy troubleshooting.