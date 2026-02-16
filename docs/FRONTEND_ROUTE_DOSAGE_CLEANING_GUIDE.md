# Frontend Implementation Guide: Route & Dosage Cleaning

## 📋 Overview

This document provides a complete frontend implementation plan for the **Route and Dosage Cleaning** features. These features allow users to:

1. **Route Cleaning**: Standardize and clean raw route values (e.g., "O" → "Oral")
2. **Dosage Cleaning**: Edit structured dosage data and reconstruct dosage strings

Both features follow a **preview-commit-rollback** workflow with auto-matching suggestions.

---

## 🎯 Use Cases

### Route Cleaning Use Case
**Problem**: The `RouteRaw` field in the drug table contains inconsistent, abbreviated, or misspelled values:
- "O", "Oral", "oral", "ORAL"
- "IV", "I.V.", "Intravenous"
- "Top", "Topical"

**Solution**: Users can:
1. View all unique `RouteRaw` values with drug counts
2. Get AI suggestions from the `routeOptions` table (with confidence scores)
3. Map multiple `RouteRaw` values to standardized `Route` values
4. Preview changes before applying
5. Apply changes in bulk (with automatic backup)
6. Rollback if needed

### Dosage Cleaning Use Case
**Problem**: 
- The `drug.Dosage` field is a free-text string (e.g., "500mg", "5mg/ml")
- The structured `dosage` table has separate fields (Numerator1, Denominator1, etc.)
- These two sources may be out of sync

**Solution**: Users can:
1. View dosage records from the `dosage` table
2. Edit individual dosage records (structured fields)
3. Reconstruct the `drug.Dosage` field from structured data (reverse of parsing)
4. Preview what the reconstructed dosage will look like
5. Apply changes in bulk (with automatic backup)
6. Rollback if needed

---

## 🎨 UI Workflows

### Route Cleaning Workflow

#### Step 1: Dashboard View
```
┌─────────────────────────────────────────────────────┐
│  Route Cleaning Dashboard                           │
├─────────────────────────────────────────────────────┤
│  Statistics:                                         │
│  ✓ Total Drugs: 15,000                             │
│  ✓ Drugs with Routes: 12,000 (80%)                 │
│  ⚠ Drugs without Routes: 3,000 (20%)               │
│  📊 Unique RouteRaw Values: 150                     │
│                                                      │
│  [Start New Cleaning Session]                       │
└─────────────────────────────────────────────────────┘
```

**API**: `GET /route-cleaning/stats`

#### Step 2: Unique RouteRaw Values Table
```
┌─────────────────────────────────────────────────────────────────────┐
│  Unique RouteRaw Values                              [Export] [Help] │
├──────────────┬──────────┬─────────────┬──────────────────────────────┤
│ RouteRaw     │ Count    │ Sample Route│ Action                      │
├──────────────┼──────────┼─────────────┼──────────────────────────────┤
│ O            │ 523      │ Oral        │ [Map] [View Drugs] [Ignore] │
│ IV           │ 287      │ Intravenous │ [Map] [View Drugs] [Ignore] │
│ Oral+Top     │ 45       │ Oral        │ [Map] [View Drugs] [Ignore] │
│ I.M.         │ 23       │ -           │ [Map] [View Drugs] [Ignore] │
│ (empty)      │ 15       │ -           │ [Map] [View Drugs] [Ignore] │
└──────────────┴──────────┴─────────────┴──────────────────────────────┘

Filters: [Min Count: 1] [Include Empty: ☐]
[Auto-Match All] [Map Selected]
```

**APIs**: 
- `GET /route-cleaning/unique-values?minCount=1&includeNull=false`
- `GET /route-cleaning/affected-drugs?routeRaw=O&limit=100`

#### Step 3: Mapping Dialog (Auto-Suggest)
```
┌────────────────────────────────────────────────────┐
│  Map RouteRaw: "O"                          [×]    │
├────────────────────────────────────────────────────┤
│  Affects 523 drugs                                 │
│                                                     │
│  AI Suggestions: (Click to select)                │
│                                                     │
│  ✓ Oral                                           │
│    Confidence: 100% (Exact Acronym Match)         │
│    Category: Enteral                              │
│    [Select This]                                  │
│                                                     │
│  □ Other Options:                                 │
│    Dropdown: [Select from routeOptions...     ▼]  │
│                                                     │
│  Or enter manually:                               │
│  [_________________________________]               │
│                                                     │
│  Preview drugs: [Show Sample Drugs]               │
│                                                     │
│  [Cancel] [Confirm Mapping]                       │
└────────────────────────────────────────────────────┘
```

