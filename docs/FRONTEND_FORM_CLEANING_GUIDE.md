# Frontend Implementation Guide: Form Cleaning

## 📋 Overview

This document provides a complete frontend implementation plan for the **Form Cleaning** feature. This feature allows users to:

**Form Cleaning**: Standardize and clean raw dosage form values (e.g., "Tab" → "Tablet", "Cap" → "Capsule")

The feature follows a **preview-commit-rollback** workflow with auto-matching suggestions from the `dosageOptions` lookup table.

---

## 🎯 Use Case

### Form Cleaning Use Case
**Problem**: The `FormRaw` field in the drug table contains inconsistent, abbreviated, or misspelled dosage form values:
- "Tab", "Tablet", "tablet", "TABLET", "Tabs"
- "Cap", "Caps", "Capsule", "capsule"
- "Syr", "Syrup", "SYR"
- "Inj", "Injection", "Injectable"

**Solution**: Users can:
1. View all unique `FormRaw` values with drug counts
2. Get AI suggestions from the `dosageOptions` table (with confidence scores)
3. Map multiple `FormRaw` values to standardized `Form` values
4. Preview changes before applying
5. Apply changes in bulk (with automatic backup)
6. Rollback if needed

**Data Source**: 
- Raw values come from `drug.FormRaw`
- Clean values come from `dosageoptions.DosageFormClean`
- Target field: `drug.Form`

---

## 🎨 UI Workflow

### Step 1: Dashboard View
```
┌─────────────────────────────────────────────────────┐
│  Form Cleaning Dashboard                            │
├─────────────────────────────────────────────────────┤
│  Statistics: (Only marketed drugs, NotMarketed=false)│
│  ✓ Total Drugs: 15,000                             │
│  ✓ Drugs with Forms: 12,000 (80%)                 │
│  ⚠ Drugs without Forms: 3,000 (20%)               │
│  📊 Unique FormRaw Values: 120                     │
│                                                      │
│  [Start New Cleaning Session]                       │
└─────────────────────────────────────────────────────┘
```

**API**: `GET /form-cleaning/stats`
**Note**: All statistics and operations filter for `NotMarketed = false` (marketed drugs only)

---

### Step 2: Unique FormRaw Values Table
```
┌─────────────────────────────────────────────────────────────────────┐
│  Unique FormRaw Values (Marketed drugs only)    [Export] [Help]   │
├──────────────┬──────────┬─────────────┬──────────────────────────────┤
│ FormRaw      │ Count    │ Sample Form │ Action                      │
├──────────────┼──────────┼─────────────┼──────────────────────────────┤
│ Tab          │ 3,523    │ Tablet      │ [Map] [View Drugs] [Ignore] │
│ Tablet       │ 2,100    │ Tablet      │ [Map] [View Drugs] [Ignore] │
│ Cap          │ 1,287    │ Capsule     │ [Map] [View Drugs] [Ignore] │
│ Syr          │ 845      │ Syrup       │ [Map] [View Drugs] [Ignore] │
│ Inj          │ 623      │ Injection   │ [Map] [View Drugs] [Ignore] │
│ Caps         │ 234      │ Capsule     │ [Map] [View Drugs] [Ignore] │
│ (empty)      │ 156      │ -           │ [Map] [View Drugs] [Ignore] │
└──────────────┴──────────┴─────────────┴──────────────────────────────┘

Filters: [Min Count: 1] [Include Empty: ☐]
Search: [____________] 🔍
[Auto-Match All] [Map Selected] [Export CSV]
```

**APIs**: 
- `GET /form-cleaning/unique-values?minCount=1&includeNull=false`
- `GET /form-cleaning/affected-drugs?formRaw=Tab&limit=100`
**Note**: All queries automatically filter for `NotMarketed = false`

**UI Features**:
- Sortable columns (by count, FormRaw alphabetically)
- Search/filter by FormRaw value
- Bulk selection with checkboxes
- Export to CSV for offline review

---

