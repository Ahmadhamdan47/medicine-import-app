# Importation Module Endpoints Reference

## Quick Reference
All endpoints for the importation module with methods, URLs, authentication requirements, and role permissions.

## Base Configuration
- **Base URL**: `https://your-domain.com/api`
- **Authentication**: Required for all endpoints via JWT token
- **Content-Type**: `application/json` (unless specified otherwise)

---

# Authentication & Authorization

## Headers Required
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Role Permissions Summary
| Role | Create | Read Own | Read All | Update | Delete | Approve | Admin |
|------|--------|----------|----------|--------|--------|---------|-------|
| **agent** | ✅ | ✅ | ❌ | ✅* | ❌ | ❌ | ❌ |
| **import_export** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅** | ❌ |
| **head_pharmacy** | ❌ | ✅ | ✅ | ❌ | ❌ | ✅*** | ❌ |
| **inspector** | ❌ | ✅ | ✅ | ✅**** | ❌ | ❌ | ❌ |
| **pharmacy_service** | ✅***** | ✅ | ✅ | ✅***** | ❌ | ❌ | ❌ |
| **admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

*Only own pending requests  
**RFDs and proformas  
***Swift payments only  
****Inspection-related only
*****Pharmacy-related operations

---

# 1. IMPORTATION REQUESTS

## Core Operations

### Create Request
```http
POST /importation-requests
```
**Roles**: agent, import_export, admin  
**Body**: JSON with drug details  
**Response**: 201 Created

### Get All Requests
```http
GET /importation-requests
```
**Roles**: All authenticated  
**Query Params**: page, limit, status, urgencyLevel, agentId, startDate, endDate, search  
**Response**: 200 OK with pagination

### Get Single Request
```http
GET /importation-requests/:id
```
**Roles**: All authenticated (filtered by access)  
**Response**: 200 OK with full details

### Update Request
```http
PUT /importation-requests/:id
```
**Roles**: agent (own), import_export, admin  
**Body**: JSON with updated fields  
**Response**: 200 OK

### Delete Request
```http
DELETE /importation-requests/:id
```
**Roles**: import_export, admin  
**Response**: 204 No Content

## Status Management

### Update Status
```http
PATCH /importation-requests/:id/status
```
**Roles**: import_export, inspector (limited), admin  
**Body**: `{"status": "new_status", "comments": "reason"}`  
**Response**: 200 OK

### Get Status History
```http
GET /importation-requests/:id/history
```
**Roles**: All authenticated  
**Response**: 200 OK with workflow history

## Shipping & Logistics

### Update Shipping Info
```http
PATCH /importation-requests/:id/shipping
```
**Roles**: import_export, admin  
**Body**: JSON with shipping details  
**Response**: 200 OK

### Update Warehouse Info
```http
PATCH /importation-requests/:id/warehouse
```
**Roles**: import_export, inspector, admin  
**Body**: JSON with warehouse details  
**Response**: 200 OK

## Bulk Operations

### Bulk Status Update
```http
POST /importation-requests/bulk
```
**Roles**: import_export, admin  
**Body**: `{"operation": "updateStatus", "requestIds": [1,2,3], "data": {...}}`  
**Response**: 200 OK with results

## Export

### Export to CSV
```http
GET /importation-requests/export
```
**Roles**: All authenticated  
**Query Params**: format, fields, filters  
**Response**: CSV file download

---

# 2. RFD REQUESTS

## Document Management

### Upload RFD Document
```http
POST /rfd-requests
```
**Roles**: agent, import_export, admin  
**Content-Type**: multipart/form-data  
**Body**: file + importationRequestId + metadata  
**Response**: 201 Created

### Get RFD Requests
```http
GET /rfd-requests
```
**Roles**: All authenticated  
**Query Params**: importationRequestId, status, page, limit  
**Response**: 200 OK with pagination

### Get Single RFD
```http
GET /rfd-requests/:id
```
**Roles**: All authenticated (filtered by access)  
**Response**: 200 OK

### Update RFD Metadata
```http
PUT /rfd-requests/:id
```
**Roles**: agent (own), import_export, admin  
**Body**: JSON with metadata updates  
**Response**: 200 OK

### Delete RFD
```http
DELETE /rfd-requests/:id
```
**Roles**: agent (own pending), import_export, admin  
**Response**: 204 No Content

## Approval Workflow

### Approve/Reject RFD
```http
PATCH /rfd-requests/:id/status
```
**Roles**: import_export, admin  
**Body**: `{"status": "approved", "comments": "reason"}`  
**Response**: 200 OK

## File Operations

### Download RFD Document
```http
GET /rfd-requests/:id/download
```
**Roles**: All authenticated (filtered by access)  
**Response**: File download

### Get File Info
```http
GET /rfd-requests/:id/file-info
```
**Roles**: All authenticated  
**Response**: 200 OK with file metadata