**API**: `POST /route-cleaning/suggest-matches`
```json
{
  "routeRaw": "O",
  "limit": 3
}
```

#### Step 4: Mapping Summary (Before Preview)
```
┌────────────────────────────────────────────────────────────┐
│  Route Mappings Summary                                    │
├────────────────┬──────────────┬──────────┬────────────────┤
│ RouteRaw       │ New Route    │ Count    │ Actions        │
├────────────────┼──────────────┼──────────┼────────────────┤
│ O              │ → Oral       │ 523      │ [Edit] [Remove]│
│ IV             │ → Intravenous│ 287      │ [Edit] [Remove]│
│ Oral+Top       │ → Oral       │ 45       │ [Edit] [Remove]│
├────────────────┴──────────────┴──────────┴────────────────┤
│ Total Affected Drugs: 855                                  │
│                                                             │
│ [Add More Mappings] [Clear All] [Preview Changes]         │
└────────────────────────────────────────────────────────────┘
```

#### Step 5: Preview Changes
```
┌────────────────────────────────────────────────────────────┐
│  Preview Route Changes                                      │
├────────────────────────────────────────────────────────────┤
│  ⚠ This will update 855 drugs across 3 mappings           │
│  🔒 Automatic backup will be created before applying       │
│                                                             │
│  Mapping Details:                                          │
│                                                             │
│  ▼ O → Oral (523 drugs)                                    │
│    Sample Drugs:                                           │
│    • Paracetamol 500mg Tablet                             │
│    • Ibuprofen 200mg Capsule                              │
│    • Amoxicillin 250mg Tablet                             │
│    [Show All 523 Drugs]                                   │
│                                                             │
│  ▼ IV → Intravenous (287 drugs)                           │
│    Sample Drugs:                                           │
│    • Normal Saline 0.9% 1000ml                            │
│    • Ceftriaxone 1g Vial                                  │
│    [Show All 287 Drugs]                                   │
│                                                             │
│  [Back to Edit] [Apply Changes]                           │
└────────────────────────────────────────────────────────────┘
```

**API**: `POST /route-cleaning/preview`
```json
{
  "mappings": [
    { "routeRaw": "O", "newRoute": "Oral" },
    { "routeRaw": "IV", "newRoute": "Intravenous" }
  ]
}
```

#### Step 6: Apply Changes Confirmation
```
┌────────────────────────────────────────────────────────────┐
│  ✅ Changes Applied Successfully!                          │
├────────────────────────────────────────────────────────────┤
│  Results:                                                   │
│  • Total Updated: 855 drugs                                │
│  • Successful: 855                                         │
│  • Failed: 0                                               │
│                                                             │
│  Backup Created:                                           │
│  📁 route_cleaning_backup_abc123_1708123456.json          │
│                                                             │
│  Session ID: route_cleaning_1708123456789_abc123xyz       │
│  Session expires: Feb 17, 2026 10:30 AM                   │
│                                                             │
│  [Rollback Changes] [View Updated Drugs] [Close]          │
└────────────────────────────────────────────────────────────┘
```

**API**: `POST /route-cleaning/apply`
```json
{
  "sessionId": "route_cleaning_1708123456789_abc123xyz",
  "mappings": [
    { "routeRaw": "O", "newRoute": "Oral" },
    { "routeRaw": "IV", "newRoute": "Intravenous" }
  ]
}
```

#### Step 7: Rollback (If Needed)
```
┌────────────────────────────────────────────────────────────┐
│  ⚠ Rollback Route Changes                                  │
├────────────────────────────────────────────────────────────┤
│  This will revert 855 drugs to their previous Route values │
│                                                             │
│  Session: route_cleaning_1708123456789_abc123xyz          │
│  Applied: Feb 16, 2026 10:45 AM                           │
│  Backup: route_cleaning_backup_abc123_1708123456.json     │
│                                                             │
│  Are you sure you want to rollback?                       │
│                                                             │
│  [Cancel] [Yes, Rollback]                                 │
└────────────────────────────────────────────────────────────┘
```

**API**: `POST /route-cleaning/rollback`
```json
{
  "sessionId": "route_cleaning_1708123456789_abc123xyz"
}
```