### Step 3: Mapping Dialog (Auto-Suggest)
```
┌────────────────────────────────────────────────────┐
│  Map FormRaw: "Tab"                         [×]    │
├────────────────────────────────────────────────────┤
│  Affects 3,523 drugs                               │
│                                                     │
│  AI Suggestions: (Click to select)                │
│                                                     │
│  ✓ Tablet                                         │
│    Confidence: 75% (Contained In)                 │
│    Physical State: Solid                          │
│    Substitution: S1S2S7                           │
│    Used by: 5,623 drugs                           │
│    [✓ Select This]                                │
│                                                     │
│  □ Tabular                                        │
│    Confidence: 30% (Fuzzy)                        │
│    Physical State: Solid                          │
│    [Select]                                       │
│                                                     │
│  Browse All Options:                              │
│  Dropdown: [Select from dosageOptions...      ▼] │
│  - Tablet                                         │
│  - Capsule                                        │
│  - Syrup                                          │
│  - Injection                                      │
│  - Cream                                          │
│  - ...                                            │
│                                                     │
│  Or enter manually:                               │
│  [_________________________________]               │
│                                                     │
│  Preview affected drugs: [Show 10 Sample Drugs]   │
│                                                     │
│  [Cancel] [Confirm Mapping]                       │
└────────────────────────────────────────────────────┘
```

**API**: `POST /form-cleaning/suggest-matches`
```json
{
  "formRaw": "Tab",
  "limit": 5
}
```

**Response**:
```json
{
  "success": true,
  "formRaw": "Tab",
  "suggestions": [
    {
      "dosageOptionId": 5,
      "dosageFormClean": "Tablet",
      "physicalState": "Solid",
      "substitutionRelationship": "S1S2S7",
      "confidence": 75,
      "matchType": "contained_in"
    }
  ]
}
```

**Note**: "Tab" matches "Tablet" as `contained_in` (score 75) because "Tablet" contains "Tab". This is the typical case for abbreviations like Cap→Capsule, Inj→Injection, etc.

---

### Step 4: Mapping Summary (Before Preview)
```
┌────────────────────────────────────────────────────────────┐
│  Form Mappings Summary                    [Save Draft]     │
├────────────────┬──────────────┬──────────┬────────────────┤
│ FormRaw        │ New Form     │ Count    │ Actions        │
├────────────────┼──────────────┼──────────┼────────────────┤
│ Tab            │ → Tablet     │ 3,523    │ [Edit] [Remove]│
│ Caps           │ → Capsule    │ 234      │ [Edit] [Remove]│
│ Cap            │ → Capsule    │ 1,287    │ [Edit] [Remove]│
│ Syr            │ → Syrup      │ 845      │ [Edit] [Remove]│
│ Inj            │ → Injection  │ 623      │ [Edit] [Remove]│
├────────────────┴──────────────┴──────────┴────────────────┤
│ Total Mappings: 5                                          │
│ Total Affected Drugs: 6,512                                │
│                                                             │
│ [Add More Mappings] [Clear All] [Preview Changes]         │
└────────────────────────────────────────────────────────────┘
```

**UI Features**:
- Review all mappings before preview
- Edit individual mappings
- Remove unwanted mappings
- See total impact

---

### Step 5: Preview Changes
```
┌────────────────────────────────────────────────────────────┐
│  Preview Form Changes                    [Back to Edit]    │
├────────────────────────────────────────────────────────────┤
│  ⚠ This will update 6,512 drugs across 5 mappings         │
│  🔒 Automatic backup will be created before applying       │
│  ⏱ Estimated time: ~2 seconds                             │
│                                                             │
│  Mapping Details:                                          │
│                                                             │
│  ▼ Tab → Tablet (3,523 drugs)                             │
│    Sample Drugs:                                           │
│    • Paracetamol 500mg Tab                                │
│    • Ibuprofen 200mg Tab                                  │
│    • Amoxicillin 250mg Tab                                │
│    • Aspirin 100mg Tab                                    │
│    • Metformin 500mg Tab                                  │
│    [Show All 3,523 Drugs]                                 │
│                                                             │
│  ▼ Cap → Capsule (1,287 drugs)                            │
│    Sample Drugs:                                           │
│    • Omeprazole 20mg Cap                                  │
│    • Amoxicillin 500mg Cap                                │
│    • Fluoxetine 20mg Cap                                  │
│    [Show All 1,287 Drugs]                                 │
│                                                             │
│  ▼ Caps → Capsule (234 drugs)                             │
│  ▼ Syr → Syrup (845 drugs)                                │
│  ▼ Inj → Injection (623 drugs)                            │
│                                                             │
│  [← Back to Edit] [Apply Changes →]                       │
└────────────────────────────────────────────────────────────┘
```

