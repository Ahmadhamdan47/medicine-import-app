# Route and Dosage Cleaning API Documentation

## Overview

This document describes the backend APIs for route and dosage data cleaning operations. These APIs allow bulk cleaning and standardization of drug routes and dosages with preview/commit workflow and rollback capabilities.

## Base URLs

- **Route Cleaning**: `/route-cleaning`
- **Dosage Cleaning**: `/dosage-cleaning`

---

## Route Cleaning APIs

### 1. Get Unique RouteRaw Values

Get all unique `RouteRaw` values with drug counts for cleaning workflow.

**Endpoint**: `GET /route-cleaning/unique-values`

**Query Parameters**:
- `includeNull` (boolean, optional): Include null/empty RouteRaw values
- `minCount` (integer, optional): Minimum drug count to include (default: 1)

**Response**:
```json
{
  "success": true,
  "count": 150,
  "data": [
    {
      "routeRaw": "O",
      "drugCount": 523,
      "sampleRoute": "Oral"
    },
    {
      "routeRaw": "IV",
      "drugCount": 287,
      "sampleRoute": "Intravenous"
    }
  ]
}
```

---

### 2. Suggest Route Matches

Get auto-matching suggestions for a RouteRaw value from routeOptions table.

**Endpoint**: `POST /route-cleaning/suggest-matches`

**Request Body**:
```json
{
  "routeRaw": "O",
  "limit": 3
}
```

**Response**:
```json
{
  "success": true,
  "routeRaw": "O",
  "suggestions": [
    {
      "routeOptionId": 12,
      "acronym": "O",
      "route": "Oral",
      "category": "Enteral",
      "confidence": 100,
      "matchType": "exact_acronym"
    }
  ]
}
```

**Match Types**:
- `exact_acronym`: Exact match on acronym field
- `exact_route`: Exact match on route field
- `starts_acronym`: RouteRaw starts with acronym
- `contains_acronym`: RouteRaw contains acronym
- `fuzzy_acronym`: Fuzzy match on acronym (Levenshtein distance)

---

### 3. Get Affected Drugs

Get list of drugs that have a specific RouteRaw value.

**Endpoint**: `GET /route-cleaning/affected-drugs?routeRaw=O&limit=100`

**Query Parameters**:
- `routeRaw` (string, required): RouteRaw value to query
- `limit` (integer, optional): Maximum records to return (default: 100)

**Response**:
```json
{
  "success": true,
  "routeRaw": "O",
  "count": 523,
  "data": [
    {
      "DrugID": 1001,
      "DrugName": "Paracetamol 500mg",
      "Route": "Oral",
      "RouteRaw": "O",
      "Form": "Tablet",
      "Dosage": "500mg",
      "Manufacturer": "XYZ Pharma"
    }
  ]
}
```

---

### 4. Preview Route Mappings

Preview what will change before applying route mappings.

**Endpoint**: `POST /route-cleaning/preview`

**Request Body**:
```json
{
  "mappings": [
    {
      "routeRaw": "O",
      "newRoute": "Oral"
    },
    {
      "routeRaw": "IV",
      "newRoute": "Intravenous"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "preview": {
    "totalMappings": 2,
    "totalAffectedDrugs": 810,
    "mappingDetails": [
      {
        "routeRaw": "O",
        "newRoute": "Oral",
        "affectedCount": 523,
        "sampleDrugs": [
          {
            "DrugID": 1001,
            "DrugName": "Paracetamol 500mg",
            "Route": "Oral",
            "RouteRaw": "O"
          }
        ]
      }
    ]
  }
}
```

---

### 5. Create Session

Create a new route cleaning session.

**Endpoint**: `POST /route-cleaning/session`

**Request Body**:
```json
{
  "metadata": {
    "description": "Cleaning oral and IV routes"
  }
}
```

**Response**:
```json
{
  "success": true,
  "session": {
    "sessionId": "route_cleaning_1708123456789_abc123xyz",
    "type": "route",
    "status": "initialized",
    "mappings": [],
    "backupFile": null,
    "affectedCount": 0,
    "userId": 1,
    "createdAt": "2026-02-16T10:30:00.000Z",
    "updatedAt": "2026-02-16T10:30:00.000Z",
    "expiresAt": "2026-02-17T10:30:00.000Z"
  }
}
```