---

### Dosage Cleaning Workflow

#### Step 1: Dashboard View
```
┌─────────────────────────────────────────────────────┐
│  Dosage Cleaning Dashboard                          │
├─────────────────────────────────────────────────────┤
│  Statistics:                                         │
│  ✓ Total Drugs: 15,000                             │
│  ✓ Drugs with Dosage Field: 12,000 (80%)          │
│  ✓ Drugs with Dosage Records: 11,500 (76.67%)     │
│  ⚠ Drugs without Dosage: 3,000 (20%)              │
│                                                      │
│  [Start Dosage Cleaning]                            │
└─────────────────────────────────────────────────────┘
```

**API**: `GET /dosage-cleaning/stats`

#### Step 2: Filter by Form
```
┌─────────────────────────────────────────────────────────────────────┐
│  Select Dosage Form to Clean                                        │
├──────────────┬──────────┬─────────────────┬───────────────────────┤
│ Form         │ Count    │ Dosage Option   │ Action                │
├──────────────┼──────────┼─────────────────┼───────────────────────┤
│ Tablet       │ 3,500    │ ✓ Tablet (S1S2) │ [Clean]               │
│ Capsule      │ 2,100    │ ✓ Capsule       │ [Clean]               │
│ Syrup        │ 1,800    │ ✓ Syrup         │ [Clean]               │
│ Injection    │ 1,500    │ ✓ Injection     │ [Clean]               │
│ Tab          │ 45       │ → Tablet?       │ [Map Form] [Clean]    │
│ (unknown)    │ 23       │ ⚠ Not Matched   │ [Map Form]            │
└──────────────┴──────────┴─────────────────┴───────────────────────┘

[Filter by...] [Export]
```

**API**: `GET /dosage-cleaning/forms?includeNull=false`

#### Step 3: Dosage Records Table (Editable)
```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  Dosage Records: Tablet (Showing 10 of 3,500)            [← Prev] [Next →] Page 1/350│
├────────┬─────────────────┬────────────┬───────────────┬─────────────┬────────────────┤
│ Drug   │ Num1   Unit1    │ Den1 Unit1 │ Num2    Unit2 │ Current     │ Reconstructed │
├────────┼─────────────────┼────────────┼───────────────┼─────────────┼────────────────┤
│ Para-  │ [500]  [mg  ▼]  │ [0]  [▼]   │ [-]  [-  ▼]   │ 500mg       │ ✓ 500mg        │
│ cetamol│                 │            │               │             │ [Edit]         │
├────────┼─────────────────┼────────────┼───────────────┼─────────────┼────────────────┤
│ Ibu-   │ [200]  [mg  ▼]  │ [0]  [▼]   │ [-]  [-  ▼]   │ 200mg       │ ✓ 200mg        │
│ profen │                 │            │               │             │ [Edit]         │
├────────┼─────────────────┼────────────┼───────────────┼─────────────┼────────────────┤
│ Amoxi- │ [250]  [mg  ▼]  │ [5]  [ml▼] │ [-]  [-  ▼]   │ 250mg       │ ⚠ 250mg/5ml    │
│ cillin │                 │            │               │             │ [Reconstruct]  │
├────────┼─────────────────┼────────────┼───────────────┼─────────────┼────────────────┤
│ Cef-   │ [1000] [mg  ▼]  │ [10] [ml▼] │ [-]  [-  ▼]   │ 1g/10ml     │ ⚠ 1000mg/10ml  │
│ triax. │                 │            │               │             │ [Reconstruct]  │
└────────┴─────────────────┴────────────┴───────────────┴─────────────┴────────────────┘

Legend:
✓ = Dosage field matches reconstructed value
⚠ = Dosage field differs from reconstructed value (out of sync)

[Bulk Edit Selected] [Reconstruct All] [Preview Changes] [Export]
```

**APIs**:
- `GET /dosage-cleaning/records?formFilter=Tablet&limit=10&offset=0`
- `PUT /dosage-cleaning/record/:dosageId` (when user edits a field)