**API**: `POST /form-cleaning/preview`
```json
{
  "mappings": [
    { "formRaw": "Tab", "newForm": "Tablet" },
    { "formRaw": "Cap", "newForm": "Capsule" },
    { "formRaw": "Caps", "newForm": "Capsule" },
    { "formRaw": "Syr", "newForm": "Syrup" },
    { "formRaw": "Inj", "newForm": "Injection" }
  ]
}
```

---

### Step 6: Apply Changes Confirmation
```
┌────────────────────────────────────────────────────────────┐
│  ✅ Changes Applied Successfully!                          │
├────────────────────────────────────────────────────────────┤
│  Results:                                                   │
│  • Total Updated: 6,512 drugs                              │
│  • Successful: 6,512                                       │
│  • Failed: 0                                               │
│  • Duration: 1.8 seconds                                   │
│                                                             │
│  Mapping Results:                                          │
│  ✓ Tab → Tablet: 3,523 drugs updated                      │
│  ✓ Cap → Capsule: 1,287 drugs updated                     │
│  ✓ Caps → Capsule: 234 drugs updated                      │
│  ✓ Syr → Syrup: 845 drugs updated                         │
│  ✓ Inj → Injection: 623 drugs updated                     │
│                                                             │
│  Backup Created:                                           │
│  📁 form_cleaning_backup_abc123_1708123456.json           │
│  💾 Size: 2.4 MB                                           │
│                                                             │
│  Session Info:                                             │
│  🆔 Session ID: form_cleaning_1708123456789_abc123xyz     │
│  ⏰ Session expires: Feb 17, 2026 10:30 AM                 │
│  👤 Applied by: John Doe (User ID: 42)                    │
│                                                             │
│  [⏮ Rollback Changes] [📊 View Updated Drugs] [✓ Close]  │
└────────────────────────────────────────────────────────────┘
```

**API**: `POST /form-cleaning/apply`
```json
{
  "sessionId": "form_cleaning_1708123456789_abc123xyz",
  "mappings": [
    { "formRaw": "Tab", "newForm": "Tablet" },
    { "formRaw": "Cap", "newForm": "Capsule" },
    { "formRaw": "Caps", "newForm": "Capsule" },
    { "formRaw": "Syr", "newForm": "Syrup" },
    { "formRaw": "Inj", "newForm": "Injection" }
  ]
}
```

---

### Step 7: Rollback (If Needed)
```
┌────────────────────────────────────────────────────────────┐
│  ⚠ Rollback Form Changes                                   │
├────────────────────────────────────────────────────────────┤
│  This will revert 6,512 drugs to their previous Form       │
│  values and restore the FormRaw references.                │
│                                                             │
│  Session Details:                                          │
│  🆔 ID: form_cleaning_1708123456789_abc123xyz             │
│  📅 Applied: Feb 16, 2026 10:45 AM                        │
│  👤 Applied by: John Doe                                  │
│  📁 Backup: form_cleaning_backup_abc123_1708123456.json   │
│                                                             │
│  What will be restored:                                    │
│  • 3,523 drugs: Tablet → Tab                              │
│  • 1,287 drugs: Capsule → Cap                             │
│  • 234 drugs: Capsule → Caps                              │
│  • 845 drugs: Syrup → Syr                                 │
│  • 623 drugs: Injection → Inj                             │
│                                                             │
│  ⚠ WARNING: This action cannot be undone!                 │
│                                                             │
│  Confirmation required:                                    │
│  Type "ROLLBACK" to confirm: [____________]               │
│                                                             │
│  [Cancel] [Yes, Rollback All Changes]                     │
└────────────────────────────────────────────────────────────┘
```