---

# 3. PROFORMA REQUESTS

## Invoice Management

### Upload Proforma Invoice
```http
POST /proforma-requests
```
**Roles**: agent, import_export, admin  
**Content-Type**: multipart/form-data  
**Body**: file + invoice details  
**Response**: 201 Created

### Get Proforma Requests
```http
GET /proforma-requests
```
**Roles**: All authenticated  
**Query Params**: importationRequestId, status, page, limit  
**Response**: 200 OK with pagination

### Get Single Proforma
```http
GET /proforma-requests/:id
```
**Roles**: All authenticated (filtered by access)  
**Response**: 200 OK

### Update Proforma Details
```http
PUT /proforma-requests/:id
```
**Roles**: agent (own), import_export, admin  
**Body**: JSON with invoice updates  
**Response**: 200 OK

## Signing Workflow

### Sign Proforma Invoice
```http
PATCH /proforma-requests/:id/sign
```
**Roles**: import_export, admin  
**Body**: `{"action": "sign", "comments": "approval reason"}`  
**Response**: 200 OK

### Reject Proforma Invoice
```http
PATCH /proforma-requests/:id/reject
```
**Roles**: import_export, admin  
**Body**: `{"reason": "rejection reason"}`  
**Response**: 200 OK

## File Operations

### Download Proforma Document
```http
GET /proforma-requests/:id/download
```
**Roles**: All authenticated (filtered by access)  
**Response**: File download

---

# 4. SWIFT PAYMENTS

## Payment Management

### Upload Payment Proof
```http
POST /swift-payments
```
**Roles**: agent, import_export, admin  
**Content-Type**: multipart/form-data  
**Body**: file + payment details  
**Response**: 201 Created

### Get Swift Payments
```http
GET /swift-payments
```
**Roles**: All authenticated  
**Query Params**: importationRequestId, status, page, limit  
**Response**: 200 OK with pagination

### Get Single Payment
```http
GET /swift-payments/:id
```
**Roles**: All authenticated (filtered by access)  
**Response**: 200 OK

### Update Payment Details
```http
PUT /swift-payments/:id
```
**Roles**: agent (own), import_export, admin  
**Body**: JSON with payment updates  
**Response**: 200 OK

## Approval Workflow

### Approve Payment
```http
PATCH /swift-payments/:id/approve
```
**Roles**: head_pharmacy, admin  
**Body**: `{"comments": "verification notes"}`  
**Response**: 200 OK

### Reject Payment
```http
PATCH /swift-payments/:id/reject
```
**Roles**: head_pharmacy, admin  
**Body**: `{"reason": "rejection reason"}`  
**Response**: 200 OK

### Request Verification
```http
PATCH /swift-payments/:id/verify
```
**Roles**: head_pharmacy, admin  
**Body**: `{"requirements": "additional verification needed"}`  
**Response**: 200 OK

## File Operations

### Download Payment Document
```http
GET /swift-payments/:id/download
```
**Roles**: All authenticated (filtered by access)  
**Response**: File download

---

# 5. ANNOUNCEMENTS

## Announcement Management

### Create Announcement
```http
POST /importation-announcements
```
**Roles**: import_export, admin  
**Body**: JSON with announcement details  
**Response**: 201 Created

### Get Announcements
```http
GET /importation-announcements
```
**Roles**: All authenticated  
**Query Params**: type, priority, active, targetRole, page, limit  
**Response**: 200 OK with filtered announcements

### Get Single Announcement
```http
GET /importation-announcements/:id
```
**Roles**: All authenticated  
**Response**: 200 OK

### Update Announcement
```http
PUT /importation-announcements/:id
```
**Roles**: import_export, admin  
**Body**: JSON with updated content  
**Response**: 200 OK

### Delete Announcement
```http
DELETE /importation-announcements/:id
```
**Roles**: admin  
**Response**: 204 No Content

## User Interaction

### Mark as Viewed
```http
POST /importation-announcements/:id/view
```
**Roles**: All authenticated  
**Response**: 200 OK

### Get Unread Count
```http
GET /importation-announcements/unread-count
```
**Roles**: All authenticated  
**Response**: 200 OK with count

## Analytics

### Get View Statistics
```http
GET /importation-announcements/:id/stats
```
**Roles**: import_export, admin  
**Response**: 200 OK with view analytics

---

# 6. FILE STORAGE

## File Management

### Upload File
```http
POST /files/upload
```
**Roles**: All authenticated  
**Content-Type**: multipart/form-data  
**Body**: file + metadata  
**Response**: 201 Created with signed URL

### Get File Info
```http
GET /files/:fileId
```
**Roles**: All authenticated (filtered by access)  
**Response**: 200 OK with metadata

### Update File Metadata
```http
PUT /files/:fileId
```
**Roles**: File owner, admin  
**Body**: JSON with metadata updates  
**Response**: 200 OK

