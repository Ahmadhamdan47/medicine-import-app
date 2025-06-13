# Importation Module API Documentation

## Overview
The importation module provides RESTful APIs for managing the complete importation workflow, from initial requests to final delivery. All APIs require authentication and implement role-based access control.

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Role-Based Access Control

### Roles and Permissions
| Role | Permissions |
|------|-------------|
| **agent** | Create and view own requests, upload documents |
| **import_export** | Manage all requests, approve RFDs, update shipping |
| **head_pharmacy** | Approve swift payments, view all requests |
| **inspector** | Perform inspections, update inspection status |
| **admin** | Full access to all operations |

## Base URL
```
https://your-domain.com/api
```

---

# 1. Importation Requests API

## 1.1 Create Importation Request
**POST** `/importation-requests`

Creates a new importation request.

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body
```json
{
  "drugName": "Paracetamol",
  "brandName": "Panadol",
  "manufacturerId": 123,
  "quantityRequested": 1000,
  "unitPrice": 2.50,
  "urgencyLevel": "medium",
  "description": "Pain relief medication",
  "indication": "Fever and pain management",
  "dosageForm": "tablet",
  "strength": "500mg",
  "packSize": 20,
  "countryOfOrigin": "UK",
  "requestedDeliveryDate": "2025-07-15",
  "notes": "Urgent requirement for pediatric ward"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 456,
    "agentId": 789,
    "drugName": "Paracetamol",
    "brandName": "Panadol",
    "status": "pending",
    "urgencyLevel": "medium",
    "totalValue": 2500.00,
    "submittedDate": "2025-06-13T10:30:00Z",
    "createdDate": "2025-06-13T10:30:00Z"
  },
  "message": "Importation request created successfully"
}
```

### Access Control
- **agent**: Can create requests for their own agency
- **import_export, admin**: Can create requests for any agency

---

## 1.2 Get All Importation Requests
**GET** `/importation-requests`

Retrieves importation requests with filtering and pagination.

### Query Parameters
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | integer | Page number | 1 |
| limit | integer | Items per page | 10 |
| status | string | Filter by status | all |
| urgencyLevel | string | Filter by urgency | all |
| agentId | integer | Filter by agent | current user's agency |
| startDate | date | Filter from date | - |
| endDate | date | Filter to date | - |
| search | string | Search in drug/brand name | - |

### Example Request
```
GET /importation-requests?page=1&limit=20&status=pending&urgencyLevel=high
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": 456,
        "agentId": 789,
        "drugName": "Paracetamol",
        "brandName": "Panadol",
        "status": "pending",
        "urgencyLevel": "high",
        "quantityRequested": 1000,
        "totalValue": 2500.00,
        "submittedDate": "2025-06-13T10:30:00Z",
        "agent": {
          "id": 789,
          "username": "agent_user",
          "email": "agent@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Access Control
- **agent**: See only their own requests
- **import_export, head_pharmacy, inspector, admin**: See all requests

---

## 1.3 Get Single Importation Request
**GET** `/importation-requests/:id`

Retrieves detailed information about a specific request.

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 456,
    "agentId": 789,
    "drugName": "Paracetamol",
    "brandName": "Panadol",
    "manufacturerId": 123,
    "quantityRequested": 1000,
    "unitPrice": 2.50,
    "totalValue": 2500.00,
    "status": "pending",
    "urgencyLevel": "medium",
    "description": "Pain relief medication",
    "indication": "Fever and pain management",
    "dosageForm": "tablet",
    "strength": "500mg",
    "packSize": 20,
    "countryOfOrigin": "UK",
    "requestedDeliveryDate": "2025-07-15",
    "submittedDate": "2025-06-13T10:30:00Z",
    "rfdRequests": [
      {
        "id": 123,
        "status": "approved",
        "fileName": "drug_documentation.pdf",
        "approvedDate": "2025-06-14T09:00:00Z"
      }
    ],
    "proformaRequests": [],
    "swiftPayments": [],
    "workflowHistory": [
      {
        "fromStatus": null,
        "toStatus": "pending",
        "changeDate": "2025-06-13T10:30:00Z",
        "changedBy": 789,
        "comments": "Initial submission"
      }
    ]
  }
}
```

---

## 1.4 Update Importation Request
**PUT** `/importation-requests/:id`

Updates an existing importation request.

### Request Body
```json
{
  "quantityRequested": 1500,
  "unitPrice": 2.75,
  "urgencyLevel": "high",
  "notes": "Updated quantity due to increased demand"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 456,
    "quantityRequested": 1500,
    "unitPrice": 2.75,
    "totalValue": 4125.00,
    "urgencyLevel": "high",
    "updatedDate": "2025-06-13T14:20:00Z"
  },
  "message": "Importation request updated successfully"
}
```