#### Step 4: Edit Single Dosage Record
```
┌────────────────────────────────────────────────────┐
│  Edit Dosage: Paracetamol 500mg Tablet     [×]    │
├────────────────────────────────────────────────────┤
│  Drug ID: 5001                                     │
│  Drug Name: Paracetamol 500mg Tablet              │
│  Current Dosage Field: "500mg"                    │
│                                                     │
│  Component 1: (Required)                          │
│  Numerator:   [500    ] Unit: [mg    ▼]          │
│  Denominator: [0      ] Unit: [      ▼]          │
│                                                     │
│  Component 2: (Optional)                          │
│  Numerator:   [       ] Unit: [      ▼]          │
│  Denominator: [       ] Unit: [      ▼]          │
│                                                     │
│  Component 3: (Optional)                          │
│  Numerator:   [       ] Unit: [      ▼]          │
│  Denominator: [       ] Unit: [      ▼]          │
│                                                     │
│  Preview Reconstructed Dosage:                    │
│  🔍 "500mg"                                       │
│                                                     │
│  ☐ Update drug.Dosage field after saving         │
│                                                     │
│  [Cancel] [Save] [Save & Reconstruct]             │
└────────────────────────────────────────────────────┘
```

**APIs**:
- `PUT /dosage-cleaning/record/:dosageId` - Update dosage record
- `POST /dosage-cleaning/reconstruct/:drugId` - Reconstruct drug.Dosage

#### Step 5: Preview Reconstruction
```
┌────────────────────────────────────────────────────────────┐
│  Preview Dosage Reconstruction                              │
├────────────────────────────────────────────────────────────┤
│  Selected 3 drugs for reconstruction                       │
│                                                             │
│  Changes Preview:                                          │
│                                                             │
│  ▼ Paracetamol 500mg Tablet                               │
│    Current:         500mg                                 │
│    Reconstructed:   500mg                                 │
│    Status:          ✓ No change                           │
│                                                             │
│  ▼ Amoxicillin Suspension                                 │
│    Current:         250mg                                 │
│    Reconstructed:   250mg/5ml                             │
│    Status:          ⚠ Will be updated                     │
│                                                             │
│  ▼ Ceftriaxone Injection                                  │
│    Current:         1g/10ml                               │
│    Reconstructed:   1000mg/10ml                           │
│    Status:          ⚠ Will be updated                     │
│                                                             │
│  Summary: 2 will change, 1 unchanged                      │
│                                                             │
│  [Back] [Apply Reconstruction]                            │
└────────────────────────────────────────────────────────────┘
```

**API**: `POST /dosage-cleaning/preview`
```json
{
  "updates": [
    {
      "dosageId": 1001,
      "Numerator1": 500,
      "Numerator1Unit": "mg"
    }
  ]
}
```

#### Step 6: Bulk Reconstruct
```
┌────────────────────────────────────────────────────────────┐
│  ✅ Bulk Reconstruction Complete!                          │
├────────────────────────────────────────────────────────────┤
│  Results:                                                   │
│  • Total Processed: 3                                      │
│  • Successfully Reconstructed: 2                           │
│  • Skipped (No Change): 1                                  │
│  • Failed: 0                                               │
│                                                             │
│  Backup Created:                                           │
│  📁 dosage_cleaning_backup_xyz789_1708123456.json         │
│                                                             │
│  Session ID: dosage_cleaning_1708123456789_xyz789abc      │
│  Session expires: Feb 17, 2026 11:00 AM                   │
│                                                             │
│  [Rollback Changes] [View Updated Drugs] [Continue]       │
└────────────────────────────────────────────────────────────┘
```

**API**: `POST /dosage-cleaning/bulk-reconstruct`
```json
{
  "sessionId": "dosage_cleaning_1708123456789_xyz789abc",
  "drugIds": [5001, 5002, 5003]
}
```

---

## 🔧 Implementation Steps

### 1. Setup & Configuration

#### Install HTTP Client (if not already present)
```bash
npm install axios
# or use fetch API (built-in in modern browsers/Node 18+)
```

#### Configure API Base URL
```javascript
// config/api.js
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8066';

export const ROUTE_CLEANING_BASE = `${API_BASE_URL}/route-cleaning`;
export const DOSAGE_CLEANING_BASE = `${API_BASE_URL}/dosage-cleaning`;
```

### 2. API Service Layer

Create a service file for route and dosage cleaning:

