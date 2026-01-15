# Frontend Integration Guide - Authentication & Drug Change Request System

**Version:** 1.0  
**Date:** January 15, 2026  
**Base URL:** `http://localhost:8066`

---

## Table of Contents
1. [Authentication System](#authentication-system)
2. [Drug Change Request System](#drug-change-request-system)
3. [Complete Workflows](#complete-workflows)
4. [Error Handling](#error-handling)
5. [Testing Guide](#testing-guide)

---

## 1. Authentication System

### 1.1 User Roles

The system supports three main roles:

| Role | Permissions | Drug Edit Behavior |
|------|-------------|-------------------|
| `admin` | Full access | Edits apply immediately + logged to history |
| `data-entry` | Limited access | Edits create pending requests (require admin approval) |
| `other` | View only | Cannot edit drugs |

### 1.2 Login Endpoint

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "UserId": 123,
    "Username": "user@example.com",
    "Email": "user@example.com",
    "RoleId": 2,
    "role": {
      "RoleId": 2,
      "RoleName": "data-entry"
    }
  }
}
```

**Response (Failed - 401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 1.3 Using Authentication Token

All protected endpoints require the token in the Authorization header:

```javascript
fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### 1.4 Token Storage (Frontend)

```javascript
// After successful login
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});

const data = await loginResponse.json();

if (data.success) {
  // Store token and user info
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('userId', data.user.UserId);
  localStorage.setItem('userRole', data.user.role.RoleName);
  
  // Use for subsequent requests
  const token = localStorage.getItem('authToken');
}
```

### 1.5 User Context in Requests

The backend automatically extracts user information from the token. The `req.user` object contains:
- `req.user.UserId` - User's ID
- `req.user.role.RoleName` - User's role name (admin, data-entry, etc.)

---

## 2. Drug Change Request System

### 2.1 Overview

**Purpose:** Track and approve drug edits made by data-entry users.

**Key Features:**
- ✅ Pending requests require admin approval
- ✅ Admin edits apply immediately (no approval needed)
- ✅ Complete audit history of all changes
- ✅ Restore unsaved changes when reopening
- ✅ Before/after comparison for approval

### 2.2 Core Endpoints

#### 2.2.1 Edit Drug (Universal Endpoint)

**Endpoint:** `PUT /drugs/update/:DrugID`

**Description:** This is the SAME endpoint for both admin and data-entry users. The backend automatically handles the role-based logic.

**Request:**
```http
PUT /drugs/update/123
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "Price": 25.50,
  "DrugName": "Updated Drug Name",
  "NotMarketed": false,
  "Form": "Tablet"
}
```

**Response (Admin User - 200):**
```json
{
  "success": true,
  "message": "Drug updated successfully",
  "data": {
    "DrugID": 123,
    "DrugName": "Updated Drug Name",
    "Price": 25.50,
    "NotMarketed": false,
    "Form": "Tablet"
  }
}
```

**Response (Data-Entry User - 200):**
```json
{
  "success": true,
  "message": "Change request submitted successfully. Awaiting admin approval.",
  "requiresApproval": true,
  "changeRequest": {
    "id": 42,
    "status": "pending",
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

**Frontend Logic:**
```javascript
async function saveDrugChanges(drugId, changes) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`/drugs/update/${drugId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(changes)
  });
  
  const result = await response.json();
  
  if (result.success) {
    if (result.requiresApproval) {
      // Data-entry user
      showNotification('Changes submitted for admin approval', 'info');
    } else {
      // Admin user
      showNotification('Drug updated successfully', 'success');
    }
  }
}
```

---

### 2.3 Restore Unsaved Changes

#### 2.3.1 Get Drug with Pending Changes (Recommended)

**Endpoint:** `GET /drug-change-requests/drug/:drugId/with-pending`

**Description:** Returns drug data merged with user's pending changes. Use this when opening the edit form.

**Request:**
```http
GET /drug-change-requests/drug/123/with-pending
Authorization: Bearer YOUR_TOKEN
```

**Response (No Pending Changes):**
```json
{
  "success": true,
  "data": {
    "drugData": {
      "DrugID": 123,
      "DrugName": "Aspirin",
      "Price": 10.00,
      "Form": "Tablet",
      "NotMarketed": false
    },
    "originalData": {
      "DrugID": 123,
      "DrugName": "Aspirin",
      "Price": 10.00,
      "Form": "Tablet",
      "NotMarketed": false
    },
    "hasPendingChanges": false,
    "pendingRequest": null
  }
}
```

**Response (With Pending Changes):**
```json
{
  "success": true,
  "data": {
    "drugData": {
      "DrugID": 123,
      "DrugName": "Updated Aspirin",
      "Price": 15.00,
      "Form": "Tablet",
      "NotMarketed": false
    },
    "originalData": {
      "DrugID": 123,
      "DrugName": "Aspirin",
      "Price": 10.00,
      "Form": "Tablet",
      "NotMarketed": false
    },
    "hasPendingChanges": true,
    "pendingRequest": {
      "id": 42,
      "status": "pending",
      "createdAt": "2026-01-15T10:30:00Z",
      "changes": {
        "DrugName": "Updated Aspirin",
        "Price": 15.00
      }
    }
  }
}
```

**Frontend Implementation:**
```javascript
async function openDrugEditForm(drugId) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(
    `/drug-change-requests/drug/${drugId}/with-pending`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const result = await response.json();
  
  if (result.success) {
    const { drugData, hasPendingChanges, pendingRequest } = result.data;
    
    // Populate form with merged data (includes pending changes if any)
    populateFormFields(drugData);
    
    // Show indicator if there are pending changes
    if (hasPendingChanges) {
      showPendingChangesIndicator({
        requestId: pendingRequest.id,
        createdAt: pendingRequest.createdAt,
        changes: pendingRequest.changes
      });
    }
  }
}

function showPendingChangesIndicator(info) {
  const banner = document.createElement('div');
  banner.className = 'alert alert-warning';
  banner.innerHTML = `
    ⏳ You have unsaved changes pending admin approval.
    <br>Submitted: ${new Date(info.createdAt).toLocaleString()}
    <br><button onclick="cancelPendingChanges(${info.requestId})">
      Discard Changes
    </button>
  `;
  document.getElementById('form-container').prepend(banner);
}
```

#### 2.3.2 Get Only Pending Changes

**Endpoint:** `GET /drug-change-requests/drug/:drugId/my-pending`

**Description:** Returns only the pending changes (not merged with drug data). Use for quick checks.

**Request:**
```http
GET /drug-change-requests/drug/123/my-pending
Authorization: Bearer YOUR_TOKEN
```

**Response (No Pending Changes):**
```json
{
  "success": true,
  "hasPendingChanges": false,
  "data": null
}
```

**Response (With Pending Changes):**
```json
{
  "success": true,
  "hasPendingChanges": true,
  "data": {
    "changeRequestId": 42,
    "status": "pending",
    "changes": {
      "Price": 15.00,
      "DrugName": "Updated Name"
    },
    "previousValues": {
      "Price": 10.00,
      "DrugName": "Original Name"
    },
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

---

### 2.4 Manage Pending Changes

#### 2.4.1 Update Pending Changes

**Endpoint:** `PUT /drug-change-requests/:id/update`

**Description:** Modify an existing pending request before admin approval.

**Request:**
```http
PUT /drug-change-requests/42/update
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "changes": {
    "Price": 20.00,
    "DrugName": "Even Newer Name"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Change request updated successfully",
  "changeRequest": {
    "ChangeRequestId": 42,
    "Status": "pending",
    "ChangesJSON": {
      "Price": 20.00,
      "DrugName": "Even Newer Name"
    },
    "UpdatedAt": "2026-01-15T11:00:00Z"
  }
}
```

#### 2.4.2 Cancel Pending Changes

**Endpoint:** `DELETE /drug-change-requests/:id/cancel`

**Description:** Discard pending changes.

**Request:**
```http
DELETE /drug-change-requests/42/cancel
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Change request canceled successfully"
}
```

**Frontend Implementation:**
```javascript
async function cancelPendingChanges(requestId) {
  const token = localStorage.getItem('authToken');
  
  const confirmed = confirm('Are you sure you want to discard your pending changes?');
  if (!confirmed) return;
  
  const response = await fetch(`/drug-change-requests/${requestId}/cancel`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const result = await response.json();
  
  if (result.success) {
    showNotification('Pending changes discarded', 'success');
    location.reload(); // Reload form to show original data
  }
}
```

---

### 2.5 Admin Approval Endpoints

#### 2.5.1 Get All Pending Requests

**Endpoint:** `GET /drug-change-requests/pending`

**Description:** Get all pending change requests (Admin dashboard).

**Request:**
```http
GET /drug-change-requests/pending
Authorization: Bearer ADMIN_TOKEN
```

**Query Parameters (Optional):**
- `drugId` - Filter by drug ID
- `requestedBy` - Filter by user ID

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "ChangeRequestId": 42,
      "DrugID": 123,
      "Status": "pending",
      "RequestedByRole": "data-entry",
      "CreatedAt": "2026-01-15T10:30:00Z",
      "ChangesJSON": {
        "Price": 15.00,
        "DrugName": "Updated Name"
      },
      "requester": {
        "UserId": 456,
        "Username": "john.doe",
        "Email": "john@example.com"
      },
      "drug": {
        "DrugID": 123,
        "DrugName": "Aspirin",
        "MoPHCode": "12345",
        "RegistrationNumber": "REG-001"
      }
    },
    {
      "ChangeRequestId": 43,
      "DrugID": 124,
      "Status": "pending",
      "RequestedByRole": "data-entry",
      "CreatedAt": "2026-01-15T11:00:00Z",
      "ChangesJSON": {
        "NotMarketed": true
      },
      "requester": {
        "UserId": 457,
        "Username": "jane.smith",
        "Email": "jane@example.com"
      },
      "drug": {
        "DrugID": 124,
        "DrugName": "Ibuprofen",
        "MoPHCode": "67890",
        "RegistrationNumber": "REG-002"
      }
    }
  ]
}
```

#### 2.5.2 Get Request Details (Before/After)

**Endpoint:** `GET /drug-change-requests/:id`

**Description:** Get detailed view of a change request with before/after comparison.

**Request:**
```http
GET /drug-change-requests/42
Authorization: Bearer ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "drugInfo": {
      "DrugID": 123,
      "DrugName": "Aspirin",
      "DrugNameAR": "أسبرين",
      "MoPHCode": "12345",
      "Price": 10.00,
      "Form": "Tablet",
      "Dosage": "500mg",
      "Presentation": "30 tablets"
    },
    "requestInfo": {
      "id": 42,
      "status": "pending",
      "requestedBy": {
        "UserId": 456,
        "Username": "john.doe",
        "Email": "john@example.com",
        "role": {
          "RoleId": 2,
          "RoleName": "data-entry"
        }
      },
      "requestedAt": "2026-01-15T10:30:00Z",
      "reviewedBy": null,
      "reviewedAt": null,
      "reviewComments": null
    },
    "changes": [
      {
        "field": "Price",
        "previousValue": 10.00,
        "proposedValue": 15.00
      },
      {
        "field": "DrugName",
        "previousValue": "Aspirin",
        "proposedValue": "Updated Aspirin"
      }
    ]
  }
}
```

#### 2.5.3 Approve Request

**Endpoint:** `PUT /drug-change-requests/:id/approve`

**Description:** Approve a change request and apply changes to drug table (Admin only).

**Request:**
```http
PUT /drug-change-requests/42/approve
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "comments": "Approved - changes look good!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Change request approved and applied successfully",
  "changeRequestId": 42,
  "drugId": 123
}
```

**After approval:**
- Drug table is updated with the changes
- Change request status set to "approved"
- All changes logged to history table
- Pending request removed from pending list

#### 2.5.4 Reject Request

**Endpoint:** `PUT /drug-change-requests/:id/reject`

**Description:** Reject a change request (Admin only).

**Request:**
```http
PUT /drug-change-requests/42/reject
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "comments": "Price is too high, please reconsider."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Change request rejected",
  "changeRequestId": 42
}
```

**After rejection:**
- Change request status set to "rejected"
- Drug table remains unchanged
- Request removed from pending list
- User can create a new request with different values

---

### 2.6 Change History & Audit Log

#### 2.6.1 Get Change History for a Drug

**Endpoint:** `GET /drug-change-requests/history/:drugId`

**Description:** Get complete audit log of all changes for a specific drug.

**Request:**
```http
GET /drug-change-requests/history/123?limit=50
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `limit` (optional) - Maximum records to return (default: 50)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "HistoryId": 101,
      "DrugID": 123,
      "ChangeRequestId": 42,
      "ChangeType": "update",
      "FieldName": "Price",
      "OldValue": "10.00",
      "NewValue": "15.00",
      "ChangedByRole": "data-entry",
      "ChangeTimestamp": "2026-01-15T12:00:00Z",
      "changer": {
        "UserId": 456,
        "Username": "john.doe",
        "Email": "john@example.com"
      },
      "approver": {
        "UserId": 1,
        "Username": "admin",
        "Email": "admin@example.com"
      },
      "changeRequest": {
        "ChangeRequestId": 42,
        "Status": "approved",
        "ReviewComments": "Approved - changes look good!"
      }
    },
    {
      "HistoryId": 100,
      "DrugID": 123,
      "ChangeRequestId": null,
      "ChangeType": "update",
      "FieldName": "Form",
      "OldValue": "Pill",
      "NewValue": "Tablet",
      "ChangedByRole": "admin",
      "ChangeTimestamp": "2026-01-14T15:00:00Z",
      "changer": {
        "UserId": 1,
        "Username": "admin",
        "Email": "admin@example.com"
      },
      "approver": {
        "UserId": 1,
        "Username": "admin",
        "Email": "admin@example.com"
      },
      "changeRequest": null
    }
  ]
}
```

**Notes:**
- `ChangeRequestId` is `null` for direct admin edits (no approval needed)
- `ChangeRequestId` is populated for data-entry user edits (approved requests)
- Each field change is logged separately

#### 2.6.2 Get All Requests (with filters)

**Endpoint:** `GET /drug-change-requests`

**Description:** Get all change requests with optional filters.

**Request:**
```http
GET /drug-change-requests?status=approved&drugId=123
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters (Optional):**
- `status` - Filter by status: `pending`, `approved`, `rejected`
- `drugId` - Filter by drug ID
- `requestedBy` - Filter by user ID

**Response:** Similar to "Get Pending Requests" but includes all statuses.

#### 2.6.3 Get Statistics

**Endpoint:** `GET /drug-change-requests/statistics`

**Description:** Get overall statistics about change requests.

**Request:**
```http
GET /drug-change-requests/statistics
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pending": 5,
    "approved": 42,
    "rejected": 3,
    "total": 50
  }
}
```

---

## 3. Complete Workflows

### 3.1 Data-Entry User: Edit Drug Workflow

```javascript
// STEP 1: Open drug edit form
async function openEditForm(drugId) {
  const token = localStorage.getItem('authToken');
  
  // Get drug with any pending changes merged
  const response = await fetch(
    `/drug-change-requests/drug/${drugId}/with-pending`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  
  const result = await response.json();
  const { drugData, hasPendingChanges, pendingRequest } = result.data;
  
  // Populate form
  document.getElementById('drugName').value = drugData.DrugName;
  document.getElementById('price').value = drugData.Price;
  document.getElementById('form').value = drugData.Form;
  
  // Show pending indicator if exists
  if (hasPendingChanges) {
    showPendingBanner(pendingRequest);
  }
}

// STEP 2: User makes changes and saves
async function saveChanges(drugId, pendingRequestId = null) {
  const token = localStorage.getItem('authToken');
  
  const changes = {
    DrugName: document.getElementById('drugName').value,
    Price: parseFloat(document.getElementById('price').value),
    Form: document.getElementById('form').value
  };
  
  // If there's an existing pending request, update it
  if (pendingRequestId) {
    const response = await fetch(
      `/drug-change-requests/${pendingRequestId}/update`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ changes })
      }
    );
    
    const result = await response.json();
    if (result.success) {
      showNotification('Pending changes updated', 'success');
    }
  } else {
    // Create new change request via drug update endpoint
    const response = await fetch(`/drugs/update/${drugId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(changes)
    });
    
    const result = await response.json();
    if (result.success && result.requiresApproval) {
      showNotification('Changes submitted for admin approval', 'info');
    }
  }
}

// STEP 3: User can cancel pending changes
async function cancelPending(requestId) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(
    `/drug-change-requests/${requestId}/cancel`,
    {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const result = await response.json();
  if (result.success) {
    showNotification('Pending changes discarded', 'success');
    location.reload();
  }
}
```

### 3.2 Admin User: Review and Approve Workflow

```javascript
// STEP 1: Get all pending requests
async function loadPendingRequests() {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('/drug-change-requests/pending', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const result = await response.json();
  
  // Display in table
  displayPendingRequests(result.data);
}

// STEP 2: View request details
async function viewRequestDetails(requestId) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`/drug-change-requests/${requestId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const result = await response.json();
  const { drugInfo, requestInfo, changes } = result.data;
  
  // Show modal with before/after comparison
  showApprovalModal({
    drugInfo,
    requestInfo,
    changes
  });
}

// STEP 3: Approve or reject
async function approveRequest(requestId, comments) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(
    `/drug-change-requests/${requestId}/approve`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comments })
    }
  );
  
  const result = await response.json();
  if (result.success) {
    showNotification('Request approved and applied', 'success');
    loadPendingRequests(); // Refresh list
  }
}