### Access Control
- **agent**: Can update own pending requests
- **import_export, admin**: Can update any request

---

## 1.5 Update Request Status
**PATCH** `/importation-requests/:id/status`

Updates the status of an importation request.

### Request Body
```json
{
  "status": "under_review",
  "comments": "Moving to review phase"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 456,
    "status": "under_review",
    "lastStatusUpdate": "2025-06-13T15:00:00Z"
  },
  "message": "Status updated successfully"
}
```

### Access Control
- **import_export**: Can change any status
- **inspector**: Can update inspection-related statuses
- **head_pharmacy**: Can approve final statuses

---

## 1.6 Update Shipping Information
**PATCH** `/importation-requests/:id/shipping`

Updates shipping and logistics information.

### Request Body
```json
{
  "estimatedShippingDate": "2025-07-01",
  "shippingCarrier": "DHL Express",
  "trackingNumber": "DHL123456789",
  "warehouseLocation": "Main Warehouse A"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 456,
    "estimatedShippingDate": "2025-07-01",
    "shippingCarrier": "DHL Express",
    "trackingNumber": "DHL123456789",
    "warehouseLocation": "Main Warehouse A",
    "status": "shipping"
  },
  "message": "Shipping information updated successfully"
}
```

### Access Control
- **import_export, admin**: Full shipping management
- **inspector**: Can update warehouse information

---

## 1.7 Bulk Operations
**POST** `/importation-requests/bulk`

Performs bulk operations on multiple requests.

### Request Body
```json
{
  "operation": "updateStatus",
  "requestIds": [456, 457, 458],
  "data": {
    "status": "under_review",
    "comments": "Batch review initiated"
  }
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "processed": 3,
    "failed": 0,
    "results": [
      {"id": 456, "status": "success"},
      {"id": 457, "status": "success"},
      {"id": 458, "status": "success"}
    ]
  },
  "message": "Bulk operation completed"
}
```

---

## 1.8 Export to CSV
**GET** `/importation-requests/export`

Exports filtered requests to CSV format.

### Query Parameters
Same as GET all requests, plus:
| Parameter | Type | Description |
|-----------|------|-------------|
| format | string | Export format (csv, excel) |
| fields | string | Comma-separated field list |

### Response (200 OK)
```
Content-Type: text/csv
Content-Disposition: attachment; filename="importation_requests_2025-06-13.csv"

ID,Drug Name,Brand Name,Status,Quantity,Total Value,Submitted Date
456,Paracetamol,Panadol,pending,1000,2500.00,2025-06-13
457,Amoxicillin,Augmentin,approved,500,1250.00,2025-06-12
```

---

# 2. RFD Requests API

## 2.1 Upload RFD Document
**POST** `/rfd-requests`

Uploads an RFD document for an importation request.

### Headers
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Request Body (multipart/form-data)
```
importationRequestId: 456
file: [PDF file]
metadata: {"documentType": "certificate", "issuingAuthority": "FDA"}
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 123,
    "importationRequestId": 456,
    "fileId": "uuid-file-id",
    "fileName": "drug_certificate.pdf",
    "fileSize": 1048576,
    "status": "pending",
    "createdDate": "2025-06-13T16:00:00Z"
  },
  "message": "RFD document uploaded successfully"
}
```

### File Validation
- **Allowed types**: PDF, DOC, DOCX, JPG, PNG
- **Max size**: 10MB
- **Virus scanning**: Automatic
- **Checksum**: Calculated for integrity

---

## 2.2 Get RFD Requests
**GET** `/rfd-requests`

Retrieves RFD requests with filtering.

### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| importationRequestId | integer | Filter by parent request |
| status | string | Filter by approval status |
| page | integer | Page number |
| limit | integer | Items per page |

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "rfdRequests": [
      {
        "id": 123,
        "importationRequestId": 456,
        "fileName": "drug_certificate.pdf",
        "fileSize": 1048576,
        "status": "pending",
        "createdDate": "2025-06-13T16:00:00Z",
        "importationRequest": {
          "id": 456,
          "drugName": "Paracetamol",
          "agentId": 789
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5
    }
  }
}
```

---

## 2.3 Approve/Reject RFD
**PATCH** `/rfd-requests/:id/status`

Approves or rejects an RFD document.

### Request Body
```json
{
  "status": "approved",
  "comments": "Document meets all requirements"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 123,
    "status": "approved",
    "approvedBy": 890,
    "approvedDate": "2025-06-14T09:00:00Z"
  },
  "message": "RFD request approved successfully"
}
```

### Access Control
- **import_export, admin**: Can approve/reject RFDs

---

## 2.4 Download RFD Document
**GET** `/rfd-requests/:id/download`

Downloads the RFD document file.

### Response (200 OK)
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="drug_certificate.pdf"
X-File-Size: 1048576
X-Checksum: sha256:abc123...

[Binary file content]
```

