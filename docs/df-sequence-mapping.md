# DF Sequence Mapping Documentation

## Overview

The DF Sequence Mapping module provides a relational database table and API to manage the correlation between MoPH codes and their corresponding DFSequence values. DFSequence represents the dosage form sequence used for drug classification in the system.

## Database Schema

### Table: `df_sequence_mapping`

```sql
CREATE TABLE df_sequence_mapping (
    id INT PRIMARY KEY AUTO_INCREMENT,
    moph_code VARCHAR(50) NOT NULL UNIQUE,
    df_sequence VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_moph_code (moph_code),
    INDEX idx_df_sequence (df_sequence)
);
```

**Fields:**
- `id`: Auto-incrementing primary key
- `moph_code`: MoPH code (unique identifier)
- `df_sequence`: Dosage form sequence code
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Indexes:**
- `idx_moph_code`: Fast lookup by MoPH code
- `idx_df_sequence`: Fast lookup by DFSequence

## Setup & Installation

### 1. Create the Table

Run the SQL script:
```bash
node scripts/createDFSequenceMappingTable.js
```

Or manually execute:
```bash
mysql -u username -p ommal_medapiv2 < scripts/createDFSequenceMappingTable.sql
```

### 2. Import Data

The script automatically imports data from `src/data/DFSeq.csv` which contains:
- MoPH codes
- Corresponding DFSequence values

The CSV format:
```csv
MoPHCode,DFSequence
28,C22C24C23C21
30,C22C24C23C21
31,C221C24
...
```

## API Endpoints

Base URL: `/api/df-sequence-mapping`

### 1. Get DFSequence by MoPH Code

**GET** `/api/df-sequence-mapping/:mophCode`

Get the DFSequence value for a specific MoPH code.

**Example:**
```bash
GET /api/df-sequence-mapping/28
```

**Response:**
```json
{
  "success": true,
  "data": {
    "mophCode": "28",
    "dfSequence": "C22C24C23C21"
  }
}
```

### 2. Get All Mappings (Paginated)

**GET** `/api/df-sequence-mapping?page=1&limit=100`

Get all mappings with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 100)
- `search` (optional): Search term for MoPH code or DFSequence

**Example:**
```bash
GET /api/df-sequence-mapping?page=1&limit=50&search=C22
```

**Response:**
```json
{
  "success": true,
  "total": 5579,
  "page": 1,
  "limit": 50,
  "totalPages": 112,
  "data": [
    {
      "id": 1,
      "mophCode": "28",
      "dfSequence": "C22C24C23C21",
      "createdAt": "2026-01-14T10:00:00.000Z",
      "updatedAt": "2026-01-14T10:00:00.000Z"
    }
  ]
}
```

### 3. Get MoPH Codes by DFSequence

**GET** `/api/df-sequence-mapping/by-sequence/:dfSequence`

Get all MoPH codes that map to a specific DFSequence.

**Example:**
```bash
GET /api/df-sequence-mapping/by-sequence/C22C24C23C21
```

**Response:**
```json
{
  "success": true,
  "data": {
    "dfSequence": "C22C24C23C21",
    "mophCodes": ["28", "30", "32", "33"],
    "count": 4
  }
}
```

### 4. Get Statistics

**GET** `/api/df-sequence-mapping/stats/summary`

Get statistics about the mappings.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalMappings": 5579,
    "uniqueSequences": 342,
    "mostCommonSequences": [
      { "df_sequence": "S1S2S7", "count": 856 },
      { "df_sequence": "C22C24C23C21", "count": 623 }
    ]
  }
}
```

### 5. Create or Update Mapping

**POST** `/api/df-sequence-mapping`

Create a new mapping or update an existing one.

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "mophCode": "12345",
  "dfSequence": "C22C24C23C21"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mapping created successfully",
  "data": {
    "id": 5580,
    "mophCode": "12345",
    "dfSequence": "C22C24C23C21"
  }
}
```

### 6. Bulk Import

**POST** `/api/df-sequence-mapping/bulk`