---

### 6. Apply Route Mappings

Apply route mappings to drug table (creates backup automatically).

**Endpoint**: `POST /route-cleaning/apply`

**Request Body**:
```json
{
  "sessionId": "route_cleaning_1708123456789_abc123xyz",
  "mappings": [
    {
      "routeRaw": "O",
      "newRoute": "Oral"
    },
    {
      "routeRaw": "IV",
      "newRoute": "Intravenous"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "results": {
    "totalUpdated": 810,
    "mappingResults": [
      {
        "routeRaw": "O",
        "newRoute": "Oral",
        "success": true,
        "updatedCount": 523
      },
      {
        "routeRaw": "IV",
        "newRoute": "Intravenous",
        "success": true,
        "updatedCount": 287
      }
    ]
  }
}
```

---

### 7. Rollback Changes

Rollback route changes using session backup.

**Endpoint**: `POST /route-cleaning/rollback`

**Request Body**:
```json
{
  "sessionId": "route_cleaning_1708123456789_abc123xyz"
}
```

**Response**:
```json
{
  "success": true,
  "result": {
    "success": true,
    "restoredCount": 810,
    "backupFile": "route_cleaning_1708123456789_abc123xyz"
  }
}
```

---

### 8. Get Route Statistics

Get statistics about route data quality.

**Endpoint**: `GET /route-cleaning/stats`

**Response**:
```json
{
  "success": true,
  "stats": {
    "totalDrugs": 15000,
    "drugsWithRoute": 12000,
    "drugsWithRouteRaw": 14000,
    "drugsWithoutRoute": 3000,
    "uniqueRouteRaws": 150,
    "cleanPercentage": "80.00"
  }
}
```

---

## Dosage Cleaning APIs

### 1. Get Unique Dosage Forms

Get unique dosage forms (Form field) with drug counts.

**Endpoint**: `GET /dosage-cleaning/forms?includeNull=false`

**Response**:
```json
{
  "success": true,
  "count": 45,
  "data": [
    {
      "form": "Tablet",
      "drugCount": 3500,
      "matchingDosageOption": {
        "DosageOptionId": 5,
        "DosageFormClean": "Tablet",
        "PhysicalState": "Solid",
        "SubstitutionRelationship": "S1S2S7"
      }
    }
  ]
}
```

---

### 2. Get Dosage Records

Get dosage table records for editing/cleaning.

**Endpoint**: `GET /dosage-cleaning/records?formFilter=Tablet&limit=100&offset=0`

**Query Parameters**:
- `formFilter` (string, optional): Filter by drug Form
- `limit` (integer, optional): Maximum records (default: 100)
- `offset` (integer, optional): Pagination offset (default: 0)

**Response**:
```json
{
  "success": true,
  "records": [
    {
      "DosageId": 1001,
      "DrugId": 5001,
      "Numerator1": 500,
      "Numerator1Unit": "mg",
      "Denominator1": 0,
      "Denominator1Unit": "",
      "Numerator2": null,
      "drug": {
        "DrugID": 5001,
        "DrugName": "Paracetamol",
        "Form": "Tablet",
        "Dosage": "500mg",
        "Route": "Oral"
      },
      "canReconstruct": true,
      "reconstructedDosage": "500mg",
      "currentDrugDosage": "500mg"
    }
  ],
  "total": 3500,
  "hasMore": true,
  "limit": 100,
  "offset": 0
}
```

---

### 3. Update Dosage Record

Update a single dosage table record.

**Endpoint**: `PUT /dosage-cleaning/record/:dosageId`

**Request Body**:
```json
{
  "Numerator1": 500,
  "Numerator1Unit": "mg",
  "Denominator1": 5,
  "Denominator1Unit": "ml",
  "Numerator2": null,
  "Numerator2Unit": null
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "DosageId": 1001,
    "DrugId": 5001,
    "Numerator1": 500,
    "Numerator1Unit": "mg",
    "Denominator1": 5,
    "Denominator1Unit": "ml",
    "UpdatedDate": "2026-02-16T10:45:00.000Z"
  }
}
```

