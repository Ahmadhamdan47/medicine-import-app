# Drug Change Request System - Implementation Summary

## Overview
A complete drug edit approval workflow system that allows data-entry users to submit change requests that require admin approval, while admins can edit directly. All changes are tracked in an audit log.

## Files Created

### 1. Database Migration
- **File**: `sql/create-drug-change-tables.sql`
- Creates two tables:
  - `drug_change_requests`: Stores pending/approved/rejected change requests
  - `drug_change_history`: Complete audit log of all drug changes

### 2. Database Scripts
- **File**: `scripts/addDataEntryRole.js`
- Adds the "data-entry" role to the roles table

### 3. Models
- **File**: `src/models/drugChangeRequest.js`
- **File**: `src/models/drugChangeHistory.js`
- Sequelize models for the new tables

### 4. Model Associations
- **File**: `src/models/associations/associations.js` (updated)
- Added relationships between Drug, UserAccounts, DrugChangeRequest, and DrugChangeHistory

### 5. Service Layer
- **File**: `src/services/drugChangeRequestService.js`
- Core business logic:
  - `createChangeRequest()` - Submit new change request
  - `getPendingRequests()` - Get all pending requests
  - `getAllRequests()` - Get all requests with filters
  - `getChangeRequestById()` - Get request with before/after comparison
  - `approveChangeRequest()` - Approve and apply changes
  - `rejectChangeRequest()` - Reject a request
  - `getChangeHistory()` - Get audit log for a drug
  - `logDirectChange()` - Log admin direct edits
  - `getStatistics()` - Get request statistics

### 6. Controller
- **File**: `src/controllers/drugChangeRequestController.js`
- HTTP endpoints for all service methods

### 7. Routes
- **File**: `src/routes/drugChangeRequestRoutes.js`
- RESTful API routes with Swagger documentation
- **File**: `index.js` (updated)
- Registered routes at `/drug-change-requests`

### 8. Updated Drug Controller
- **File**: `src/controllers/drugController.js` (updated)
- Modified `updateDrug()` function:
  - Admin users: Changes applied immediately + logged to history
  - Data-entry users: Changes create pending request
  - Other roles: Access denied

### 9. Test Suite
- **File**: `test_drug_change_requests.js`
- Comprehensive test covering all functionality

## Setup Instructions

### Step 1: Run Database Migration
```bash
# Execute the SQL script in your database
mysql -u your_user -p your_database < sql/create-drug-change-tables.sql
```

### Step 2: Add Data-Entry Role
```bash
node scripts/addDataEntryRole.js
```

### Step 3: Restart Your Server
The new routes are automatically loaded when the server starts.

## API Endpoints

All endpoints are prefixed with `/drug-change-requests`

### Submit Change Request (Data-Entry)
```
POST /drug-change-requests
Body: {
  "drugId": 123,
  "changes": {
    "Price": 25.50,
    "DrugName": "Updated Name",
    "NotMarketed": false
  }
}
```

### Get All Pending Requests
```
GET /drug-change-requests/pending
Query params: ?drugId=123&requestedBy=456
```

### Get All Requests (with filters)
```
GET /drug-change-requests
Query params: ?status=approved&drugId=123
```

### Get Request Details (Before/After)
```
GET /drug-change-requests/:id
```

### Approve Request (Admin Only)
```
PUT /drug-change-requests/:id/approve
Body: { "comments": "Looks good!" }
```

### Reject Request (Admin Only)
```
PUT /drug-change-requests/:id/reject
Body: { "comments": "Price too high" }
```

### Get Change History for Drug
```
GET /drug-change-requests/history/:drugId
Query params: ?limit=50
```

### Get Statistics
```
GET /drug-change-requests/statistics
```

## How It Works

### For Data-Entry Users:
1. User edits a drug using existing `/drugs/update/:DrugID` endpoint
2. System detects role = "data-entry"
3. Creates a change request instead of applying changes
4. Returns success with `requiresApproval: true`
5. Admin reviews and approves/rejects

### For Admin Users:
1. User edits a drug using existing `/drugs/update/:DrugID` endpoint
2. System detects role = "admin"
3. Applies changes immediately to drug table
4. Logs change to history table with all field changes
5. Returns success with updated drug data

### Change History:
- Every approved change from data-entry users is logged
- Every direct admin edit is logged
- Tracks: who, when, what field, old value, new value
- Queryable by drug ID

## Testing

Run the comprehensive test suite:
```bash
node test_drug_change_requests.js
```

This will:
1. Create test users (admin, data-entry)
2. Create a test drug
3. Test all operations:
   - Creating change requests
   - Getting pending requests
   - Viewing before/after comparison
   - Approving changes
   - Rejecting changes
   - Direct admin edits
   - Change history
   - Statistics

## Authentication Note

⚠️ **Important**: The routes expect `req.user` to contain:
- `UserId`: The user's ID
- `role.RoleName`: The user's role name

Make sure your authentication middleware populates these fields. If using JWT:
```javascript
// Example middleware
const authenticateToken = (req, res, next) => {
  // ... verify token ...
  req.user = {
    UserId: decoded.userId,
    role: { RoleName: decoded.roleName }
  };
  next();
};
```

## Frontend Integration

### For Drug Edit Form:
```javascript
// When user clicks "Save"
const response = await fetch(`/drugs/update/${drugId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(changes)
});

const result = await response.json();

if (result.requiresApproval) {
  // Show message: "Changes submitted for admin approval"
  alert(result.message);
} else if (result.success) {
  // Show message: "Drug updated successfully"
  alert(result.message);
}
```

### For Admin Approval Dashboard:
```javascript
// Get pending requests
const response = await fetch('/drug-change-requests/pending');
const { data: requests } = await response.json();

// For each request, show before/after
const details = await fetch(`/drug-change-requests/${requestId}`);
const comparison = await details.json();

// Approve
await fetch(`/drug-change-requests/${requestId}/approve`, {
  method: 'PUT',
  body: JSON.stringify({ comments: 'Approved' })
});

// Reject
await fetch(`/drug-change-requests/${requestId}/reject`, {
  method: 'PUT',
  body: JSON.stringify({ comments: 'Price too high' })
});
```

## Benefits

✅ **Audit Trail**: Complete history of who changed what and when
✅ **Approval Workflow**: Data-entry users need admin approval
✅ **Before/After Comparison**: See exactly what changed
✅ **Role-Based Access**: Admin, data-entry, and other roles handled differently
✅ **Backward Compatible**: Existing drug edit API enhanced, not replaced
✅ **Extensible**: Easy to add more approval rules or notification systems

## Next Steps

1. Add email notifications when:
   - Data-entry user submits request
   - Admin approves/rejects request
   
2. Add bulk approval:
   - Approve multiple requests at once
   
3. Add request expiration:
   - Auto-reject requests older than X days
   
4. Add more filters:
   - Filter by date range
   - Filter by field changed
   - Filter by reviewer

## Support

For issues or questions, check:
- API documentation: http://localhost:8066/api-docs
- Test file: `test_drug_change_requests.js`
- Service layer: `src/services/drugChangeRequestService.js`