### Access Control
- **agent**: Can download own RFDs
- **import_export, admin**: Can download any RFD

---

# 3. Proforma Requests API

## 3.1 Upload Proforma Invoice
**POST** `/proforma-requests`

Uploads a proforma invoice for an importation request.

### Request Body (multipart/form-data)
```
importationRequestId: 456
file: [PDF file]
invoiceNumber: INV-2025-001
invoiceDate: 2025-06-15
totalAmount: 2500.00
currency: USD
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 234,
    "importationRequestId": 456,
    "fileId": "uuid-invoice-id",
    "fileName": "proforma_invoice.pdf",
    "invoiceNumber": "INV-2025-001",
    "totalAmount": 2500.00,
    "currency": "USD",
    "status": "pending",
    "createdDate": "2025-06-13T17:00:00Z"
  },
  "message": "Proforma invoice uploaded successfully"
}
```

---

## 3.2 Sign Proforma Invoice
**PATCH** `/proforma-requests/:id/sign`

Signs or rejects a proforma invoice.

### Request Body
```json
{
  "action": "sign",
  "comments": "Invoice approved for payment"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 234,
    "status": "signed",
    "signedBy": 890,
    "signedDate": "2025-06-14T10:30:00Z"
  },
  "message": "Proforma invoice signed successfully"
}
```

### Access Control
- **import_export, admin**: Can sign proforma invoices

---

# 4. Swift Payments API

## 4.1 Upload Payment Proof
**POST** `/swift-payments`

Uploads SWIFT payment proof for an importation request.

### Request Body (multipart/form-data)
```
importationRequestId: 456
file: [PDF file]
transactionReference: SWIFT123456
paymentAmount: 2500.00
paymentDate: 2025-06-15
currency: USD
senderBank: Bank of Lebanon
receiverBank: UK Bank Ltd
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 345,
    "importationRequestId": 456,
    "fileId": "uuid-payment-id",
    "fileName": "swift_payment.pdf",
    "transactionReference": "SWIFT123456",
    "paymentAmount": 2500.00,
    "status": "pending",
    "createdDate": "2025-06-13T18:00:00Z"
  },
  "message": "Payment proof uploaded successfully"
}
```

---

## 4.2 Approve Payment
**PATCH** `/swift-payments/:id/approve`

Approves or rejects a SWIFT payment.

### Request Body
```json
{
  "action": "approve",
  "comments": "Payment verified and approved"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 345,
    "status": "approved",
    "approvedBy": 891,
    "approvedDate": "2025-06-14T11:00:00Z"
  },
  "message": "Payment approved successfully"
}
```

### Access Control
- **head_pharmacy, admin**: Can approve swift payments

---

# 5. Announcements API

## 5.1 Create Announcement
**POST** `/importation-announcements`

Creates a new system announcement.

### Request Body
```json
{
  "title": "System Maintenance Notice",
  "content": "The importation system will undergo maintenance on June 20th from 2-4 AM.",
  "type": "maintenance",
  "priority": "high",
  "targetRole": "all",
  "startDate": "2025-06-19T00:00:00Z",
  "endDate": "2025-06-21T00:00:00Z"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 567,
    "title": "System Maintenance Notice",
    "type": "maintenance",
    "priority": "high",
    "targetRole": "all",
    "isActive": true,
    "createdDate": "2025-06-13T19:00:00Z"
  },
  "message": "Announcement created successfully"
}
```

### Access Control
- **import_export, admin**: Can create announcements

---

## 5.2 Get Announcements
**GET** `/importation-announcements`

Retrieves announcements for the current user's role.

### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter by announcement type |
| priority | string | Filter by priority |
| active | boolean | Show only active announcements |

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "announcements": [
      {
        "id": 567,
        "title": "System Maintenance Notice",
        "content": "The importation system will undergo maintenance...",
        "type": "maintenance",
        "priority": "high",
        "startDate": "2025-06-19T00:00:00Z",
        "endDate": "2025-06-21T00:00:00Z",
        "isViewed": false,
        "createdDate": "2025-06-13T19:00:00Z"
      }
    ]
  }
}
```

---

## 5.3 Mark Announcement as Viewed
**POST** `/importation-announcements/:id/view`

Marks an announcement as viewed by the current user.

### Response (200 OK)
```json
{
  "success": true,
  "message": "Announcement marked as viewed"
}
```

---

# 6. File Storage API

## 6.1 Upload File
**POST** `/files/upload`

Uploads a file to secure storage.

### Headers
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Request Body (multipart/form-data)
```
file: [File to upload]
isPublic: false
expiresAt: 2025-12-31T23:59:59Z
metadata: {"category": "document", "department": "pharmacy"}
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "fileId": "uuid-file-id",
    "originalName": "document.pdf",
    "fileName": "uuid-renamed.pdf",
    "mimeType": "application/pdf",
    "fileSize": 1048576,
    "checksum": "sha256:abc123...",
    "uploadedDate": "2025-06-13T20:00:00Z",
    "signedUrl": "https://storage.example.com/signed-url",
    "expiresAt": "2025-12-31T23:59:59Z"
  },
  "message": "File uploaded successfully"
}
```

### File Validation
- **Max size**: 50MB
- **Allowed types**: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, ZIP
- **Virus scanning**: Automatic
- **Encryption**: AES-256 at rest

---

## 6.2 Download File
**GET** `/files/:fileId/download`

Downloads a file by ID with access control.

### Response (200 OK)
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="document.pdf"
X-File-Size: 1048576
X-Checksum: sha256:abc123...

[Binary file content]
```

### Access Control
- File owner and authorized roles can download
- Signed URLs provide temporary access
- Download tracking for audit

---

## 6.3 Get File Information
**GET** `/files/:fileId`

Retrieves file metadata and access information.

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "fileId": "uuid-file-id",
    "originalName": "document.pdf",
    "mimeType": "application/pdf",
    "fileSize": 1048576,
    "uploadedBy": 789,
    "uploadedDate": "2025-06-13T20:00:00Z",
    "downloadCount": 5,
    "lastDownloadDate": "2025-06-14T08:30:00Z",
    "isPublic": false,
    "expiresAt": "2025-12-31T23:59:59Z"
  }
}
```

---

# 7. User Profile API

## 7.1 Get User Profile
**GET** `/users/profile`

Retrieves the current user's profile information.

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 789,
    "username": "agent_user",
    "email": "agent@example.com",
    "roleId": 2,
    "role": "agent",
    "agentId": 101,
    "profile": {
      "firstName": "John",
      "lastName": "Smith",
      "phone": "+961-1-234567",
      "lastLogin": "2025-06-13T08:00:00Z",
      "isActive": true
    }
  }
}
```

---

## 7.2 Update User Profile
**PUT** `/users/profile`

Updates the current user's profile information.

### Request Body
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+961-1-234567",
  "email": "john.smith@example.com"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 789,
    "email": "john.smith@example.com",
    "profile": {
      "firstName": "John",
      "lastName": "Smith",
      "phone": "+961-1-234567"
    }
  },
  "message": "Profile updated successfully"
}
```

---

# Error Responses

## Standard Error Format
All APIs return errors in a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Drug name is required",
    "details": {
      "field": "drugName",
      "value": null,
      "constraint": "not_null"
    }
  }
}
```

## HTTP Status Codes
| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server errors |

## Common Error Codes
- `VALIDATION_ERROR` - Request validation failed
- `AUTHENTICATION_REQUIRED` - No valid token provided
- `ACCESS_DENIED` - Insufficient permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `DUPLICATE_RESOURCE` - Resource already exists
- `FILE_TOO_LARGE` - Uploaded file exceeds limit
- `INVALID_FILE_TYPE` - File type not allowed
- `WORKFLOW_ERROR` - Invalid workflow transition

---

# Rate Limiting

## API Limits
- **Standard endpoints**: 1000 requests/hour per user
- **File upload endpoints**: 100 requests/hour per user
- **Bulk operations**: 10 requests/hour per user

## Response Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1623456789
```

---

# Webhook Support

## Event Types
The system can send webhooks for:
- `importation.request.created`
- `importation.request.status_changed`
- `rfd.document.approved`
- `proforma.invoice.signed`
- `swift.payment.approved`

## Webhook Payload
```json
{
  "event": "importation.request.status_changed",
  "timestamp": "2025-06-13T15:00:00Z",
  "data": {
    "requestId": 456,
    "fromStatus": "pending",
    "toStatus": "under_review",
    "changedBy": 890
  }
}
```