```javascript
// services/routeCleaningService.js
import axios from 'axios';
import { ROUTE_CLEANING_BASE } from '../config/api';

export const routeCleaningService = {
  // Get statistics
  async getStats() {
    const response = await axios.get(`${ROUTE_CLEANING_BASE}/stats`);
    return response.data;
  },

  // Get unique RouteRaw values
  async getUniqueValues(params = {}) {
    const { includeNull = false, minCount = 1 } = params;
    const response = await axios.get(`${ROUTE_CLEANING_BASE}/unique-values`, {
      params: { includeNull, minCount }
    });
    return response.data;
  },

  // Get suggestions for a RouteRaw value
  async getSuggestions(routeRaw, limit = 3) {
    const response = await axios.post(`${ROUTE_CLEANING_BASE}/suggest-matches`, {
      routeRaw,
      limit
    });
    return response.data;
  },

  // Get affected drugs for a RouteRaw
  async getAffectedDrugs(routeRaw, limit = 100) {
    const response = await axios.get(`${ROUTE_CLEANING_BASE}/affected-drugs`, {
      params: { routeRaw, limit }
    });
    return response.data;
  },

  // Preview route mappings
  async previewMappings(mappings) {
    const response = await axios.post(`${ROUTE_CLEANING_BASE}/preview`, {
      mappings
    });
    return response.data;
  },

  // Create a new session
  async createSession(metadata = {}) {
    const response = await axios.post(`${ROUTE_CLEANING_BASE}/session`, {
      metadata
    });
    return response.data;
  },

  // Get session info
  async getSession(sessionId) {
    const response = await axios.get(`${ROUTE_CLEANING_BASE}/session/${sessionId}`);
    return response.data;
  },

  // Apply route mappings
  async applyMappings(sessionId, mappings) {
    const response = await axios.post(`${ROUTE_CLEANING_BASE}/apply`, {
      sessionId,
      mappings
    });
    return response.data;
  },

  // Rollback changes
  async rollback(sessionId) {
    const response = await axios.post(`${ROUTE_CLEANING_BASE}/rollback`, {
      sessionId
    });
    return response.data;
  },

  // Clear session
  async clearSession(sessionId) {
    const response = await axios.delete(`${ROUTE_CLEANING_BASE}/session/${sessionId}`);
    return response.data;
  }
};
```

```javascript
// services/dosageCleaningService.js
import axios from 'axios';
import { DOSAGE_CLEANING_BASE } from '../config/api';

export const dosageCleaningService = {
  // Get statistics
  async getStats() {
    const response = await axios.get(`${DOSAGE_CLEANING_BASE}/stats`);
    return response.data;
  },

  // Get unique forms
  async getForms(includeNull = false) {
    const response = await axios.get(`${DOSAGE_CLEANING_BASE}/forms`, {
      params: { includeNull }
    });
    return response.data;
  },

  // Get dosage records
  async getRecords(params = {}) {
    const { formFilter, limit = 100, offset = 0 } = params;
    const response = await axios.get(`${DOSAGE_CLEANING_BASE}/records`, {
      params: { formFilter, limit, offset }
    });
    return response.data;
  },

  // Update a dosage record
  async updateRecord(dosageId, updates) {
    const response = await axios.put(`${DOSAGE_CLEANING_BASE}/record/${dosageId}`, updates);
    return response.data;
  },

  // Reconstruct single drug dosage
  async reconstructDosage(drugId) {
    const response = await axios.post(`${DOSAGE_CLEANING_BASE}/reconstruct/${drugId}`);
    return response.data;
  },

  // Bulk reconstruct dosages
  async bulkReconstruct(sessionId, drugIds) {
    const response = await axios.post(`${DOSAGE_CLEANING_BASE}/bulk-reconstruct`, {
      sessionId,
      drugIds
    });
    return response.data;
  },

  // Preview dosage changes
  async previewChanges(updates) {
    const response = await axios.post(`${DOSAGE_CLEANING_BASE}/preview`, {
      updates
    });
    return response.data;
  },

  // Rollback changes
  async rollback(sessionId) {
    const response = await axios.post(`${DOSAGE_CLEANING_BASE}/rollback`, {
      sessionId
    });
    return response.data;
  },

  // Create session
  async createSession(metadata = {}) {
    const response = await axios.post(`${DOSAGE_CLEANING_BASE}/session`, {
      metadata
    });
    return response.data;
  },

  // Get session
  async getSession(sessionId) {
    const response = await axios.get(`${DOSAGE_CLEANING_BASE}/session/${sessionId}`);
    return response.data;
  },

  // Clear session
  async clearSession(sessionId) {
    const response = await axios.delete(`${DOSAGE_CLEANING_BASE}/session/${sessionId}`);
    return response.data;
  },

  // Suggest form match
  async suggestFormMatch(form, limit = 3) {
    const response = await axios.post(`${DOSAGE_CLEANING_BASE}/suggest-form`, {
      form,
      limit
    });
    return response.data;
  }
};
```