---

### 4. Reconstruct Single Drug Dosage

Reconstruct `drug.Dosage` field from dosage table (reverse of parser).

**Endpoint**: `POST /dosage-cleaning/reconstruct/:drugId`

**Response**:
```json
{
  "success": true,
  "result": {
    "drugId": 5001,
    "oldDosage": "500mg",
    "newDosage": "500mg/5ml",
    "updated": true
  }
}
```

---

### 5. Bulk Reconstruct Dosages

Reconstruct dosages for multiple drugs (creates backup).

**Endpoint**: `POST /dosage-cleaning/bulk-reconstruct`

**Request Body**:
```json
{
  "sessionId": "dosage_cleaning_1708123456789_xyz789abc",
  "drugIds": [5001, 5002, 5003]
}
```

**Response**:
```json
{
  "success": true,
  "results": {
    "totalProcessed": 3,
    "successCount": 3,
    "failureCount": 0,
    "reconstructions": [
      {
        "drugId": 5001,
        "oldDosage": "500mg",
        "newDosage": "500mg/5ml",
        "updated": true,
        "success": true
      }
    ]
  }
}
```

---

### 6. Preview Dosage Changes

Preview what will happen when dosage records are updated and reconstructed.

**Endpoint**: `POST /dosage-cleaning/preview`

**Request Body**:
```json
{
  "updates": [
    {
      "dosageId": 1001,
      "Numerator1": 500,
      "Numerator1Unit": "mg",
      "Denominator1": 5,
      "Denominator1Unit": "ml"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "previews": [
    {
      "dosageId": 1001,
      "drugId": 5001,
      "drugName": "Paracetamol Suspension",
      "currentDrugDosage": "500mg",
      "currentReconstructed": "500mg",
      "newReconstructed": "500mg/5ml",
      "willChange": true,
      "canReconstruct": true,
      "updates": {
        "Numerator1": 500,
        "Numerator1Unit": "mg",
        "Denominator1": 5,
        "Denominator1Unit": "ml"
      }
    }
  ]
}
```

---

### 7. Suggest Dosage Form Match

Get suggestions from dosageOptions table for a Form value.

**Endpoint**: `POST /dosage-cleaning/suggest-form`

**Request Body**:
```json
{
  "form": "Tab",
  "limit": 3
}
```

**Response**:
```json
{
  "success": true,
  "form": "Tab",
  "suggestions": [
    {
      "DosageOptionId": 5,
      "DosageFormClean": "Tablet",
      "PhysicalState": "Solid",
      "SubstitutionRelationship": "S1S2S7",
      "confidence": 90
    }
  ]
}
```

---

### 8. Get Dosage Statistics

Get statistics about dosage data quality.

**Endpoint**: `GET /dosage-cleaning/stats`

**Response**:
```json
{
  "success": true,
  "stats": {
    "totalDrugs": 15000,
    "drugsWithDosage": 12000,
    "drugsWithoutDosage": 3000,
    "totalDosageRecords": 11500,
    "drugsWithDosageRecords": 11500,
    "drugsWithoutDosageRecords": 3500,
    "dosageFieldPopulation": "80.00",
    "structuredDosagePopulation": "76.67"
  }
}
```

---

## Session Management

Both route and dosage cleaning share the same session management endpoints.

### Get Session Info

**Endpoint**: `GET /route-cleaning/session/:sessionId` or `GET /dosage-cleaning/session/:sessionId`

**Response**:
```json
{
  "success": true,
  "session": {
    "sessionId": "route_cleaning_1708123456789_abc123xyz",
    "type": "route",
    "status": "applied",
    "mappings": [...],
    "backupFile": "/path/to/backup.json",
    "affectedCount": 810,
    "userId": 1,
    "createdAt": "2026-02-16T10:30:00.000Z",
    "updatedAt": "2026-02-16T10:45:00.000Z",
    "expiresAt": "2026-02-17T10:30:00.000Z"
  }
}
```

### Clear Session

