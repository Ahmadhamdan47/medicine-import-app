# Donor Sub-Account Management APIs

This document outlines all the APIs needed for implementing sub-account functionality for donors in the medicine import app.

## Overview

The sub-account system allows main donor accounts to create and manage sub-accounts with specific permissions. Sub-accounts share the same donor profile but have limited permissions based on what the main account assigns.

## Authentication

All APIs require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Permission System

Sub-accounts can have the following permissions:
- `view_donations` - View donation records
- `add_donations` - Create new donations  
- `edit_donations` - Modify existing donations

Main accounts automatically have all permissions.

## API Endpoints

### 1. Create Sub-Account

**Endpoint:** `POST /users/donor-subaccounts`

**Description:** Create a new sub-account for the authenticated main donor account.

**Authorization:** Main donor account only

**Request Body:**
```json
{
  "Username": "string (required)",
  "Password": "string (required)", 
  "Email": "string (required, valid email)",
  "Permissions": ["view_donations", "add_donations"] // optional, defaults to ["view_donations"]
}
```

**Response:**
```json
{
  "message": "Sub-account created successfully",
  "data": {
    "UserId": 123,
    "Username": "sub_account_user",
    "Email": "sub@example.com",
    "Permissions": ["view_donations", "add_donations"],
    "IsActive": true,
    "DonorId": 45
  }
}
```

**Status Codes:**
- `201` - Success
- `400` - Bad request (validation errors)
- `403` - Access denied (not main account)

---

### 2. Get All Sub-Accounts

**Endpoint:** `GET /users/donor-subaccounts`

**Description:** Retrieve all sub-accounts created by the main donor account.

**Authorization:** Main donor account only

**Response:**
```json
{
  "message": "Sub-accounts retrieved successfully",
  "data": [
    {
      "UserId": 123,
      "Username": "sub_account_1",
      "Email": "sub1@example.com", 
      "Permissions": ["view_donations"],
      "IsActive": true,
      "DonorId": 45
    },
    {
      "UserId": 124,
      "Username": "sub_account_2",
      "Email": "sub2@example.com",
      "Permissions": ["view_donations", "add_donations"],
      "IsActive": true,
      "DonorId": 45
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `403` - Access denied

---

### 3. Get Sub-Account Details

**Endpoint:** `GET /users/donor-subaccounts/{userId}`

**Description:** Get details of a specific sub-account.

**Authorization:** Main donor account only

**Parameters:**
- `userId` (path) - Sub-account user ID

**Response:**
```json
{
  "message": "Sub-account details retrieved successfully",
  "data": {
    "UserId": 123,
    "Username": "sub_account_user",
    "Email": "sub@example.com",
    "Permissions": ["view_donations", "add_donations"],
    "IsActive": true,
    "DonorId": 45
  }
}
```

**Status Codes:**
- `200` - Success
- `403` - Access denied
- `404` - Sub-account not found

---

### 4. Update Sub-Account Permissions

**Endpoint:** `PUT /users/donor-subaccounts/{userId}`

**Description:** Update permissions for a specific sub-account.

**Authorization:** Main donor account only

**Parameters:**
- `userId` (path) - Sub-account user ID

**Request Body:**
```json
{
  "permissions": ["view_donations", "add_donations", "edit_donations"]
}
```

**Response:**
```json
{
  "message": "Permissions updated successfully",
  "data": {
    "success": true,
    "message": "Permissions updated successfully"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request (invalid permissions)
- `403` - Access denied
- `404` - Sub-account not found

---

### 5. Deactivate Sub-Account

**Endpoint:** `DELETE /users/donor-subaccounts/{userId}`

**Description:** Deactivate a specific sub-account.

**Authorization:** Main donor account only

**Parameters:**
- `userId` (path) - Sub-account user ID

**Response:**
```json
{
  "message": "Sub-account deactivated successfully",
  "data": {
    "success": true,
    "message": "Sub-account deactivated successfully"
  }
}
```

**Status Codes:**
- `200` - Success
- `403` - Access denied
- `404` - Sub-account not found

---

## Existing APIs with Updated Permissions

### Donation Management APIs

All donation APIs now include permission checks for sub-accounts:

#### Get Donations by Donor
**Endpoint:** `GET /donation/byDonor/{donorId}`
**Permission Required:** `view_donations`

#### Get Donation by ID  
**Endpoint:** `GET /donation/{DonationId}`
**Permission Required:** `view_donations`

#### Add New Donation
**Endpoint:** `POST /donation/add`
**Permission Required:** `add_donations`

#### Edit Donation
**Endpoint:** `PUT /donation/{DonationId}`
**Permission Required:** `edit_donations`

#### Create Batch Lot
**Endpoint:** `POST /donation/batchlot`
**Permission Required:** `add_donations`

#### Get All Donations
**Endpoint:** `GET /donation/all`
**Permission Required:** Donor access (any donor account)

#### Get Filtered Donations
**Endpoint:** `GET /donation/filtered`
**Permission Required:** Donor access (any donor account)

---

## Profile Management APIs (Existing)

These APIs work for both main and sub-accounts:

#### Get Current User Profile
**Endpoint:** `GET /users/me`
**Description:** Get profile of currently authenticated user

#### Get Donor Profile
**Endpoint:** `GET /users/donor/{userId}`
**Description:** Get donor details by user ID

#### Edit Donor Profile  
**Endpoint:** `PUT /donor/{donorId}`
**Description:** Edit donor profile details

#### Change Password
**Endpoint:** `POST /users/me/change-password`
**Description:** Change account password

---

## Settings Page Implementation

For a complete settings page that shows donor profile data and allows editing, use these APIs:

### Main Account Settings Page:
1. `GET /users/me` - Get current user profile
2. `GET /users/donor/{userId}` - Get donor details
3. `PUT /donor/{donorId}` - Update donor profile
4. `POST /users/me/change-password` - Change password
5. `GET /users/donor-subaccounts` - Get sub-accounts list
6. `POST /users/donor-subaccounts` - Create new sub-account
7. `PUT /users/donor-subaccounts/{userId}` - Update sub-account permissions
8. `DELETE /users/donor-subaccounts/{userId}` - Deactivate sub-account

### Sub-Account Settings Page:
1. `GET /users/me` - Get current user profile  
2. `GET /users/donor/{userId}` - Get donor details (read-only)
3. `POST /users/me/change-password` - Change own password
4. Donation access based on assigned permissions

---

## Error Handling

All APIs return consistent error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common error scenarios:
- `400` - Bad request (validation errors, missing fields)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found (resource doesn't exist)
- `500` - Internal server error

---

## Database Schema Changes

The following columns were added to the `useraccounts` table:

- `IsMainAccount` (BOOLEAN) - Indicates if this is a main account
- `ParentUserId` (INT) - Foreign key to parent main account
- `Permissions` (JSON) - Array of permissions for sub-accounts
- `CreatedBy` (INT) - Foreign key to user who created this account

## Security Considerations

1. **Permission Validation:** All donation APIs validate permissions before allowing access
2. **Ownership Verification:** Sub-account management APIs verify ownership before allowing operations
3. **Password Security:** Sub-account passwords are hashed using bcrypt
4. **Token-based Authentication:** All APIs require valid JWT tokens
5. **Data Isolation:** Sub-accounts can only see data for their associated donor