**API**: `POST /form-cleaning/rollback`
```json
{
  "sessionId": "form_cleaning_1708123456789_abc123xyz"
}
```

---

## 🔧 Implementation Steps

### 1. Setup & Configuration

#### Install Dependencies
```bash
npm install axios
# or
npm install @tanstack/react-query  # For better caching
```

#### Configure API Base URL
```javascript
// config/api.js
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8066';
export const FORM_CLEANING_BASE = `${API_BASE_URL}/form-cleaning`;
```

---

### 2. API Service Layer

```javascript
// services/formCleaningService.js
import axios from 'axios';
import { FORM_CLEANING_BASE } from '../config/api';

export const formCleaningService = {
  // Get statistics
  async getStats() {
    const response = await axios.get(`${FORM_CLEANING_BASE}/stats`);
    return response.data;
  },

  // Get unique FormRaw values
  async getUniqueValues(params = {}) {
    const { includeNull = false, minCount = 1 } = params;
    const response = await axios.get(`${FORM_CLEANING_BASE}/unique-values`, {
      params: { includeNull, minCount }
    });
    return response.data;
  },

  // Get suggestions for a FormRaw value
  async getSuggestions(formRaw, limit = 5) {
    const response = await axios.post(`${FORM_CLEANING_BASE}/suggest-matches`, {
      formRaw,
      limit
    });
    return response.data;
  },

  // Get affected drugs for a FormRaw
  async getAffectedDrugs(formRaw, limit = 100) {
    const response = await axios.get(`${FORM_CLEANING_BASE}/affected-drugs`, {
      params: { formRaw, limit }
    });
    return response.data;
  },

  // Preview form mappings
  async previewMappings(mappings) {
    const response = await axios.post(`${FORM_CLEANING_BASE}/preview`, {
      mappings
    });
    return response.data;
  },

  // Create a new session
  async createSession(metadata = {}) {
    const response = await axios.post(`${FORM_CLEANING_BASE}/session`, {
      metadata
    });
    return response.data;
  },

  // Get session info
  async getSession(sessionId) {
    const response = await axios.get(`${FORM_CLEANING_BASE}/session/${sessionId}`);
    return response.data;
  },

  // Apply form mappings
  async applyMappings(sessionId, mappings) {
    const response = await axios.post(`${FORM_CLEANING_BASE}/apply`, {
      sessionId,
      mappings
    });
    return response.data;
  },

  // Rollback changes
  async rollback(sessionId) {
    const response = await axios.post(`${FORM_CLEANING_BASE}/rollback`, {
      sessionId
    });
    return response.data;
  },

  // Clear session
  async clearSession(sessionId) {
    const response = await axios.delete(`${FORM_CLEANING_BASE}/session/${sessionId}`);
    return response.data;
  }
};
```

---

### 3. State Management (React Context)

```javascript
// context/FormCleaningContext.js
import React, { createContext, useContext, useState } from 'react';
import { formCleaningService } from '../services/formCleaningService';

const FormCleaningContext = createContext();

export const useFormCleaning = () => {
  const context = useContext(FormCleaningContext);
  if (!context) {
    throw new Error('useFormCleaning must be used within FormCleaningProvider');
  }
  return context;
};

export const FormCleaningProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [mappings, setMappings] = useState([]);
  const [uniqueValues, setUniqueValues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await formCleaningService.getStats();
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
      const data = await formCleaningService.getUniqueValues(params);
      setUniqueValues(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMapping = (formRaw, newForm) => {
    setMappings(prev => {
      // Remove existing mapping for this formRaw if it exists
      const filtered = prev.filter(m => m.formRaw !== formRaw);
      return [...filtered, { formRaw, newForm }];
    });
  };

  const removeMapping = (formRaw) => {
    setMappings(prev => prev.filter(m => m.formRaw !== formRaw));
  };

  const clearMappings = () => {
    setMappings([]);
  };

  const startSession = async (metadata = {}) => {
    try {
      setLoading(true);
      const data = await formCleaningService.createSession(metadata);
      setSession(data.session);
      return data.session;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const previewMappings = async () => {
    try {
      setLoading(true);
      const data = await formCleaningService.previewMappings(mappings);
      return data.preview;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyMappings = async () => {
    if (!session) {
      throw new Error('No active session. Please create a session first.');
    }
    try {
      setLoading(true);
      const data = await formCleaningService.applyMappings(session.sessionId, mappings);
      return data.results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rollback = async () => {
    if (!session) {
      throw new Error('No active session to rollback.');
    }
    try {
      setLoading(true);
      const data = await formCleaningService.rollback(session.sessionId);
      return data.result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCleaningContext.Provider
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
    </FormCleaningContext.Provider>
  );
};
```

