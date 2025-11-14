# Drug Update API Documentation

## Overview

The Drug Update API provides a comprehensive workflow for safely updating the drug database using CSV files. The system implements a multi-step process that ensures data integrity and allows for preview and rollback capabilities.

## Workflow

The typical workflow for updating the drug database is:

1. **Initialize Session** - Create a new update session
2. **Upload CSV** - Upload and parse the CSV file with new drug data
3. **Create Backup** - Backup the current drug table
4. **Create Working Copy** - Create a working copy from the backup
5. **Preview Changes** - Preview what changes will be made
6. **Apply Changes** - Apply changes to the working copy
7. **Review Final Changes** - Review the final state of changes
8. **Commit or Rollback** - Either commit the changes or rollback
9. **Cleanup** - Clean up temporary tables and session data

## API Endpoints

All endpoints are prefixed with `/api/drug-update`

### Session Management

#### Initialize Session
```http
POST /session/initialize
```

Creates a new update session with unique backup and working table names.

**Response:**
```json
{
  "success": true,
  "sessionInfo": {
    "sessionId": "drug_update_1699123456_abc123def",
    "backupTable": "drug_backup_drug_update_1699123456_abc123def",
    "workingTable": "drug_working_drug_update_1699123456_abc123def"
  },
  "message": "Update session initialized successfully"
}
```

#### Get Session Info
```http
GET /session/{sessionId}/info
```

Retrieves information about a specific session.

#### List Active Sessions
```http
GET /sessions
```

Lists all currently active update sessions.

### File Upload

#### Upload CSV File
```http
POST /session/{sessionId}/upload
```

Uploads and parses a CSV or TSV file containing drug data.

**Form Data:**
- `file`: The CSV/TSV file (required)
- `delimiter`: CSV delimiter (optional, auto-detected if not provided)

**Supported File Types:** `.csv`, `.tsv`, `.txt`
**Max File Size:** 50MB

**Response:**
```json
{
  "success": true,
  "message": "CSV file uploaded and parsed successfully",
  "data": {
    "totalRows": 1250,
    "columns": ["MoPHCode", "BrandName", "PublicPrice", "NotMarketed"],
    "sampleRows": [
      {
        "MoPHCode": 12345,
        "BrandName": "Example Drug",
        "PublicPrice": 25.50,
        "NotMarketed": 0
      }
    ]
  }
}
```

### Database Operations

#### Create Backup
```http
POST /session/{sessionId}/backup
```

Creates a backup of the current drug table.

**Response:**
```json
{
  "success": true,
  "message": "Backup created successfully",
  "data": {
    "success": true,
    "backupTable": "drug_backup_drug_update_1699123456_abc123def",
    "recordCount": 15420,
    "timestamp": "2023-11-05T10:30:45.123Z"
  }
}
```

#### Create Working Copy
```http
POST /session/{sessionId}/working-copy
```

Creates a working copy of the backup for applying changes.

### Preview and Analysis

#### Preview Changes
```http
GET /session/{sessionId}/preview
```

Analyzes the CSV data against the current database and shows what changes would be made.

**Response:**
```json
{
  "success": true,
  "message": "Changes preview generated successfully",
  "data": {
    "summary": {
      "totalRows": 1250,
      "updates": 45,
      "inserts": 12,
      "errors": 3
    },
    "details": {
      "updates": [
        {
          "MoPHCode": 12345,
          "changes": {
            "PublicPrice": {
              "from": 25.00,
              "to": 25.50
            },
            "NotMarketed": {
              "from": 1,
              "to": 0
            }
          }
        }
      ],
      "inserts": [
        {
          "MoPHCode": 99999,
          "BrandName": "New Drug",
          "PublicPrice": 15.75,
          "NotMarketed": 0
        }
      ],
      "errors": [
        {
          "row": 5,
          "error": "Missing or invalid MoPHCode",
          "data": {
            "MoPHCode": "",
            "BrandName": "Invalid Entry"
          }
        }
      ]
    }
  }
}
```

#### Get Final Changes
```http
GET /session/{sessionId}/final-changes
```

Compares the working table with the original to show the final state of all changes.

### Change Application

#### Apply Changes
```http
POST /session/{sessionId}/apply
```

Applies the CSV changes to the working table.

**Response:**
```json
{
  "success": true,
  "message": "Changes applied to working table successfully",
  "data": {
    "success": true,
    "updatedCount": 45,
    "insertedCount": 12,
    "totalProcessed": 57
  }
}
```

