# Restore Unsaved Changes - Feature Documentation

## Overview
When a data-entry user makes changes to a drug and closes the edit form (browser closes, navigates away, etc.), their pending changes are preserved. When they reopen the same drug, they see their unsaved edits exactly as they left them.

## How It Works

### Backend Storage
- When a data-entry user submits changes, a `pending` change request is created
- The change request contains all their proposed changes in JSON format
- The original drug data remains unchanged in the database
- The change request persists until:
  - Admin approves it (changes applied to drug)
  - Admin rejects it (discarded)
  - User cancels it (discarded)

### Frontend Integration

#### 1. When Opening Drug Edit Form
Instead of just loading the drug data, also check for pending changes:

```javascript
// OLD WAY (only drug data)
const response = await fetch(`/drugs/${drugId}`);
const drug = await response.json();

// NEW WAY (drug data + pending changes)
const response = await fetch(`/drug-change-requests/drug/${drugId}/with-pending`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();

if (result.data.hasPendingChanges) {
  // Show the merged data (original + pending changes)
  const drugWithPendingEdits = result.data.drugData;
  
  // Show indicator that there are unsaved changes
  showPendingChangesIndicator(result.data.pendingRequest);
  
  // Populate form with merged data
  populateForm(drugWithPendingEdits);
} else {
  // No pending changes, show original data
  populateForm(result.data.drugData);
}
```

#### 2. Response Structure

**When NO pending changes:**
```json
{
  "success": true,
  "data": {
    "drugData": {
      "DrugID": 123,
      "DrugName": "Original Name",
      "Price": 10.00,
      "Form": "Tablet"
    },
    "originalData": {
      "DrugID": 123,
      "DrugName": "Original Name",
      "Price": 10.00,
      "Form": "Tablet"
    },
    "hasPendingChanges": false,
    "pendingRequest": null
  }
}
```

**When pending changes EXIST:**
```json
{
  "success": true,
  "data": {
    "drugData": {
      "DrugID": 123,
      "DrugName": "Updated Name",  // <- User's pending change
      "Price": 15.00,               // <- User's pending change
      "Form": "Tablet"              // <- Original (not changed)
    },
    "originalData": {
      "DrugID": 123,
      "DrugName": "Original Name",
      "Price": 10.00,
      "Form": "Tablet"
    },
    "hasPendingChanges": true,
    "pendingRequest": {
      "id": 42,
      "status": "pending",
      "createdAt": "2026-01-15T10:30:00Z",
      "changes": {
        "DrugName": "Updated Name",
        "Price": 15.00
      }
    }
  }
}
```

## API Endpoints

### 1. Get Drug with Pending Changes (Recommended)
```
GET /drug-change-requests/drug/:drugId/with-pending
```

**Use this when:** Opening the drug edit form

**Returns:** Drug data merged with any pending changes

**Example:**
```javascript
fetch('/drug-change-requests/drug/123/with-pending', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})
```

### 2. Get Only Pending Changes
```
GET /drug-change-requests/drug/:drugId/my-pending
```

**Use this when:** You only need to check if pending changes exist

**Returns:** Just the pending changes (or null)

**Example:**
```javascript
const response = await fetch('/drug-change-requests/drug/123/my-pending', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
});

const result = await response.json();

if (result.hasPendingChanges) {
  console.log('Pending changes:', result.data.changes);
  console.log('Request ID:', result.data.changeRequestId);
  console.log('Created at:', result.data.createdAt);
}
```

### 3. Update Pending Changes
```
PUT /drug-change-requests/:id/update
```

**Use this when:** User modifies their pending changes before approval

**Example:**
```javascript
// User edits again before admin approves
fetch('/drug-change-requests/42/update', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    changes: {
      DrugName: "Even Newer Name",
      Price: 20.00
    }
  })
})
```

### 4. Cancel Pending Changes
```
DELETE /drug-change-requests/:id/cancel
```

**Use this when:** User wants to discard their pending changes

**Example:**
```javascript
fetch('/drug-change-requests/42/cancel', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})
```

## Frontend Implementation Examples

### React Example