---

### 4. Component Structure

```
src/
├── components/
│   └── form-cleaning/
│       ├── FormCleaningDashboard.jsx      # Main dashboard with stats
│       ├── UniqueFormValuesTable.jsx      # Table of unique FormRaw values
│       ├── FormMappingDialog.jsx          # Dialog to map FormRaw to Form
│       ├── FormMappingSummary.jsx         # Summary of all mappings
│       ├── PreviewDialog.jsx              # Preview changes before applying
│       ├── ApplyConfirmation.jsx          # Success message after applying
│       └── RollbackDialog.jsx             # Rollback confirmation dialog
│
├── services/
│   └── formCleaningService.js             # API service layer
│
├── context/
│   └── FormCleaningContext.js             # State management
│
└── config/
    └── api.js                              # API configuration
```

---

### 5. Example: Form Cleaning Dashboard Component

```javascript
// components/form-cleaning/FormCleaningDashboard.jsx
import React, { useEffect } from 'react';
import { useFormCleaning } from '../../context/FormCleaningContext';
import { Alert, Card, Statistic, Button, Spin, Row, Col } from 'antd';
import { 
  DatabaseOutlined, 
  CheckCircleOutlined, 
  WarningOutlined,
  TagsOutlined 
} from '@ant-design/icons';

const FormCleaningDashboard = ({ onStartSession }) => {
  const { stats, loading, error, loadStats } = useFormCleaning();

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (!stats) return null;

  return (
    <div className="form-cleaning-dashboard">
      <h1>Form Cleaning Dashboard</h1>
      <p className="subtitle">
        Standardize dosage form values across your drug database
      </p>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Drugs" 
              value={stats.totalDrugs}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Drugs with Forms" 
              value={stats.drugsWithForm}
              suffix={`(${stats.cleanPercentage}%)`}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Drugs without Forms" 
              value={stats.drugsWithoutForm}
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Unique FormRaw Values" 
              value={stats.uniqueFormRaws}
              prefix={<TagsOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <h3>Ready to Clean Forms?</h3>
        <p>
          Start a new cleaning session to standardize your dosage form data. 
          You'll be able to map raw form values (like "Tab", "Cap") to clean 
          standard forms (like "Tablet", "Capsule") from the dosage options table.
        </p>
        <Button 
          type="primary" 
          size="large" 
          onClick={onStartSession}
        >
          Start New Cleaning Session
        </Button>
      </Card>
    </div>
  );
};

export default FormCleaningDashboard;
```

---

## 📡 Complete API Reference

### 1. GET `/form-cleaning/stats`

**Request:**
```http
GET /form-cleaning/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalDrugs": 15000,
    "drugsWithForm": 12000,
    "drugsWithFormRaw": 14000,
    "drugsWithoutForm": 3000,
    "uniqueFormRaws": 120,
    "cleanPercentage": "80.00"
  }
}
```

---

### 2. GET `/form-cleaning/unique-values`

**Request:**
```http
GET /form-cleaning/unique-values?includeNull=false&minCount=1
```

**Query Parameters:**
- `includeNull` (boolean, optional): Include null/empty FormRaw values (default: false)
- `minCount` (integer, optional): Minimum drug count to include (default: 1)

