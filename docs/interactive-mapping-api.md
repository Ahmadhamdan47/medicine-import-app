# Drug Import API - Interactive Column Mapping

Complete API documentation for the enhanced drug import system with interactive column mapping capabilities.

## 🌟 Overview

This API provides a complete workflow for importing drug data with user-controlled column mapping. Users can upload CSV/TSV files, map columns to database fields, preview changes, and commit or rollback transactions safely.

## 🔄 Workflow Steps

```
1. Upload & Analyze  →  2. Set Mapping  →  3. Preview  →  4. Apply  →  5. Review  →  6. Commit/Rollback
```

## 📡 API Endpoints

### 1. Upload and Analyze CSV File

**POST** `/api/drug-import/upload-analyze`

Upload a CSV/TSV file and get analysis of headers and suggested mappings.

**Request:**
- **Content-Type:** `multipart/form-data`
- **Body:** Form data with `csvFile` field

**Response:**
```json
{
  "success": true,
  "sessionId": "drug_update_1699789234567_abc123",
  "fileName": "drug-data.csv",
  "analysis": {
    "headers": ["Code", "Brand name", "Public Price LL", "Form"],
    "sampleData": [
      {"Code": "12345", "Brand name": "Sample Drug", "Public Price LL": "1790000", "Form": "Tablet"},
      // ... up to 3 sample rows
    ],
    "rowCount": 150,
    "availableDbColumns": ["MoPHCode", "DrugName", "PublicPrice", "Form", ...],
    "suggestedMappings": {
      "Code": "MoPHCode",
      "Brand name": "DrugName",
      "Public Price LL": "PublicPrice"
    },
    "unmappedHeaders": ["Unknown Column"],
    "currencyColumns": ["Public Price LL", "PublicPrice LL"],
    "exchangeRate": 89500
  },
  "nextStep": "Map columns using /api/drug-import/set-mapping"
}
```

---

### 2. Set Column Mapping

**POST** `/api/drug-import/set-mapping`

Define how CSV columns map to database fields.

**Request:**
```json
{
  "sessionId": "drug_update_1699789234567_abc123",
  "columnMapping": {
    "Code": "MoPHCode",
    "Brand name": "DrugName", 
    "Public Price LL": "PublicPrice",
    "Form": "Form",
    "Strength": "Dosage"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Column mapping set successfully",
  "mappingCount": 5,
  "validation": {
    "valid": true,
    "errors": [],
    "warnings": ["CSV column 'Unknown' is not mapped"],
    "mappedColumns": {
      "Code": "MoPHCode",
      "Brand name": "DrugName"
    },
    "hasRequiredMoPHCode": true
  },
  "nextStep": "Preview changes using /api/drug-import/preview"
}
```

---

### 3. Preview Changes

**GET** `/api/drug-import/preview/:sessionId`

Preview what changes will be made to the database.

**Response:**
```json
{
  "success": true,
  "preview": {
    "summary": {
      "totalRows": 150,
      "updates": 120,
      "inserts": 30,
      "errors": 0,
      "skippedColumns": ["Unknown Column"]
    },
    "details": {
      "updates": [
        {
          "MoPHCode": "12345",
          "changes": {
            "PublicPrice": {
              "from": 18.5,
              "to": 20.0
            },
            "DrugName": {
              "from": "Old Name",
              "to": "New Name"
            }
          }
        }
      ],
      "inserts": [
        {
          "MoPHCode": "67890",
          "DrugName": "New Drug",
          "PublicPrice": 15.5
        }
      ],
      "errors": []
    }
  },
  "nextStep": "Apply changes using /api/drug-import/apply"
}
```

---

### 4. Apply Changes

**POST** `/api/drug-import/apply/:sessionId`

Apply changes to a working table (safe staging area).

**Response:**
```json
{
  "success": true,
  "result": {
    "updatedCount": 120,
    "insertedCount": 30,
    "totalProcessed": 150,
    "skippedColumns": ["Unknown Column"],
    "message": "All CSV columns were successfully mapped to database columns"
  },
  "nextStep": "Review final changes and commit"
}
```

---

### 5. Get Final Changes

**GET** `/api/drug-import/final-changes/:sessionId`

Review final changes before committing to live database.

**Response:**
```json
{
  "success": true,
  "finalChanges": [
    {
      "MoPHCode": "12345",
      "ChangeType": "UPDATE",
      "Original_BrandName": "Old Name",
      "New_BrandName": "New Name",
      "Original_PublicPrice": 18.5,
      "New_PublicPrice": 20.0
    },
    {
      "MoPHCode": "67890",
      "ChangeType": "INSERT",
      "New_BrandName": "New Drug",
      "New_PublicPrice": 15.5
    }
  ],
  "changeCount": 150,
  "nextStep": "Commit changes using /api/drug-import/commit"
}
```

---

### 6. Commit Changes

**POST** `/api/drug-import/commit/:sessionId`

Commit changes to the live database (irreversible).

**Response:**
```json
{
  "success": true,
  "message": "Changes committed successfully",
  "result": {
    "success": true,
    "message": "Changes committed successfully",
    "timestamp": "2025-11-12T10:30:00.000Z"
  }
}
```

---

### 7. Rollback Changes

**POST** `/api/drug-import/rollback/:sessionId`

Rollback all changes and restore original data.