async function rejectRequest(requestId, comments) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(
    `/drug-change-requests/${requestId}/reject`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comments })
    }
  );
  
  const result = await response.json();
  if (result.success) {
    showNotification('Request rejected', 'info');
    loadPendingRequests(); // Refresh list
  }
}
```

### 3.3 View Change History Workflow

```javascript
// Display complete audit log for a drug
async function viewChangeHistory(drugId) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(
    `/drug-change-requests/history/${drugId}?limit=100`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const result = await response.json();
  
  // Group by timestamp and display
  const historyByTimestamp = groupHistoryByTimestamp(result.data);
  displayHistoryTimeline(historyByTimestamp);
}

function groupHistoryByTimestamp(history) {
  const grouped = {};
  
  history.forEach(record => {
    const key = record.ChangeTimestamp;
    if (!grouped[key]) {
      grouped[key] = {
        timestamp: key,
        changer: record.changer,
        approver: record.approver,
        changeType: record.ChangedByRole === 'admin' ? 'Direct Edit' : 'Approved Request',
        changes: []
      };
    }
    
    grouped[key].changes.push({
      field: record.FieldName,
      oldValue: record.OldValue,
      newValue: record.NewValue
    });
  });
  
  return Object.values(grouped);
}
```

---

## 4. Error Handling

### 4.1 Common HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response data |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Token missing or invalid - redirect to login |
| 403 | Forbidden | User doesn't have permission |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Show error message, try again |

### 4.2 Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error details (optional)"
}
```