### 3. State Management (Example with React Context)

```javascript
// context/RouteCleaningContext.js
import React, { createContext, useContext, useState } from 'react';
import { routeCleaningService } from '../services/routeCleaningService';

const RouteCleaningContext = createContext();

export const useRouteCleaning = () => {
  const context = useContext(RouteCleaningContext);
  if (!context) {
    throw new Error('useRouteCleaning must be used within RouteCleaningProvider');
  }
  return context;
};

export const RouteCleaningProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [mappings, setMappings] = useState([]);
  const [uniqueValues, setUniqueValues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await routeCleaningService.getStats();
      setStats(data.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUniqueValues = async (params) => {
    try {
      setLoading(true);
      const data = await routeCleaningService.getUniqueValues(params);
      setUniqueValues(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMapping = (routeRaw, newRoute) => {
    setMappings(prev => [...prev, { routeRaw, newRoute }]);
  };

  const removeMapping = (routeRaw) => {
    setMappings(prev => prev.filter(m => m.routeRaw !== routeRaw));
  };

  const clearMappings = () => {
    setMappings([]);
  };

  const startSession = async (metadata = {}) => {
    try {
      setLoading(true);
      const data = await routeCleaningService.createSession(metadata);
      setSession(data.session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const previewMappings = async () => {
    try {
      setLoading(true);
      const data = await routeCleaningService.previewMappings(mappings);
      return data.preview;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyMappings = async () => {
    try {
      setLoading(true);
      const data = await routeCleaningService.applyMappings(session.sessionId, mappings);
      return data.results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rollback = async () => {
    try {
      setLoading(true);
      const data = await routeCleaningService.rollback(session.sessionId);
      return data.result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteCleaningContext.Provider
      value={{
        session,
        mappings,
        uniqueValues,
        stats,
        loading,
        error,
        loadStats,
        loadUniqueValues,
        addMapping,
        removeMapping,
        clearMappings,
        startSession,
        previewMappings,
        applyMappings,
        rollback
      }}
    >
      {children}
    </RouteCleaningContext.Provider>
  );
};
```

### 4. Component Structure

```
src/
├── components/
│   ├── route-cleaning/
│   │   ├── RouteCleaningDashboard.jsx
│   │   ├── UniqueValuesTable.jsx
│   │   ├── MappingDialog.jsx
│   │   ├── MappingSummary.jsx
│   │   ├── PreviewDialog.jsx
│   │   ├── ApplyConfirmation.jsx
│   │   └── RollbackDialog.jsx
│   │
│   └── dosage-cleaning/
│       ├── DosageCleaningDashboard.jsx
│       ├── FormSelector.jsx
│       ├── DosageRecordsTable.jsx
│       ├── EditDosageDialog.jsx
│       ├── PreviewReconstructionDialog.jsx
│       └── BulkReconstructConfirmation.jsx
│
├── services/
│   ├── routeCleaningService.js
│   └── dosageCleaningService.js
│
├── context/
│   ├── RouteCleaningContext.js
│   └── DosageCleaningContext.js
│
└── config/
    └── api.js
```

### 5. Example: Route Cleaning Dashboard Component

```javascript
// components/route-cleaning/RouteCleaningDashboard.jsx
import React, { useEffect } from 'react';
import { useRouteCleaning } from '../../context/RouteCleaningContext';
import { Alert, Card, Statistic, Button, Spin } from 'antd'; // Example with Ant Design

const RouteCleaningDashboard = () => {
  const { stats, loading, error, loadStats, startSession } = useRouteCleaning();

  useEffect(() => {
    loadStats();
  }, []);

  const handleStartSession = async () => {
    await startSession({ description: 'Route cleaning session' });
    // Navigate to next step
  };

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" />;
  if (!stats) return null;

  return (
    <div className="route-cleaning-dashboard">
      <h1>Route Cleaning Dashboard</h1>

      <div className="stats-grid">
        <Card>
          <Statistic 
            title="Total Drugs" 
            value={stats.totalDrugs}
          />
        </Card>

        <Card>
          <Statistic 
            title="Drugs with Routes" 
            value={stats.drugsWithRoute}
            suffix={`(${stats.cleanPercentage}%)`}
          />
        </Card>

        <Card>
          <Statistic 
            title="Drugs without Routes" 
            value={stats.drugsWithoutRoute}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>

        <Card>
          <Statistic 
            title="Unique RouteRaw Values" 
            value={stats.uniqueRouteRaws}
          />
        </Card>
      </div>

      <Button 
        type="primary" 
        size="large" 
        onClick={handleStartSession}
        style={{ marginTop: 24 }}
      >
        Start New Cleaning Session
      </Button>
    </div>
  );
};

export default RouteCleaningDashboard;
```