**Response:**
```json
{
  "success": true,
  "count": 120,
  "data": [
    {
      "formRaw": "Tab",
      "drugCount": 3523,
      "sampleForm": "Tablet"
    },
    {
      "formRaw": "Cap",
      "drugCount": 1287,
      "sampleForm": "Capsule"
    }
  ]
}
```

---

### 3. POST `/form-cleaning/suggest-matches`

**Request:**
```json
{
  "formRaw": "Tab",
  "limit": 5
}
```

**Response:**
```json
{
  "success": true,
  "formRaw": "Tab",
  "suggestions": [
    {
      "dosageOptionId": 5,
      "dosageFormClean": "Tablet",
      "physicalState": "Solid",
      "substitutionRelationship": "S1S2S7",
      "confidence": 75,
      "matchType": "contained_in"
    }
  ]
}
```

**Match Types & Algorithm:**
- **`exact`** (score: 100) - Exact match (case-insensitive)
  - Example: "Tablet" = "Tablet"
  
- **`starts_with`** (score: 90) - FormRaw starts with the clean form name
  - Example: "Tablet Extended Release" starts with "Tablet"
  
- **`contains`** (score: 80) - FormRaw contains the clean form name
  - Example: "Oral Tablet Solution" contains "Tablet"
  
- **`contained_in`** (score: 75) - Clean form name contains FormRaw (common for abbreviations)
  - Example: "Tab" is contained in "Tablet"
  - Example: "Cap" is contained in "Capsule"
  - Example: "Inj" is contained in "Injection"
  
- **`fuzzy`** (score: 10-50) - Fuzzy match using Levenshtein distance (40% tolerance)
  - Example: "Creme" vs "Cream" (distance: 2)
  - Score calculated as: `max(10, 50 - distance * 5)`

**💡 Algorithm Note:**
The matching algorithm checks in order: exact → starts_with → contains → contained_in → fuzzy. Most common abbreviations (Tab, Cap, Syr, Inj) match as **`contained_in`** with score 75, which is appropriate since the full form name contains the abbreviation. This provides good confidence while distinguishing from exact or starts_with matches.

---

### 4. GET `/form-cleaning/affected-drugs`

**Request:**
```http
GET /form-cleaning/affected-drugs?formRaw=Tab&limit=100
```

**Response:**
```json
{
  "success": true,
  "formRaw": "Tab",
  "count": 3523,
  "data": [
    {
      "DrugID": 1001,
      "DrugName": "Paracetamol 500mg",
      "Form": "Tablet",
      "FormRaw": "Tab",
      "Route": "Oral",
      "Dosage": "500mg",
      "Manufacturer": "XYZ Pharma",
      "NotMarketed": false
    }
  ]
}
```

---

### 5. POST `/form-cleaning/preview`

**Request:**
```json
{
  "mappings": [
    { "formRaw": "Tab", "newForm": "Tablet" },
    { "formRaw": "Cap", "newForm": "Capsule" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "preview": {
    "totalMappings": 2,
    "totalAffectedDrugs": 4810,
    "mappingDetails": [
      {
        "formRaw": "Tab",
        "newForm": "Tablet",
        "affectedCount": 3523,
        "sampleDrugs": [
          {
            "DrugID": 1001,
            "DrugName": "Paracetamol 500mg",
            "Form": "Tablet",
            "FormRaw": "Tab"
          }
        ]
      }
    ]
  }
}
```

---

### 6. POST `/form-cleaning/session`

**Request:**
```json
{
  "metadata": {
    "description": "Cleaning tablet and capsule forms",
    "user": "John Doe"
  }
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "sessionId": "form_cleaning_1708123456789_abc123xyz",
    "type": "form",
    "status": "initialized",
    "mappings": [],
    "backupFile": null,
    "affectedCount": 0,
    "userId": 1,
    "createdAt": "2026-02-16T10:30:00.000Z",
    "updatedAt": "2026-02-16T10:30:00.000Z",
    "expiresAt": "2026-02-17T10:30:00.000Z",
    "metadata": {
      "description": "Cleaning tablet and capsule forms"
    }
  }
}
```