### 4.3 Frontend Error Handling Example

```javascript
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    const data = await response.json();
    
    // Handle specific status codes
    if (response.status === 401) {
      // Unauthorized - redirect to login
      localStorage.clear();
      window.location.href = '/login';
      return null;
    }
    
    if (response.status === 403) {
      showNotification('You do not have permission for this action', 'error');
      return null;
    }
    
    if (!response.ok) {
      showNotification(data.message || 'An error occurred', 'error');
      return null;
    }
    
    return data;
    
  } catch (error) {
    console.error('API Error:', error);
    showNotification('Network error. Please try again.', 'error');
    return null;
  }
}

// Usage
const result = await apiCall('/drug-change-requests/pending');
if (result) {
  // Process successful response
  console.log(result.data);
}
```

---

## 5. Testing Guide

### 5.1 Test User Accounts

Create test users for each role:

```sql
-- Admin user
INSERT INTO useraccounts (Username, Email, PasswordHash, RoleId, IsActive)
VALUES ('admin@test.com', 'admin@test.com', 'hashed_password', 1, 1);

-- Data-entry user
INSERT INTO useraccounts (Username, Email, PasswordHash, RoleId, IsActive)
VALUES ('dataentry@test.com', 'dataentry@test.com', 'hashed_password', 2, 1);
```