Import multiple mappings at once.

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "mappings": [
    { "mophCode": "10001", "dfSequence": "S1S2S7" },
    { "mophCode": "10002", "dfSequence": "C22C24C23C21" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk import completed",
  "data": {
    "success": 2,
    "failed": 0,
    "errors": []
  }
}
```

### 7. Delete Mapping

**DELETE** `/api/df-sequence-mapping/:mophCode`

Delete a mapping by MoPH code.

**Authentication:** Required (Bearer Token)

**Example:**
```bash
DELETE /api/df-sequence-mapping/12345
```

**Response:**
```json
{
  "success": true,
  "message": "Mapping deleted successfully"
}
```

## Service Methods

### DFSequenceMappingService

The service provides the following methods:

```javascript
const dfSequenceMappingService = require('./services/dfSequenceMappingService');

// Get DFSequence by MoPH code
const dfSeq = await dfSequenceMappingService.getDFSequenceByMophCode('28');

// Get MoPH codes by DFSequence
const codes = await dfSequenceMappingService.getMophCodesByDFSequence('C22C24C23C21');

// Get all mappings with pagination
const mappings = await dfSequenceMappingService.getAllMappings(page, limit);

// Search mappings
const results = await dfSequenceMappingService.searchMappings('S1S2');

// Get statistics
const stats = await dfSequenceMappingService.getStatistics();

// Create or update
const result = await dfSequenceMappingService.upsertMapping('12345', 'C22C24C23C21');

// Delete
const deleted = await dfSequenceMappingService.deleteMapping('12345');

// Bulk import
const importResult = await dfSequenceMappingService.bulkImport(mappingsArray);
```

## Integration with Drug Service

To integrate with the existing drug service, you can use the mapping to automatically populate DFSequence when importing drugs:

```javascript
const dfSequenceMappingService = require('./services/dfSequenceMappingService');

// During drug import/update
async function enrichDrugWithDFSequence(drug) {
  if (drug.MoPHCode && !drug.DFSequence) {
    const dfSequence = await dfSequenceMappingService.getDFSequenceByMophCode(drug.MoPHCode);
    if (dfSequence) {
      drug.DFSequence = dfSequence;
    }
  }
  return drug;
}
```

## Common DFSequence Values

Based on the data, here are some of the most common DFSequence patterns:

- **S1S2S7**: Injectable/Solution forms
- **C22C24C23C21**: Tablet/Capsule forms
- **L1, L3, L4, L9**: Liquid/Lotion forms
- **G2**: Gel forms
- **C221C24, C222C24**: Specific capsule variants

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad request (missing parameters)
- `401`: Unauthorized
- `404`: Mapping not found
- `500`: Server error

## Data Maintenance

### Update Mappings from CSV

To update mappings from a new CSV file:

1. Replace `src/data/DFSeq.csv` with the new file
2. Run the import script:
   ```bash
   node scripts/createDFSequenceMappingTable.js
   ```

### Backup Data

```sql
-- Export mappings to CSV
SELECT moph_code, df_sequence 
INTO OUTFILE '/tmp/df_sequence_backup.csv'
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
FROM df_sequence_mapping;
```

## Performance Considerations

- Indexes on `moph_code` and `df_sequence` ensure fast lookups
- Batch imports use bulk operations for better performance
- Pagination prevents memory issues with large result sets
- Unique constraint on `moph_code` prevents duplicates

## Files Created

1. **Database**
   - `scripts/createDFSequenceMappingTable.sql` - SQL schema
   - `scripts/createDFSequenceMappingTable.js` - Setup script

2. **Model & Service**
   - `src/models/dfSequenceMapping.js` - Sequelize model
   - `src/services/dfSequenceMappingService.js` - Business logic

3. **API**
   - `src/routes/dfSequenceMappingRoutes.js` - REST endpoints

4. **Documentation**
   - `docs/df-sequence-mapping.md` - This file

## Next Steps

1. Register routes in main application (add to `index.js` or main router)
2. Update Swagger documentation
3. Add automated tests
4. Consider adding caching for frequently accessed mappings
5. Add audit logging for changes to mappings