---

### 7. POST `/form-cleaning/apply`

**Request:**
```json
{
  "sessionId": "form_cleaning_1708123456789_abc123xyz",
  "mappings": [
    { "formRaw": "Tab", "newForm": "Tablet" },
    { "formRaw": "Cap", "newForm": "Capsule" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "totalUpdated": 4810,
    "mappingResults": [
      {
        "formRaw": "Tab",
        "newForm": "Tablet",
        "success": true,
        "updatedCount": 3523
      },
      {
        "formRaw": "Cap",
        "newForm": "Capsule",
        "success": true,
        "updatedCount": 1287
      }
    ]
  }
}
```

---

### 8. POST `/form-cleaning/rollback`

**Request:**
```json
{
  "sessionId": "form_cleaning_1708123456789_abc123xyz"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "success": true,
    "restoredCount": 4810,
    "backupFile": "form_cleaning_1708123456789_abc123xyz"
  }
}
```

---

### 9. GET `/form-cleaning/session/:sessionId`

**Request:**
```http
GET /form-cleaning/session/form_cleaning_1708123456789_abc123xyz
```

**Response:**
```json
{
  "success": true,
  "session": {
    "sessionId": "form_cleaning_1708123456789_abc123xyz",
    "type": "form",
    "status": "applied",
    "mappings": [
      {"formRaw": "Tab", "newForm": "Tablet"},
      {"formRaw": "Cap", "newForm": "Capsule"}
    ],
    "backupFile": "/path/to/backup.json",
    "affectedCount": 4810,
    "userId": 1,
    "createdAt": "2026-02-16T10:30:00.000Z",
    "updatedAt": "2026-02-16T10:45:00.000Z",
    "expiresAt": "2026-02-17T10:30:00.000Z"
  }
}
```

---

### 10. DELETE `/form-cleaning/session/:sessionId`

**Request:**
```http
DELETE /form-cleaning/session/form_cleaning_1708123456789_abc123xyz
```

**Response:**
```json
{
  "success": true,
  "message": "Session cleared successfully"
}
```

---