### 5.2 Testing Checklist

#### Authentication Tests
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Access protected endpoint without token
- [ ] Access protected endpoint with expired token

#### Data-Entry User Tests
- [ ] Edit drug → Creates pending request
- [ ] Close browser and reopen → Sees pending changes
- [ ] Update pending changes
- [ ] Cancel pending changes
- [ ] Try to approve own request → Should fail (403)

#### Admin User Tests
- [ ] Edit drug → Changes applied immediately
- [ ] View all pending requests
- [ ] View request details (before/after)
- [ ] Approve request → Changes applied to drug
- [ ] Reject request → Changes discarded
- [ ] View change history for a drug

#### History Tests
- [ ] View history after admin direct edit
- [ ] View history after approved data-entry request
- [ ] History shows correct user names
- [ ] History shows all field changes

### 5.3 Postman/Thunder Client Collection

Sample requests for testing:

```javascript
// 1. Login
POST http://localhost:8066/auth/login
Body: { "username": "admin@test.com", "password": "password" }

// 2. Edit Drug (Admin)
PUT http://localhost:8066/drugs/update/123
Headers: Authorization: Bearer {{token}}
Body: { "Price": 25.50 }

// 3. Edit Drug (Data-Entry)
PUT http://localhost:8066/drugs/update/123
Headers: Authorization: Bearer {{dataEntryToken}}
Body: { "Price": 30.00 }

// 4. Get Pending Requests
GET http://localhost:8066/drug-change-requests/pending
Headers: Authorization: Bearer {{adminToken}}

// 5. Get Drug with Pending Changes
GET http://localhost:8066/drug-change-requests/drug/123/with-pending
Headers: Authorization: Bearer {{dataEntryToken}}

// 6. Approve Request
PUT http://localhost:8066/drug-change-requests/42/approve
Headers: Authorization: Bearer {{adminToken}}
Body: { "comments": "Approved" }

// 7. Get History
GET http://localhost:8066/drug-change-requests/history/123
Headers: Authorization: Bearer {{token}}
```

