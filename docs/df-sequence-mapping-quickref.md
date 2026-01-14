# DF Sequence Mapping - Quick Reference

## 🚀 Quick Start

```bash
# Setup (one-time)
node scripts/createDFSequenceMappingTable.js

# Start server
node index.js

# Test
curl http://localhost:8066/api/df-sequence-mapping/28
```

## 📊 API Endpoints

### Base URL
```
http://localhost:8066/api/df-sequence-mapping
```

### GET Endpoints (No Auth Required)

```bash
# Get DFSequence by MoPH code
GET /:mophCode
curl http://localhost:8066/api/df-sequence-mapping/28

# Get all mappings (paginated)
GET /?page=1&limit=100
curl "http://localhost:8066/api/df-sequence-mapping?page=1&limit=10"

# Search mappings
GET /?search=term
curl "http://localhost:8066/api/df-sequence-mapping?search=C22"

# Get MoPH codes by DFSequence
GET /by-sequence/:dfSequence
curl http://localhost:8066/api/df-sequence-mapping/by-sequence/C22C24C23C21

# Get statistics
GET /stats/summary
curl http://localhost:8066/api/df-sequence-mapping/stats/summary
```

### POST/DELETE Endpoints (Auth Required)

```bash
# Create or update mapping
POST /
curl -X POST http://localhost:8066/api/df-sequence-mapping \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mophCode": "12345", "dfSequence": "C22C24C23C21"}'

# Bulk import
POST /bulk
curl -X POST http://localhost:8066/api/df-sequence-mapping/bulk \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mappings": [{"mophCode": "10001", "dfSequence": "S1S2S7"}]}'

# Delete mapping
DELETE /:mophCode
curl -X DELETE http://localhost:8066/api/df-sequence-mapping/12345 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 💻 Service Usage

```javascript
const dfSequenceMappingService = require('./src/services/dfSequenceMappingService');

// Get DFSequence by MoPH code
const dfSeq = await dfSequenceMappingService.getDFSequenceByMophCode('28');

// Get MoPH codes by DFSequence
const codes = await dfSequenceMappingService.getMophCodesByDFSequence('C22C24C23C21');

// Get all mappings
const results = await dfSequenceMappingService.getAllMappings(page, limit);

// Search
const found = await dfSequenceMappingService.searchMappings('S1S2');

// Get statistics
const stats = await dfSequenceMappingService.getStatistics();

// Create/update
await dfSequenceMappingService.upsertMapping('12345', 'C22C24C23C21');

// Delete
await dfSequenceMappingService.deleteMapping('12345');

// Bulk import
await dfSequenceMappingService.bulkImport(mappingsArray);
```

## 🔧 Integration Example

```javascript
// Auto-populate DFSequence during drug import
const dfSequenceMappingService = require('./services/dfSequenceMappingService');

async function enrichDrugWithDFSequence(drug) {
  if (drug.MoPHCode && !drug.DFSequence) {
    const dfSequence = await dfSequenceMappingService.getDFSequenceByMophCode(drug.MoPHCode);
    if (dfSequence) {
      drug.DFSequence = dfSequence;
      console.log(`Auto-set DFSequence: ${dfSequence} for MoPH: ${drug.MoPHCode}`);
    }
  }
  return drug;
}

// Use in your import workflow
const enrichedDrug = await enrichDrugWithDFSequence(drugData);
```

## 🗄️ Database Queries

```sql
-- Count all mappings
SELECT COUNT(*) FROM df_sequence_mapping;

-- Find DFSequence by MoPH code
SELECT df_sequence FROM df_sequence_mapping WHERE moph_code = '28';

-- Find MoPH codes by DFSequence
SELECT moph_code FROM df_sequence_mapping WHERE df_sequence = 'C22C24C23C21';

-- Most common DFSequences
SELECT df_sequence, COUNT(*) as count 
FROM df_sequence_mapping 
GROUP BY df_sequence 
ORDER BY count DESC 
LIMIT 10;

