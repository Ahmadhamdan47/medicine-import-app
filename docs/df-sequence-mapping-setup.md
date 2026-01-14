# DF Sequence Mapping - Setup Guide

## Quick Start Guide

This guide will help you set up the DF Sequence Mapping feature in your Medicine Import App.

## Prerequisites

- Node.js installed
- MySQL database running
- Access to the database configured in `config/database.js`
- CSV file at `src/data/DFSeq.csv` containing the mapping data

## Step 1: Verify CSV File

Ensure the CSV file exists at the correct location:

```bash
# Check if the file exists
ls src/data/DFSeq.csv
```

The CSV should have this format:
```csv
MoPHCode,DFSequence
28,C22C24C23C21
30,C22C24C23C21
31,C221C24
...
```

## Step 2: Run the Setup Script

Execute the setup script to create the table and import data:

```bash
node scripts/createDFSequenceMappingTable.js
```

**Expected Output:**
```
🔄 Starting DF Sequence Mapping table creation...
✅ Database connection established successfully.

📋 Creating df_sequence_mapping table...
✅ df_sequence_mapping table created successfully

📥 Importing data from DFSeq.csv...
📊 Found 5579 records in CSV
   Imported: 5579/5579 records
✅ All records imported successfully

🎉 DF Sequence Mapping table created and populated successfully!

📊 Table Statistics:
   Total records: 5579
   Unique DF Sequences: 342

📄 Sample records:
┌─────────┬────────────┬──────────┬──────────────┬────────────────┬───────────────────────┬───────────────────────┐
│ (index) │     id     │ moph_code│ df_sequence  │   created_at   │     updated_at        │
├─────────┼────────────┼──────────┼──────────────┼────────────────┼───────────────────────┤
│    0    │     1      │   '28'   │'C22C24C23C21'│ 2026-01-14...  │   2026-01-14...      │
└─────────┴────────────┴──────────┴──────────────┴────────────────┴───────────────────────┘

🔒 Database connection closed.
✅ Script completed successfully
```

## Step 3: Verify Installation

### Option A: Using MySQL Client

```bash
mysql -u ommal_ahmad -p ommal_medapiv2
```

```sql
-- Check table exists
SHOW TABLES LIKE 'df_sequence_mapping';

-- Count records
SELECT COUNT(*) FROM df_sequence_mapping;

-- View sample data
SELECT * FROM df_sequence_mapping LIMIT 10;

-- Check unique sequences
SELECT COUNT(DISTINCT df_sequence) FROM df_sequence_mapping;
```

### Option B: Using the API

Start the server if not already running:
```bash
node index.js
```

Test the API endpoints:

```bash
# Get statistics
curl http://localhost:8066/api/df-sequence-mapping/stats/summary

# Get a specific mapping
curl http://localhost:8066/api/df-sequence-mapping/28

# Search mappings
curl "http://localhost:8066/api/df-sequence-mapping?search=C22&page=1&limit=10"
```

## Step 4: Integration with Existing Code

The routes are automatically registered in `index.js`. If you need to use the service in your code:

```javascript
// Import the service
const dfSequenceMappingService = require('./src/services/dfSequenceMappingService');

// Example: Enrich drug data with DFSequence
async function enrichDrugData(drug) {
  if (drug.MoPHCode && !drug.DFSequence) {
    const dfSequence = await dfSequenceMappingService.getDFSequenceByMophCode(drug.MoPHCode);
    if (dfSequence) {
      drug.DFSequence = dfSequence;
      console.log(`Auto-populated DFSequence: ${dfSequence} for MoPH code: ${drug.MoPHCode}`);
    }
  }
  return drug;
}
```

## Troubleshooting

### Issue: "CSV file not found"

**Solution:**
```bash
# Check if file exists
ls -la src/data/DFSeq.csv

# If not found, verify the path is correct
```

### Issue: "Table already exists"

**Solution:**
The script will skip import if data already exists. To force reimport:

```sql
-- Drop the table
DROP TABLE IF EXISTS df_sequence_mapping;

-- Run the script again
node scripts/createDFSequenceMappingTable.js
```

### Issue: "Database connection failed"

**Solution:**
Check your database credentials in `config/database.js`:
```javascript
const sequelize = new Sequelize("ommal_medapiv2","ommal_ahmad", "fISfGr^8q!_gUPMY", {
    host: 'localhost',
    dialect: 'mysql',
    // ...
});
```

### Issue: "Module 'csv-parser' not found"

