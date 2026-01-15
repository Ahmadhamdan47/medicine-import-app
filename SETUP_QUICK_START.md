# Quick Setup Guide - Drug Change Request System

## 🚀 Quick Start (5 minutes)

### Step 1: Run Database Migration
Open your MySQL client and execute:
```bash
mysql -u root -p ommal_medapiv2 < sql/create-drug-change-tables.sql
```
Or run directly in your MySQL client by copying the contents of `sql/create-drug-change-tables.sql`

### Step 2: Add Data-Entry Role
```bash
node scripts/addDataEntryRole.js
```

### Step 3: Restart Your Server
```bash
# Stop current server (Ctrl+C)
node index.js
# Or
npm start
```

### Step 4: Test the System
```bash
node test_drug_change_requests.js
```

---

## 📋 Quick API Reference

### Base URL
```
http://localhost:8066/drug-change-requests
```

### Endpoints

#### 1. Submit Change Request (Data-Entry User)
```http
POST /drug-change-requests
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "drugId": 123,
  "changes": {
    "Price": 25.50,
    "DrugName": "Updated Name"
  }
}
```

#### 2. Get Pending Requests (Admin)
```http
GET /drug-change-requests/pending
Authorization: Bearer YOUR_TOKEN
```

#### 3. Get Request Details with Before/After
```http
GET /drug-change-requests/5
Authorization: Bearer YOUR_TOKEN
```

#### 4. Approve Request (Admin)
```http
PUT /drug-change-requests/5/approve
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "comments": "Approved - changes verified"
}
```

#### 5. Reject Request (Admin)
```http
PUT /drug-change-requests/5/reject
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "comments": "Price is too high"
}
```

#### 6. Get Change History
```http
GET /drug-change-requests/history/123
Authorization: Bearer YOUR_TOKEN
```

---

## 🔑 User Role Behavior

### Admin User
- Edits drugs using `PUT /drugs/update/:DrugID`
- Changes applied **immediately**
- Changes logged to history automatically
- Can approve/reject change requests from data-entry users

### Data-Entry User
- Edits drugs using `PUT /drugs/update/:DrugID`
- Changes create a **pending request**
- Must wait for admin approval
- Cannot approve their own requests

---

## 📊 Testing in Postman/Thunder Client

### 1. Create Test Users
First, ensure you have users with the correct roles in your database.

### 2. Test Data-Entry Workflow
```javascript
// 1. Login as data-entry user
POST http://localhost:8066/auth/login
{
  "username": "dataentry@test.com",
  "password": "yourpassword"
}

// 2. Edit a drug (creates change request)
PUT http://localhost:8066/drugs/update/123
Authorization: Bearer TOKEN_FROM_LOGIN
{
  "Price": 30.00,
  "NotMarketed": false
}

// Response: { requiresApproval: true, changeRequest: {...} }
```

### 3. Test Admin Approval
```javascript
// 1. Login as admin
POST http://localhost:8066/auth/login
{
  "username": "admin@test.com",
  "password": "yourpassword"
}

// 2. Get pending requests
GET http://localhost:8066/drug-change-requests/pending
Authorization: Bearer ADMIN_TOKEN

// 3. View details
GET http://localhost:8066/drug-change-requests/1
Authorization: Bearer ADMIN_TOKEN

// 4. Approve
PUT http://localhost:8066/drug-change-requests/1/approve
Authorization: Bearer ADMIN_TOKEN
{
  "comments": "Approved"
}
```

---

## 🐛 Troubleshooting

### Issue: "User authentication required"
**Solution**: Ensure your auth middleware sets `req.user` with `UserId` and `role.RoleName`

### Issue: "Only administrators can approve"
**Solution**: Check that the user's role in the database is exactly "admin" (case-sensitive)

### Issue: "Drug with ID not found"
**Solution**: Verify the drug exists and DrugID is correct

### Issue: Tables don't exist
**Solution**: Run the SQL migration script first

---

## 📁 File Structure

```
medicine-import-app/
├── sql/
│   └── create-drug-change-tables.sql          # Database tables
├── scripts/
│   └── addDataEntryRole.js                    # Add role to DB
├── src/
│   ├── models/
│   │   ├── drugChangeRequest.js               # Request model
│   │   ├── drugChangeHistory.js               # History model
│   │   └── associations/
│   │       └── associations.js                # Updated relationships
│   ├── services/
│   │   └── drugChangeRequestService.js        # Business logic
│   ├── controllers/
│   │   ├── drugController.js                  # Updated controller
│   │   └── drugChangeRequestController.js     # New controller
│   └── routes/
│       └── drugChangeRequestRoutes.js         # New routes
├── test_drug_change_requests.js               # Test suite
├── DRUG_CHANGE_REQUEST_IMPLEMENTATION.md      # Full documentation
└── SETUP_QUICK_START.md                       # This file
```

---

## ✅ Checklist

- [ ] Run SQL migration
- [ ] Add data-entry role
- [ ] Restart server
- [ ] Run tests
- [ ] Test with Postman
- [ ] Create test users (admin, data-entry)
- [ ] Update frontend to handle `requiresApproval` response

---

## 🎯 Next Steps

1. **Frontend**: Update your drug edit form to handle approval workflow
2. **Notifications**: Add email alerts when requests are created/approved
3. **Dashboard**: Create admin panel to manage pending requests
4. **Reports**: Add analytics for approved/rejected changes

---

## 📞 Support

For detailed documentation, see: `DRUG_CHANGE_REQUEST_IMPLEMENTATION.md`
For API docs, visit: http://localhost:8066/api-docs