**Endpoint**: `DELETE /route-cleaning/session/:sessionId` or `DELETE /dosage-cleaning/session/:sessionId`

**Response**:
```json
{
  "success": true,
  "message": "Session cleared successfully"
}
```

---

## Session Status Flow

1. **initialized** - Session created, no mappings yet
2. **mapped** - Mappings defined, not yet applied
3. **previewed** - Preview generated
4. **applied** - Changes applied to database (backup created)
5. **committed** - Changes finalized (optional status)
6. **rolled_back** - Changes reverted from backup

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**Common HTTP Status Codes**:
- `200` - Success
- `400` - Bad request (missing/invalid parameters)
- `404` - Resource not found (session, record)
- `500` - Server error

---

## Workflow Examples

### Route Cleaning Workflow

```javascript
// 1. Create session
const sessionRes = await fetch('/route-cleaning/session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ metadata: { task: 'Clean routes' } })
});
const { session } = await sessionRes.json();

// 2. Get unique RouteRaw values
const uniqueRes = await fetch('/route-cleaning/unique-values?minCount=10');
const { data: uniqueValues } = await uniqueRes.json();

// 3. Get suggestions for each RouteRaw
const mappings = [];
for (const item of uniqueValues) {
  const suggestRes = await fetch('/route-cleaning/suggest-matches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ routeRaw: item.routeRaw, limit: 1 })
  });
  const { suggestions } = await suggestRes.json();
  
  if (suggestions.length > 0 && suggestions[0].confidence > 80) {
    mappings.push({
      routeRaw: item.routeRaw,
      newRoute: suggestions[0].route
    });
  }
}

// 4. Preview changes
const previewRes = await fetch('/route-cleaning/preview', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ mappings })
});
const { preview } = await previewRes.json();
console.log(`Will affect ${preview.totalAffectedDrugs} drugs`);

// 5. Apply changes
const applyRes = await fetch('/route-cleaning/apply', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sessionId: session.sessionId, mappings })
});
const { results } = await applyRes.json();
console.log(`Updated ${results.totalUpdated} drugs`);

// 6. Optional: Rollback if needed
// await fetch('/route-cleaning/rollback', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ sessionId: session.sessionId })
// });
```

### Dosage Cleaning Workflow

```javascript
// 1. Create session
const sessionRes = await fetch('/dosage-cleaning/session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
});
const { session } = await sessionRes.json();

// 2. Get dosage records for a specific form
const recordsRes = await fetch('/dosage-cleaning/records?formFilter=Tablet&limit=10');
const { records } = await recordsRes.json();

// 3. Update specific dosage records (user edits in UI)
const updateRes = await fetch(`/dosage-cleaning/record/${records[0].DosageId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    Numerator1: 500,
    Numerator1Unit: 'mg',
    Denominator1: 5,
    Denominator1Unit: 'ml'
  })
});

// 4. Bulk reconstruct drug.Dosage fields
const drugIds = records.map(r => r.DrugId);
const reconstructRes = await fetch('/dosage-cleaning/bulk-reconstruct', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sessionId: session.sessionId, drugIds })
});
const { results } = await reconstructRes.json();
console.log(`Reconstructed ${results.successCount} dosages`);
```

---

## Database Setup

Before using the APIs, run the database migration to create performance indexes:

```bash
node scripts/addCleaningIndexes.js
```

This script adds the following indexes:
- `idx_drug_routeraw` on `drug(RouteRaw)`
- `idx_drug_form` on `drug(Form)`
- `idx_dosage_drugid` on `dosage(DrugId)`
- `idx_drug_route` on `drug(Route)`
- `idx_drug_dosage` on `drug(Dosage)`

---

## Notes

- **Sessions expire after 24 hours**
- **Backup files** are stored in `/db/` folder with format: `{type}_cleaning_backup_{sessionId}_{timestamp}.json`
- **Auto-cleanup** runs every hour to remove expired sessions
- **Fuzzy matching** uses Levenshtein distance with 40% tolerance
- **Transaction safety**: All database updates use transactions and rollback on error
- **Dosage reconstruction** uses the `dosageParser.js` utility for consistent formatting