#### Commit Changes
```http
POST /session/{sessionId}/commit
```

Makes the changes permanent by replacing the original drug table with the working table.

**Response:**
```json
{
  "success": true,
  "message": "Changes committed successfully",
  "data": {
    "success": true,
    "message": "Changes committed successfully",
    "timestamp": "2023-11-05T10:45:30.456Z"
  }
}
```

#### Rollback Changes
```http
POST /session/{sessionId}/rollback
```

Reverts all changes by restoring the original table from backup.

### Cleanup

#### Clean Up Session
```http
DELETE /session/{sessionId}/cleanup
```

Removes all temporary tables and session data.

## CSV File Format

The CSV file should contain drug data with the following supported columns:

### Required Columns
- `MoPHCode`: Unique identifier for the drug (integer)

### Optional Columns
- `BrandName`: Name of the drug brand (string)
- `PublicPrice`: Public price of the drug (decimal)
- `NotMarketed`: Marketing status (0 or 1)
- Any other columns that exist in the drug table

### Example CSV Format

```csv
MoPHCode,BrandName,PublicPrice,NotMarketed
12345,Example Drug A,25.50,0
12346,Example Drug B,15.75,1
12347,Example Drug C,45.00,0
```

### Example TSV Format

```tsv
MoPHCode	BrandName	PublicPrice	NotMarketed
12345	Example Drug A	25.50	0
12346	Example Drug B	15.75	1
12347	Example Drug C	45.00	0
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Common Error Codes

- `400`: Bad Request - Invalid session, missing file, or invalid data
- `500`: Internal Server Error - Database or system errors

### File Upload Errors

- **File too large:** Maximum file size is 50MB
- **Invalid file type:** Only CSV, TSV, and TXT files are allowed
- **No file provided:** The `file` field is required

### Session Errors

- **Invalid session ID:** The provided session ID doesn't exist
- **Session expired:** The session has been cleaned up or expired

## Best Practices

1. **Always initialize a session** before starting any operations
2. **Upload your CSV file** immediately after initialization
3. **Create a backup** before making any changes
4. **Preview changes** to verify the expected modifications
5. **Test with a working copy** before committing
6. **Clean up sessions** when finished to free resources

## Security Considerations

- File uploads are limited to 50MB to prevent abuse
- Only specific file types are allowed
- Session IDs are randomly generated for security
- Temporary tables are automatically cleaned up

## Frontend Integration Example

```javascript
// Frontend workflow example
class DrugUpdateWorkflow {
  async performUpdate(csvFile) {
    try {
      // 1. Initialize session
      const session = await fetch('/api/drug-update/session/initialize', {
        method: 'POST'
      }).then(r => r.json());
      
      const sessionId = session.sessionInfo.sessionId;
      
      // 2. Upload CSV
      const formData = new FormData();
      formData.append('file', csvFile);
      
      await fetch(`/api/drug-update/session/${sessionId}/upload`, {
        method: 'POST',
        body: formData
      });
      
      // 3. Create backup
      await fetch(`/api/drug-update/session/${sessionId}/backup`, {
        method: 'POST'
      });
      
      // 4. Create working copy
      await fetch(`/api/drug-update/session/${sessionId}/working-copy`, {
        method: 'POST'
      });
      
      // 5. Preview changes
      const preview = await fetch(`/api/drug-update/session/${sessionId}/preview`)
        .then(r => r.json());
      
      // Show preview to user...
      
      // 6. Apply changes
      await fetch(`/api/drug-update/session/${sessionId}/apply`, {
        method: 'POST'
      });
      
      // 7. Get final changes
      const finalChanges = await fetch(`/api/drug-update/session/${sessionId}/final-changes`)
        .then(r => r.json());
      
      // Show final changes to user...
      
      // 8. Commit or rollback based on user decision
      const userConfirms = confirm('Commit changes?');
      
      if (userConfirms) {
        await fetch(`/api/drug-update/session/${sessionId}/commit`, {
          method: 'POST'
        });
      } else {
        await fetch(`/api/drug-update/session/${sessionId}/rollback`, {
          method: 'POST'
        });
      }
      
      // 9. Cleanup
      await fetch(`/api/drug-update/session/${sessionId}/cleanup`, {
        method: 'DELETE'
      });
      
    } catch (error) {
      console.error('Update workflow failed:', error);
      // Handle errors appropriately
    }
  }
}
```

This API provides a robust and safe way to update your drug database with comprehensive preview and rollback capabilities.