---

## 6. Quick Reference

### 6.1 Endpoint Summary

| Endpoint | Method | Purpose | Auth Required | Admin Only |
|----------|--------|---------|---------------|------------|
| `/auth/login` | POST | User login | No | No |
| `/drugs/update/:id` | PUT | Edit drug | Yes | No* |
| `/drug-change-requests/drug/:id/with-pending` | GET | Get drug + pending changes | Yes | No |
| `/drug-change-requests/drug/:id/my-pending` | GET | Check for pending changes | Yes | No |
| `/drug-change-requests/:id/update` | PUT | Update pending request | Yes | No |
| `/drug-change-requests/:id/cancel` | DELETE | Cancel pending request | Yes | No |
| `/drug-change-requests/pending` | GET | Get all pending requests | Yes | No |
| `/drug-change-requests/:id` | GET | Get request details | Yes | No |
| `/drug-change-requests/:id/approve` | PUT | Approve request | Yes | Yes |
| `/drug-change-requests/:id/reject` | PUT | Reject request | Yes | Yes |
| `/drug-change-requests/history/:id` | GET | Get change history | Yes | No |
| `/drug-change-requests/statistics` | GET | Get statistics | Yes | No |

*Both admin and data-entry can use, but behavior differs

### 6.2 Key Differences: Admin vs Data-Entry

| Action | Admin | Data-Entry |
|--------|-------|------------|
| Edit drug | Applied immediately | Creates pending request |
| Approval needed | No | Yes |
| Can approve requests | Yes | No |
| Changes logged | Yes (direct edit) | Yes (after approval) |
| Can update pending | N/A | Yes (own requests only) |
| Can cancel pending | N/A | Yes (own requests only) |

---

## 7. Support & Troubleshooting

### Common Issues

**Issue:** "User authentication required"
- **Solution:** Ensure Authorization header is set with valid token

**Issue:** "Only administrators can approve"
- **Solution:** Check user role is exactly "admin" (case-sensitive)

**Issue:** Pending changes not showing
- **Solution:** Use `/with-pending` endpoint, not `/drugs/:id`

**Issue:** Can't update pending request
- **Solution:** Ensure user owns the request and it's still pending

---

## Document Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-15 | Initial documentation |

---

**For questions or issues, contact the backend team.**