**Solution:**
Install the required dependency:
```bash
npm install csv-parser
```

### Issue: API returns 404

**Solution:**
1. Verify the server is running
2. Check that routes are registered in `index.js`
3. Verify the correct base URL: `/api/df-sequence-mapping`

## Testing the Setup

### 1. Test Basic Lookup

```bash
# Test with a known MoPH code
curl http://localhost:8066/api/df-sequence-mapping/28

# Expected response:
# {
#   "success": true,
#   "data": {
#     "mophCode": "28",
#     "dfSequence": "C22C24C23C21"
#   }
# }
```

### 2. Test Pagination

```bash
curl "http://localhost:8066/api/df-sequence-mapping?page=1&limit=5"
```

### 3. Test Search

```bash
curl "http://localhost:8066/api/df-sequence-mapping?search=S1S2S7"
```

### 4. Test Statistics

```bash
curl http://localhost:8066/api/df-sequence-mapping/stats/summary
```

## Using in Drug Import Workflow

To automatically populate DFSequence during drug import, integrate with your drug service:

```javascript
// In your drug import/update handler
const dfSequenceMappingService = require('./services/dfSequenceMappingService');

router.post('/import-drugs', async (req, res) => {
  try {
    const drugs = req.body.drugs;
    
    // Enrich each drug with DFSequence if missing
    for (let drug of drugs) {
      if (drug.MoPHCode && !drug.DFSequence) {
        drug.DFSequence = await dfSequenceMappingService.getDFSequenceByMophCode(drug.MoPHCode);
      }
    }
    
    // Continue with drug import...
    // ...
  } catch (error) {
    // Handle error
  }
});
```

## Maintenance

### Update Mappings from New CSV

When you receive an updated CSV file:

```bash
# 1. Backup existing data
mysqldump -u ommal_ahmad -p ommal_medapiv2 df_sequence_mapping > df_mapping_backup.sql

# 2. Replace the CSV file
cp new_DFSeq.csv src/data/DFSeq.csv

# 3. Clear existing data
mysql -u ommal_ahmad -p ommal_medapiv2 -e "TRUNCATE TABLE df_sequence_mapping;"

# 4. Re-import
node scripts/createDFSequenceMappingTable.js
```

### Manual Database Backup

```bash
# Export to CSV
mysql -u ommal_ahmad -p ommal_medapiv2 -e "
  SELECT moph_code, df_sequence 
  FROM df_sequence_mapping 
  INTO OUTFILE '/tmp/df_sequence_backup.csv' 
  FIELDS TERMINATED BY ',' 
  ENCLOSED BY '\"' 
  LINES TERMINATED BY '\n'
"

# Or use mysqldump
mysqldump -u ommal_ahmad -p ommal_medapiv2 df_sequence_mapping > df_mapping_backup.sql
```

## API Documentation

For complete API documentation, see:
- [docs/df-sequence-mapping.md](./df-sequence-mapping.md)
- Swagger UI: http://localhost:8066/api-docs

## Files Reference

Created/Modified files:
- ✅ `scripts/createDFSequenceMappingTable.js` - Setup script
- ✅ `scripts/createDFSequenceMappingTable.sql` - SQL schema
- ✅ `src/models/dfSequenceMapping.js` - Sequelize model
- ✅ `src/services/dfSequenceMappingService.js` - Business logic
- ✅ `src/routes/dfSequenceMappingRoutes.js` - API endpoints
- ✅ `docs/df-sequence-mapping.md` - Complete documentation
- ✅ `docs/df-sequence-mapping-setup.md` - This setup guide
- ✅ `index.js` - Routes registered

## Next Steps

1. ✅ Setup complete - Table created and populated
2. 🔄 Test API endpoints
3. 🔄 Integrate with drug import workflow
4. 🔄 Add to Swagger documentation
5. 🔄 Create automated tests
6. 🔄 Set up monitoring and alerts

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the complete documentation in [docs/df-sequence-mapping.md](./df-sequence-mapping.md)
3. Check application logs in `error.log`
4. Verify database connectivity

## Success Checklist

- [ ] CSV file exists at `src/data/DFSeq.csv`
- [ ] Setup script executed successfully
- [ ] Table contains expected number of records (5579)
- [ ] API endpoints return valid responses
- [ ] Routes registered in `index.js`
- [ ] Can query mappings via API
- [ ] Statistics endpoint works
- [ ] Search functionality works

Once all items are checked, your DF Sequence Mapping feature is ready to use! 🎉