-- Search mappings
SELECT * FROM df_sequence_mapping 
WHERE moph_code LIKE '%28%' OR df_sequence LIKE '%C22%' 
LIMIT 50;
```

## 📈 Common DFSequence Values

| DFSequence | Description | Count |
|------------|-------------|-------|
| S1S2S7 | Injectable/Solution | 856 |
| C22C24C23C21 | Tablet/Capsule | 623 |
| L1, L3, L4, L9 | Liquid/Lotion | ~200 |
| G2 | Gel | ~150 |
| C221C24, C222C24 | Capsule variants | ~100 |

## 📁 File Locations

```
medicine-import-app/
├── scripts/
│   ├── createDFSequenceMappingTable.js    # Setup script
│   └── createDFSequenceMappingTable.sql   # SQL schema
├── src/
│   ├── models/
│   │   └── dfSequenceMapping.js           # Sequelize model
│   ├── services/
│   │   └── dfSequenceMappingService.js    # Business logic
│   ├── routes/
│   │   └── dfSequenceMappingRoutes.js     # API endpoints
│   └── data/
│       └── DFSeq.csv                      # Source data (5,579 records)
├── docs/
│   ├── df-sequence-mapping.md             # Complete documentation
│   ├── df-sequence-mapping-setup.md       # Setup guide
│   ├── df-sequence-mapping-summary.md     # Implementation summary
│   └── df-sequence-mapping-quickref.md    # This file
└── index.js                               # Routes registered here
```

## 🔍 Troubleshooting

### Server won't start
```bash
# Check for port conflicts
netstat -ano | findstr :8066

# Check logs
tail -f error.log
```

### API returns 404
```bash
# Verify routes registered
grep "df-sequence-mapping" index.js

# Restart server
node index.js
```

### No data returned
```bash
# Check database
mysql -u ommal_ahmad -p ommal_medapiv2 -e "SELECT COUNT(*) FROM df_sequence_mapping;"

# Re-run setup if empty
node scripts/createDFSequenceMappingTable.js
```

### CSV import fails
```bash
# Verify CSV exists
ls -la src/data/DFSeq.csv

# Check CSV format (should have header: MoPHCode,DFSequence)
head -5 src/data/DFSeq.csv
```

## 📊 Statistics

```bash
# Get summary stats
curl http://localhost:8066/api/df-sequence-mapping/stats/summary

# Response:
{
  "success": true,
  "data": {
    "totalMappings": 5579,
    "uniqueSequences": 342,
    "mostCommonSequences": [...]
  }
}
```

## 🔐 Authentication

Write operations require Bearer token:

```bash
# Set your token
TOKEN="your_jwt_token_here"

# Use in requests
curl -H "Authorization: Bearer $TOKEN" \
  -X POST http://localhost:8066/api/df-sequence-mapping \
  -H "Content-Type: application/json" \
  -d '{"mophCode": "12345", "dfSequence": "C22"}'
```

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error"
}
```

### Paginated Response
```json
{
  "success": true,
  "total": 5579,
  "page": 1,
  "limit": 100,
  "totalPages": 56,
  "data": [...]
}
```

## 🎯 Key Features

✅ Fast indexed lookups  
✅ Pagination support  
✅ Search functionality  
✅ Bulk operations  
✅ Statistics endpoint  
✅ RESTful API  
✅ Sequelize ORM  
✅ Complete documentation  

## 📖 Full Documentation

- **Complete Guide**: [docs/df-sequence-mapping.md](./df-sequence-mapping.md)
- **Setup Guide**: [docs/df-sequence-mapping-setup.md](./df-sequence-mapping-setup.md)
- **Summary**: [docs/df-sequence-mapping-summary.md](./df-sequence-mapping-summary.md)
- **Quick Reference**: [docs/df-sequence-mapping-quickref.md](./df-sequence-mapping-quickref.md)

---

**Need Help?** Check the full documentation or review the setup guide.