### Delete File
```http
DELETE /files/:fileId
```
**Roles**: File owner, admin  
**Response**: 204 No Content

## File Access

### Download File
```http
GET /files/:fileId/download
```
**Roles**: All authenticated (filtered by access)  
**Response**: File download

### Get Signed URL
```http
GET /files/:fileId/signed-url
```
**Roles**: All authenticated (filtered by access)  
**Query Params**: expiry  
**Response**: 200 OK with temporary URL

### Check File Integrity
```http
GET /files/:fileId/verify
```
**Roles**: All authenticated  
**Response**: 200 OK with checksum verification

---

# 7. USER MANAGEMENT

## Profile Management

### Get User Profile
```http
GET /users/profile
```
**Roles**: All authenticated  
**Response**: 200 OK with profile data

### Update Profile
```http
PUT /users/profile
```
**Roles**: All authenticated  
**Body**: JSON with profile updates  
**Response**: 200 OK

### Change Password
```http
POST /users/change-password
```
**Roles**: All authenticated  
**Body**: `{"currentPassword": "old", "newPassword": "new"}`  
**Response**: 200 OK

## Admin Operations

### Get All Users
```http
GET /users
```
**Roles**: admin  
**Query Params**: role, active, page, limit  
**Response**: 200 OK with pagination

### Create User
```http
POST /users
```
**Roles**: admin  
**Body**: JSON with user details  
**Response**: 201 Created

### Update User
```http
PUT /users/:id
```
**Roles**: admin  
**Body**: JSON with user updates  
**Response**: 200 OK

### Deactivate User
```http
PATCH /users/:id/deactivate
```
**Roles**: admin  
**Response**: 200 OK

### Reset User Password
```http
POST /users/:id/reset-password
```
**Roles**: admin  
**Response**: 200 OK with temporary password

---

# 8. NSSF OPERATIONS

## Overview
NSSF (National Social Security Fund) operation endpoints provide access to medical operations coverage information for both private and public hospitals. These endpoints return operation details including pricing, coverage rates, and patient share calculations.

## Base Routes
All NSSF operation endpoints are prefixed with `/nssf-operations`

---

## System-Based Search

### Search Operations by System (Private Hospitals)
```http
GET /nssf-operations/private/system/{system}
```
**Roles**: All authenticated users  
**Parameters**: 
- `system` (path): System name or Arabic name  
**Response**: Array of NSSF operations for private hospitals  
**Status Codes**: 200 OK, 500 Server Error

### Search Operations by System (Public Hospitals)
```http
GET /nssf-operations/public/system/{system}
```
**Roles**: All authenticated users  
**Parameters**: 
- `system` (path): System name or Arabic name  
**Response**: Array of NSSF operations for public hospitals  
**Status Codes**: 200 OK, 500 Server Error

---

## General Search

### Search Operations (Private Hospitals)
```http
GET /nssf-operations/private/search/{query}
```
**Roles**: All authenticated users  
**Parameters**: 
- `query` (path): Search query for operation name  
**Response**: Array of matching NSSF operations for private hospitals  
**Status Codes**: 200 OK, 500 Server Error

### Search Operations (Public Hospitals)
```http
GET /nssf-operations/public/search/{query}
```
**Roles**: All authenticated users  
**Parameters**: 
- `query` (path): Search query for operation name  
**Response**: Array of matching NSSF operations for public hospitals  
**Status Codes**: 200 OK, 500 Server Error

---

## Individual Operations

### Get Operation by ID
```http
GET /nssf-operations/{operationId}
```
**Roles**: All authenticated users  
**Parameters**: 
- `operationId` (path): Operation ID (integer)
- `hospitalType` (query): Hospital type (`private` or `public`, default: `private`)  
**Response**: NSSF operation details  
**Status Codes**: 200 OK, 404 Not Found, 500 Server Error

### Get All Operations
```http
GET /nssf-operations
```
**Roles**: All authenticated users  
**Parameters**: 
- `hospitalType` (query): Hospital type (`private` or `public`, default: `private`)  
**Response**: Array of all NSSF operations  
**Status Codes**: 200 OK, 500 Server Error

---

## Response Structure
All NSSF operation endpoints return data in the following structure:

```json
{
  "id": 123,
  "name": "Operation Name",
  "nameAR": "اسم العملية",
  "description": "Operation description",
  "categoryPricing": {
    "price": 100.00,
    "currency": "USD"
  },
  "nssfCoverage": {
    "coverageRate": 0.8,
    "maxCoverage": 500.00
  },
  "patientShare": {
    "percentage": 0.2,
    "amount": 20.00
  },
  "operationSystem": {
    "systemName": "Cardiovascular",
    "systemCode": "CVS"
  }
}
```

---

# 9. WORKFLOW SYSTEM

## Overview
The workflow system manages the approval process for importation requests through different stages and role-based permissions.

---