**Response:**
```json
{
  "success": true,
  "message": "Changes rolled back successfully", 
  "result": {
    "success": true,
    "message": "Successfully rolled back to backup",
    "timestamp": "2025-11-12T10:35:00.000Z"
  }
}
```

---

## 🛠️ Utility Endpoints

### Get Available Database Columns

**GET** `/api/drug-import/available-columns`

Get list of all available database columns for mapping.

**Response:**
```json
{
  "success": true,
  "availableColumns": ["MoPHCode", "DrugName", "PublicPrice", "Form", ...],
  "columnDetails": {
    "MoPHCode": {
      "dataType": "varchar",
      "maxLength": 10,
      "nullable": true
    }
  },
  "defaultMappings": {
    "Code": "MoPHCode",
    "Brand name": "DrugName"
  },
  "currencyConversion": {
    "columns": ["Public Price LL"],
    "rate": 89500,
    "description": "Lebanese Lira values automatically converted to USD"
  }
}
```

### Get Session Status

**GET** `/api/drug-import/session/:sessionId`

Check the current status of an import session.

**Response:**
```json
{
  "success": true,
  "session": {
    "sessionId": "drug_update_1699789234567_abc123",
    "backupTable": "drug_backup_drug_update_1699789234567_abc123",
    "workingTable": "drug_working_drug_update_1699789234567_abc123",
    "initialized": true,
    "fileName": "drug-data.csv",
    "uploadTime": "2025-11-12T10:00:00.000Z",
    "mappingInfo": {
      "isUsingCustomMapping": true,
      "currentMappings": {...}
    }
  }
}
```

### List Active Sessions (Admin)

**GET** `/api/drug-import/sessions`

List all active import sessions (for administrative purposes).

**Response:**
```json
{
  "success": true,
  "sessions": [
    {
      "sessionId": "drug_update_1699789234567_abc123",
      "fileName": "drug-data.csv",
      "uploadTime": "2025-11-12T10:00:00.000Z",
      "sessionInfo": {
        "initialized": true,
        "backupTable": "drug_backup_...",
        "workingTable": "drug_working_..."
      }
    }
  ],
  "count": 1
}
```

---

## 🔧 Configuration & Features

### Currency Conversion

- **Automatic Detection:** Columns with names containing "LL" are treated as Lebanese Lira
- **Conversion Rate:** 1 USD = 89,500 LBP (configurable)
- **Supported Columns:** `Public Price LL`, `PublicPrice LL`, `Price LL`

### Column Mapping Rules

1. **Required:** At least one column must map to `MoPHCode`
2. **Optional:** All other columns are optional
3. **Flexible:** Supports both exact matches and custom mappings
4. **Safe:** Columns not in database schema are automatically skipped

### File Support

- **Formats:** CSV (`.csv`) and TSV (`.tsv`)
- **Delimiters:** Auto-detected based on file extension
- **Size Limit:** 50MB maximum
- **Encoding:** UTF-8 recommended

---

## 📝 Usage Examples

### Complete Workflow Example

```javascript
// 1. Upload file
const formData = new FormData();
formData.append('csvFile', file);
const uploadResponse = await fetch('/api/drug-import/upload-analyze', {
    method: 'POST',
    body: formData
});
const uploadResult = await uploadResponse.json();
const sessionId = uploadResult.sessionId;

// 2. Set mapping
await fetch('/api/drug-import/set-mapping', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        sessionId: sessionId,
        columnMapping: {
            'Code': 'MoPHCode',
            'Brand name': 'DrugName',
            'Public Price LL': 'PublicPrice'
        }
    })
});

// 3. Preview changes
const previewResponse = await fetch(`/api/drug-import/preview/${sessionId}`);
const previewResult = await previewResponse.json();

// 4. Apply changes
await fetch(`/api/drug-import/apply/${sessionId}`, { method: 'POST' });

// 5. Review final changes
const finalResponse = await fetch(`/api/drug-import/final-changes/${sessionId}`);
const finalResult = await finalResponse.json();

// 6. Commit or rollback
if (confirm('Commit changes?')) {
    await fetch(`/api/drug-import/commit/${sessionId}`, { method: 'POST' });
} else {
    await fetch(`/api/drug-import/rollback/${sessionId}`, { method: 'POST' });
}
```

---

## ⚠️ Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description",
  "validationErrors": [...], // If applicable
  "warnings": [...] // If applicable
}
```

### Common Error Codes

- **400:** Bad request (missing parameters, invalid mapping)
- **404:** Session not found or expired
- **500:** Internal server error

---

## 🔒 Security Considerations

1. **File Validation:** Only CSV/TSV files are accepted
2. **Size Limits:** 50MB maximum file size
3. **Session Management:** Sessions are automatically cleaned up
4. **Database Transactions:** All operations are transaction-safe
5. **Input Sanitization:** All data is validated and sanitized

---

## 📈 Performance Notes

- **Large Files:** Files with >10,000 rows may take longer to process
- **Memory Usage:** Large files are streamed to minimize memory usage
- **Database Load:** Operations use temporary tables to minimize impact
- **Session Cleanup:** Sessions are automatically cleaned up after completion

---

## 🚀 Integration with Frontend

See `frontend-interactive-mapping.html` for a complete frontend implementation that demonstrates:

- Drag & drop file upload
- Interactive column mapping interface  
- Real-time preview of changes
- Step-by-step workflow guidance
- Progress tracking and status updates