```jsx
import { useState, useEffect } from 'react';

function DrugEditForm({ drugId, userToken }) {
  const [drugData, setDrugData] = useState(null);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);

  useEffect(() => {
    loadDrugWithPendingChanges();
  }, [drugId]);

  const loadDrugWithPendingChanges = async () => {
    const response = await fetch(
      `/drug-change-requests/drug/${drugId}/with-pending`,
      {
        headers: { 'Authorization': `Bearer ${userToken}` }
      }
    );

    const result = await response.json();
    
    setDrugData(result.data.drugData);
    setHasPendingChanges(result.data.hasPendingChanges);
    setPendingRequest(result.data.pendingRequest);
  };

  const handleSave = async (changes) => {
    if (hasPendingChanges) {
      // Update existing pending request
      await fetch(`/drug-change-requests/${pendingRequest.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ changes })
      });
      
      alert('Pending changes updated. Awaiting admin approval.');
    } else {
      // Create new change request (via existing drug update endpoint)
      const response = await fetch(`/drugs/update/${drugId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(changes)
      });
      
      const result = await response.json();
      
      if (result.requiresApproval) {
        alert('Changes submitted for admin approval.');
      }
    }
    
    // Reload to get updated state
    loadDrugWithPendingChanges();
  };

  const handleCancel = async () => {
    if (hasPendingChanges) {
      await fetch(`/drug-change-requests/${pendingRequest.id}/cancel`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      
      alert('Pending changes discarded.');
      loadDrugWithPendingChanges();
    }
  };

  return (
    <div>
      {hasPendingChanges && (
        <div className="alert alert-warning">
          ⏳ You have unsaved changes pending admin approval.
          Submitted: {new Date(pendingRequest.createdAt).toLocaleString()}
          <button onClick={handleCancel}>Discard Changes</button>
        </div>
      )}
      
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSave({
          DrugName: e.target.drugName.value,
          Price: parseFloat(e.target.price.value)
        });
      }}>
        <input 
          name="drugName" 
          defaultValue={drugData?.DrugName} 
          placeholder="Drug Name"
        />
        <input 
          name="price" 
          type="number" 
          defaultValue={drugData?.Price} 
          placeholder="Price"
        />
        <button type="submit">
          {hasPendingChanges ? 'Update Pending Changes' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
```

### Vanilla JavaScript Example

```javascript
async function openDrugEditForm(drugId) {
  const token = localStorage.getItem('authToken');
  
  // Load drug with any pending changes
  const response = await fetch(
    `/drug-change-requests/drug/${drugId}/with-pending`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const result = await response.json();
  const { drugData, hasPendingChanges, pendingRequest } = result.data;
  
  // Populate form with data (includes pending changes if any)
  document.getElementById('drugName').value = drugData.DrugName;
  document.getElementById('price').value = drugData.Price;
  document.getElementById('form').value = drugData.Form;
  
  // Show indicator if there are pending changes
  if (hasPendingChanges) {
    document.getElementById('pendingIndicator').style.display = 'block';
    document.getElementById('pendingIndicator').innerHTML = `
      ⏳ You have unsaved changes pending admin approval.
      <br>Submitted: ${new Date(pendingRequest.createdAt).toLocaleString()}
      <br><button onclick="cancelPendingChanges(${pendingRequest.id})">
        Discard Changes
      </button>
    `;
    
    // Store request ID for later use
    window.currentPendingRequestId = pendingRequest.id;
  }
}

async function cancelPendingChanges(requestId) {
  const token = localStorage.getItem('authToken');
  
  await fetch(`/drug-change-requests/${requestId}/cancel`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  alert('Pending changes discarded.');
  location.reload(); // Reload form
}
```

## User Experience Flow

### Scenario 1: User Makes Changes and Closes Browser

1. **Day 1, 3:00 PM**: User opens drug #123, changes price from $10 to $15
2. User clicks "Save" → Change request created (status: pending)
3. User closes browser/navigates away
4. **Day 2, 9:00 AM**: User opens drug #123 again
5. **Frontend calls:** `GET /drug-change-requests/drug/123/with-pending`
6. **Backend returns:** Drug with Price = $15 (their pending change)
7. User sees their changes exactly as they left them
8. Banner shows: "You have unsaved changes pending approval"

### Scenario 2: User Modifies Pending Changes

1. User has pending changes (Price: $15)
2. User reopens form, sees Price: $15
3. User decides to change it to $20 instead
4. User clicks "Save"
5. **Frontend calls:** `PUT /drug-change-requests/42/update` with new changes
6. Same pending request updated (not a new request created)
7. Admin will see the updated version ($20, not $15)

### Scenario 3: User Discards Changes

1. User has pending changes
2. User reopens form, sees pending indicator
3. User clicks "Discard Changes"
4. **Frontend calls:** `DELETE /drug-change-requests/42/cancel`
5. Pending request deleted
6. Form reloads with original drug data

## Benefits

✅ **No Data Loss**: Users never lose their work
✅ **Seamless UX**: Changes persist across sessions
✅ **Flexible**: Users can modify or discard pending changes
✅ **Single Source of Truth**: One pending request per user per drug
✅ **Admin Friendly**: Admin reviews the latest version of changes

## Important Notes

### Only ONE Pending Request Per User Per Drug
- If user has pending changes and submits again, it updates the existing request
- This prevents duplicate pending requests
- Admin always sees the latest version

### Different Users, Different Requests
- User A can have pending changes for Drug #123
- User B can also have different pending changes for Drug #123
- Both are independent

### When Pending Request is Removed
- Admin approves → Applied to drug table
- Admin rejects → Removed
- User cancels → Removed
- After removal, next edit creates a new request

## Testing

Test the new functionality:
```bash
node test_drug_change_requests.js
```

The test suite now includes scenarios for:
- Creating pending changes
- Reopening and seeing pending changes
- Updating pending changes
- Canceling pending changes