## Quick Reference Table

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/form-cleaning/stats` | Get statistics |
| GET | `/form-cleaning/unique-values` | Get unique FormRaw values |
| POST | `/form-cleaning/suggest-matches` | Get AI suggestions |
| GET | `/form-cleaning/affected-drugs` | Get affected drugs list |
| POST | `/form-cleaning/preview` | Preview mappings |
| POST | `/form-cleaning/session` | Create session |
| GET | `/form-cleaning/session/:id` | Get session info |
| POST | `/form-cleaning/apply` | Apply mappings |
| POST | `/form-cleaning/rollback` | Rollback changes |
| DELETE | `/form-cleaning/session/:id` | Clear session |

---

## 🎨 UI Component Recommendations

### Recommended Component Libraries

1. **Ant Design** (Recommended for this project)
   - `Table`, `Modal`, `Button`, `Statistic`, `Alert`
   - Rich data table components
   - https://ant.design

2. **Material-UI (MUI)**
   - `DataGrid`, `Dialog`, `Button`, `Card`
   - Modern Material Design
   - https://mui.com

3. **Chakra UI**
   - Lightweight and accessible
   - https://chakra-ui.com

### Key Components Needed

1. **Data Tables** - Display unique FormRaw values with sorting/filtering
2. **Modals/Dialogs** - Mapping, preview, confirmation dialogs
3. **Statistics Cards** - Dashboard KPIs
4. **Alerts/Notifications** - Success/error feedback
5. **Loading Spinners** - API call feedback
6. **Badges** - Confidence scores, match types
7. **Tooltips** - Help text and explanations

---

## 🐛 Error Handling

### API Error Handling Pattern

```javascript
try {
  const result = await formCleaningService.applyMappings(sessionId, mappings);
  showSuccessNotification('Changes applied successfully!');
} catch (error) {
  if (error.response?.status === 400) {
    showErrorNotification('Invalid request. Please check your mappings.');
  } else if (error.response?.status === 404) {
    showErrorNotification('Session not found or expired. Please create a new session.');
  } else if (error.response?.status === 500) {
    showErrorNotification('Server error. Please try again later.');
  } else {
    showErrorNotification('An unexpected error occurred.');
  }
  console.error('Apply mappings error:', error);
}
```

### User-Friendly Error Messages

- **400 Bad Request**: "Please check your input and try again."
- **404 Not Found**: "Session expired. Please start a new session."
- **500 Server Error**: "Something went wrong. Please try again later."

---

## ⚡ Performance Optimization

### Pagination
- Use `limit` and `offset` for large datasets
- Implement virtual scrolling for 1000+ rows

### Debouncing
- Debounce search inputs (300ms)
- Debounce auto-suggest API calls

### Caching
- Cache statistics (refresh every 5 minutes)
- Cache unique values list
- Use React Query for smart caching

### Loading States
- Show skeleton screens during initial load
- Use optimistic updates
- Show progress bars for bulk operations

---

## 📝 User Permissions

| Action | Permission Level |
|--------|-----------------|
| View statistics | `data_entry`, `pharmacist`, `admin` |
| Preview changes | `data_entry`, `pharmacist`, `admin` |
| Apply changes | `pharmacist`, `admin` |
| Rollback changes | `admin` only |

---

## 🚀 Deployment Checklist

- [ ] Configure production API URL
- [ ] Add authentication/authorization
- [ ] Implement error boundaries
- [ ] Add loading states for all API calls
- [ ] Test with large datasets (1000+ records)
- [ ] Add user confirmation dialogs
- [ ] Implement session timeout handling
- [ ] Add audit logging
- [ ] Test rollback functionality
- [ ] Add help documentation/tooltips
- [ ] Test responsive design
- [ ] Add accessibility features (ARIA labels)
- [ ] Run all test suites and verify they pass
- [ ] Restart server after any backend changes

---

## 💡 Tips & Best Practices

1. **Always create a session** before making changes
2. **Always preview** changes before applying
3. **Show clear feedback** to users (loading, success, error states)
4. **Implement undo/rollback** prominently in the UI
5. **Validate inputs** on the frontend before sending to API
6. **Handle session expiration** gracefully (24-hour timeout)
7. **Show affected drug counts** prominently before applying
8. **Add export functionality** for audit trails
9. **Implement search/filter** on the unique values table
10. **Add confirmation dialogs** for destructive actions

---

## 🎯 Success Metrics

- **Cleaning Rate**: % of drugs with standardized forms
- **Time Saved**: Average time to clean 100 forms vs manual
- **Error Reduction**: % reduction in data entry errors
- **User Adoption**: % of users actively using the feature
- **Rollback Rate**: % of applied changes that get rolled back

---

## 📚 Additional Resources

- **Backend API**: See backend implementation at `src/services/formCleaningService.js`
- **Models**: `src/models/drug.js`, `src/models/dosageOption.js`
- **Routes**: `src/routes/formCleaningRoutes.js`
- **Controllers**: `src/controllers/formCleaningController.js`
- **Session Service**: `src/services/cleaningSessionService.js` (supports "form", "route", and "dosage" sessions)

### 🧪 Testing

Comprehensive test suites are available:

1. **Unit Tests** (No database required)
   ```bash
   node tests/formCleaningHelpers.test.js
   ```
   Tests matching algorithms, Levenshtein distance, and fuzzy logic

2. **Integration Tests** (Database required)
   ```bash
   node tests/formCleaningService.test.js
   ```
   Tests service layer with real database queries

3. **API Tests** (Server + database required)
   ```bash
   node test-form-cleaning-api.js
   ```
   Tests all HTTP endpoints end-to-end

📖 **Test Documentation**: See `tests/README_FORM_CLEANING_TESTS.md` for detailed test documentation, troubleshooting, and best practices.

---

**Last Updated**: February 16, 2026  
**Backend Version**: 1.0.0  
**API Base**: `http://localhost:8066/form-cleaning`  
**Test Coverage**: 60+ unit tests, 45+ integration tests, 50+ API tests