---

## 📡 Complete API Reference

For detailed API documentation, see: **[docs/route-dosage-cleaning-api.md](./route-dosage-cleaning-api.md)**

### Quick Reference

#### Route Cleaning Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/route-cleaning/stats` | Get statistics |
| GET | `/route-cleaning/unique-values` | Get unique RouteRaw values |
| POST | `/route-cleaning/suggest-matches` | Get AI suggestions |
| GET | `/route-cleaning/affected-drugs` | Get affected drugs list |
| POST | `/route-cleaning/preview` | Preview mappings |
| POST | `/route-cleaning/session` | Create session |
| GET | `/route-cleaning/session/:id` | Get session info |
| POST | `/route-cleaning/apply` | Apply mappings |
| POST | `/route-cleaning/rollback` | Rollback changes |
| DELETE | `/route-cleaning/session/:id` | Clear session |

#### Dosage Cleaning Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/dosage-cleaning/stats` | Get statistics |
| GET | `/dosage-cleaning/forms` | Get unique forms |
| GET | `/dosage-cleaning/records` | Get dosage records |
| PUT | `/dosage-cleaning/record/:id` | Update dosage record |
| POST | `/dosage-cleaning/reconstruct/:drugId` | Reconstruct single |
| POST | `/dosage-cleaning/bulk-reconstruct` | Bulk reconstruct |
| POST | `/dosage-cleaning/preview` | Preview changes |
| POST | `/dosage-cleaning/suggest-form` | Get form suggestions |
| POST | `/dosage-cleaning/session` | Create session |
| GET | `/dosage-cleaning/session/:id` | Get session info |
| POST | `/dosage-cleaning/rollback` | Rollback changes |
| DELETE | `/dosage-cleaning/session/:id` | Clear session |

---

## 🎨 UI Component Recommendations

### Component Library Options

1. **Ant Design** (Recommended)
   - Table, Form, Modal, Button, Alert, Statistic
   - Good for data-heavy applications
   - https://ant.design

2. **Material-UI (MUI)**
   - DataGrid, Dialog, TextField, Button
   - Modern design system
   - https://mui.com

3. **Chakra UI**
   - Lightweight and flexible
   - Good accessibility
   - https://chakra-ui.com

### Key Components Needed

1. **Data Tables** - Display unique values, dosage records
2. **Modals/Dialogs** - Mapping, preview, confirmation
3. **Forms** - Edit dosage records, input mappings
4. **Statistics Cards** - Dashboard overview
5. **Alerts/Notifications** - Success/error messages
6. **Loading Spinners** - API call feedback
7. **Badges** - Confidence scores, match types
8. **Tooltips** - Help text, explanations

---

## 🔐 Authentication & Authorization

Add authentication headers to all API calls:

```javascript
// services/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8066'
});

// Add authentication token to all requests
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Handle authentication errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## 🧪 Testing Considerations

### Unit Tests
- Test each service function independently
- Mock API responses
- Test error handling

### Integration Tests
- Test complete workflows (start session → apply → rollback)
- Test API integration
- Test state management

### E2E Tests (Cypress/Playwright)
- Test complete user journeys
- Test form submissions
- Test navigation between steps

---

## 📊 Data Visualization Ideas

### Route Cleaning
- **Pie chart**: Distribution of RouteRaw values
- **Bar chart**: Top 10 most common RouteRaw values
- **Progress indicator**: Percentage of cleaned routes

### Dosage Cleaning
- **Bar chart**: Dosage records by form type
- **Comparison chart**: Current vs reconstructed dosages
- **Status badges**: Sync status indicators

---

## ⚡ Performance Optimization

### Pagination
- Use `limit` and `offset` parameters for large datasets
- Implement virtual scrolling for tables with 1000+ rows

### Debouncing
- Debounce search/filter inputs (300ms)
- Debounce auto-suggest API calls

### Caching
- Cache statistics data (refresh every 5 minutes)
- Cache unique values list
- Use React Query or SWR for smart caching

### Loading States
- Show skeleton screens during initial load
- Use optimistic updates for better UX
- Show progress bars for bulk operations

---

## 🐛 Error Handling

### API Error Handling
```javascript
try {
  const result = await routeCleaningService.applyMappings(sessionId, mappings);
  // Success
  showSuccessNotification('Changes applied successfully!');
} catch (error) {
  // Error
  if (error.response?.status === 400) {
    showErrorNotification('Invalid request. Please check your inputs.');
  } else if (error.response?.status === 404) {
    showErrorNotification('Session not found or expired.');
  } else {
    showErrorNotification('An unexpected error occurred. Please try again.');
  }
  console.error('Apply mappings error:', error);
}
```

### User-Friendly Error Messages
- **400 Bad Request**: "Please check your input and try again."
- **404 Not Found**: "The session has expired. Please start a new session."
- **500 Server Error**: "Something went wrong on our end. Please try again later."

---

## 📝 User Permissions

Recommended permission levels:

| Action | Permission Level |
|--------|-----------------|
| View statistics | `data_entry`, `pharmacist`, `admin` |
| Preview changes | `data_entry`, `pharmacist`, `admin` |
| Apply changes | `pharmacist`, `admin` |
| Rollback changes | `admin` only |

Implement permission checks in the UI:

```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, hasPermission } = useAuth();

  return (
    <>
      {hasPermission('apply_route_changes') && (
        <Button onClick={handleApply}>Apply Changes</Button>
      )}
      {hasPermission('rollback_changes') && (
        <Button onClick={handleRollback}>Rollback</Button>
      )}
    </>
  );
};
```

---

## 🚀 Deployment Checklist

- [ ] Configure production API URL
- [ ] Add authentication/authorization
- [ ] Implement error boundaries
- [ ] Add loading states for all API calls
- [ ] Test with large datasets (1000+ records)
- [ ] Add user confirmation dialogs for destructive actions
- [ ] Implement session timeout handling
- [ ] Add audit logging for applied changes
- [ ] Test rollback functionality
- [ ] Add help documentation/tooltips
- [ ] Test on different screen sizes (responsive design)
- [ ] Add accessibility features (ARIA labels, keyboard navigation)

---

## 📚 Additional Resources

- **Backend API Documentation**: [docs/route-dosage-cleaning-api.md](./route-dosage-cleaning-api.md)
- **Implementation Summary**: [docs/ROUTE_DOSAGE_CLEANING_IMPLEMENTATION.md](./ROUTE_DOSAGE_CLEANING_IMPLEMENTATION.md)
- **Test Documentation**: [tests/README_CLEANING_TESTS.md](../tests/README_CLEANING_TESTS.md)

---

## 💡 Tips & Best Practices

1. **Always create a session** before making changes
2. **Always preview** changes before applying
3. **Show clear feedback** to users (loading, success, error states)
4. **Implement undo/rollback** prominently in the UI
5. **Validate inputs** on the frontend before sending to API
6. **Handle session expiration** gracefully (24-hour timeout)
7. **Show affected drug counts** prominently before applying changes
8. **Use batch operations** for better performance (bulk reconstruct)
9. **Implement auto-save** for dosage edits to prevent data loss
10. **Add export functionality** for audit trails and reporting

---

## 🎯 Success Metrics

Track these metrics to measure feature success:

- **Cleaning Rate**: % of drugs with standardized routes/dosages
- **Time Saved**: Average time to clean 100 routes vs manual
- **Error Reduction**: % reduction in data entry errors
- **User Adoption**: % of users actively using cleaning features
- **Rollback Rate**: % of applied changes that get rolled back

---

## 📞 Support

For questions or issues:
1. Check the API documentation: [route-dosage-cleaning-api.md](./route-dosage-cleaning-api.md)
2. Review the backend implementation: [ROUTE_DOSAGE_CLEANING_IMPLEMENTATION.md](./ROUTE_DOSAGE_CLEANING_IMPLEMENTATION.md)
3. Test the backend first: `node tests/routeCleaningHelpers.test.js`
4. Check server logs for API errors

---

**Last Updated**: February 16, 2026  
**Backend Version**: 1.0.0  
**API Base**: `http://localhost:8066`
