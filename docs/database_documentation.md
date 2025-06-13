# Importation Module Database Documentation

## Overview
The importation module consists of 8 main tables that handle the complete workflow from importation requests to final approval and delivery tracking.

## Table Structure

### 1. importation_requests
**Primary table for tracking all importation requests**

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | INT AUTO_INCREMENT | Primary key | PRIMARY KEY |
| agentId | INT | ID of requesting agent | NOT NULL, FK → useraccounts.UserId |
| drugName | VARCHAR(255) | Name of requested drug | NOT NULL |
| brandName | VARCHAR(255) | Brand name | NULLABLE |
| manufacturerId | INT | Manufacturer reference | NULLABLE, FK → manufacturer.ManufacturerId |
| quantityRequested | INT | Requested quantity | NOT NULL |
| unitPrice | DECIMAL(10,2) | Price per unit | NULLABLE |
| totalValue | DECIMAL(12,2) | Total estimated value | NULLABLE |
| status | ENUM | Current request status | DEFAULT 'pending' |
| urgencyLevel | ENUM | Priority level | DEFAULT 'medium' |
| description | TEXT | Detailed description | NULLABLE |
| indication | TEXT | Medical indication | NULLABLE |
| dosageForm | VARCHAR(100) | Form (tablet, injection, etc.) | NULLABLE |
| strength | VARCHAR(100) | Drug strength | NULLABLE |
| packSize | INT | Package size | NULLABLE |
| batchNumber | VARCHAR(100) | Batch identifier | NULLABLE |
| expiryDate | DATE | Expiration date | NULLABLE |
| countryOfOrigin | VARCHAR(100) | Manufacturing country | NULLABLE |
| registrationNumber | VARCHAR(100) | Regulatory registration | NULLABLE |
| regulatoryStatus | ENUM | Registration status | DEFAULT 'pending_registration' |
| requestedDeliveryDate | DATE | Requested delivery | NULLABLE |
| notes | TEXT | Additional notes | NULLABLE |
| estimatedShippingDate | DATE | Estimated shipping | NULLABLE |
| actualShippingDate | DATE | Actual shipping date | NULLABLE |
| trackingNumber | VARCHAR(100) | Shipment tracking | NULLABLE |
| shippingCarrier | VARCHAR(100) | Shipping company | NULLABLE |
| warehouseLocation | VARCHAR(255) | Storage location | NULLABLE |
| receivedDate | DATE | Date received | NULLABLE |
| inspectionDate | DATE | Inspection date | NULLABLE |
| inspectedBy | INT | Inspector user ID | NULLABLE, FK → useraccounts.UserId |
| inspectionNotes | TEXT | Inspection notes | NULLABLE |
| exchangeRate | DECIMAL(10,4) | Currency exchange rate | NULLABLE |
| localCurrencyValue | DECIMAL(12,2) | Value in local currency | NULLABLE |
| submittedDate | DATETIME | Submission timestamp | DEFAULT CURRENT_TIMESTAMP |
| lastStatusUpdate | DATETIME | Last status change | AUTO UPDATE |
| createdDate | DATETIME | Creation timestamp | DEFAULT CURRENT_TIMESTAMP |
| updatedDate | DATETIME | Last update | AUTO UPDATE |
| createdBy | INT | Creator user ID | NULLABLE, FK → useraccounts.UserId |
| updatedBy | INT | Last updater ID | NULLABLE, FK → useraccounts.UserId |

**Status Values:**
- `pending` - Initial submission
- `under_review` - Being reviewed
- `rfd_required` - RFD document needed
- `proforma_required` - Proforma invoice needed
- `swift_required` - Payment proof needed
- `shipping` - In transit
- `inspection` - Under inspection
- `approved` - Approved and complete
- `rejected` - Rejected

**Urgency Levels:**
- `low` - Standard processing
- `medium` - Normal priority
- `high` - High priority
- `critical` - Emergency processing

**Regulatory Status:**
- `registered` - Fully registered
- `pending_registration` - Registration in progress
- `emergency_use` - Emergency authorization
- `compassionate_use` - Compassionate use approval

### 2. rfd_requests
**Handles Request for Documentation (RFD) file uploads and approvals**

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | INT AUTO_INCREMENT | Primary key | PRIMARY KEY |
| importationRequestId | INT | Parent request | NOT NULL, FK → importation_requests.id |
| fileId | VARCHAR(255) | File identifier | NULLABLE |
| fileName | VARCHAR(255) | Original filename | NULLABLE |
| filePath | VARCHAR(500) | File storage path | NULLABLE |
| fileSize | INT | File size in bytes | NULLABLE |
| checksum | VARCHAR(255) | File integrity hash | NULLABLE |
| status | ENUM | Approval status | DEFAULT 'pending' |
| approvedBy | INT | Approver user ID | NULLABLE, FK → useraccounts.UserId |
| approvedDate | DATETIME | Approval timestamp | NULLABLE |
| rejectionReason | TEXT | Reason if rejected | NULLABLE |
| metadata | JSON | Additional file info | NULLABLE |
| createdDate | DATETIME | Creation timestamp | DEFAULT CURRENT_TIMESTAMP |
| updatedDate | DATETIME | Last update | AUTO UPDATE |
| createdBy | INT | Creator user ID | NULLABLE |
| updatedBy | INT | Last updater ID | NULLABLE |

**Status Values:**
- `pending` - Awaiting review
- `approved` - Approved by reviewer
- `rejected` - Rejected with reason
- `requires_correction` - Needs modification

### 3. proforma_requests
**Manages proforma invoice uploads and signing workflow**

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | INT AUTO_INCREMENT | Primary key | PRIMARY KEY |
| importationRequestId | INT | Parent request | NOT NULL, FK → importation_requests.id |
| fileId | VARCHAR(255) | File identifier | NULLABLE |
| fileName | VARCHAR(255) | Original filename | NULLABLE |
| filePath | VARCHAR(500) | File storage path | NULLABLE |
| fileSize | INT | File size in bytes | NULLABLE |
| checksum | VARCHAR(255) | File integrity hash | NULLABLE |
| invoiceNumber | VARCHAR(100) | Invoice number | NULLABLE |
| invoiceDate | DATE | Invoice date | NULLABLE |
| totalAmount | DECIMAL(12,2) | Invoice total | NULLABLE |
| currency | VARCHAR(10) | Currency code | DEFAULT 'USD' |
| status | ENUM | Signing status | DEFAULT 'pending' |
| signedBy | INT | Signer user ID | NULLABLE, FK → useraccounts.UserId |
| signedDate | DATETIME | Signing timestamp | NULLABLE |
| rejectionReason | TEXT | Reason if rejected | NULLABLE |
| metadata | JSON | Additional invoice info | NULLABLE |
| createdDate | DATETIME | Creation timestamp | DEFAULT CURRENT_TIMESTAMP |
| updatedDate | DATETIME | Last update | AUTO UPDATE |
| createdBy | INT | Creator user ID | NULLABLE |
| updatedBy | INT | Last updater ID | NULLABLE |

**Status Values:**
- `pending` - Awaiting signature
- `signed` - Signed and approved
- `rejected` - Rejected with reason
- `requires_correction` - Needs modification

### 4. swift_payments
**Handles SWIFT payment proof uploads and approvals**

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | INT AUTO_INCREMENT | Primary key | PRIMARY KEY |
| importationRequestId | INT | Parent request | NOT NULL, FK → importation_requests.id |
| fileId | VARCHAR(255) | File identifier | NULLABLE |
| fileName | VARCHAR(255) | Original filename | NULLABLE |
| filePath | VARCHAR(500) | File storage path | NULLABLE |
| fileSize | INT | File size in bytes | NULLABLE |
| checksum | VARCHAR(255) | File integrity hash | NULLABLE |
| transactionReference | VARCHAR(100) | SWIFT reference | NULLABLE |
| paymentAmount | DECIMAL(12,2) | Payment amount | NULLABLE |
| paymentDate | DATE | Payment date | NULLABLE |
| currency | VARCHAR(10) | Currency code | DEFAULT 'USD' |
| senderBank | VARCHAR(255) | Sending bank | NULLABLE |
| receiverBank | VARCHAR(255) | Receiving bank | NULLABLE |
| status | ENUM | Approval status | DEFAULT 'pending' |
| approvedBy | INT | Approver user ID | NULLABLE, FK → useraccounts.UserId |
| approvedDate | DATETIME | Approval timestamp | NULLABLE |
| rejectionReason | TEXT | Reason if rejected | NULLABLE |
| metadata | JSON | Additional payment info | NULLABLE |
| createdDate | DATETIME | Creation timestamp | DEFAULT CURRENT_TIMESTAMP |
| updatedDate | DATETIME | Last update | AUTO UPDATE |
| createdBy | INT | Creator user ID | NULLABLE |
| updatedBy | INT | Last updater ID | NULLABLE |

**Status Values:**
- `pending` - Awaiting verification
- `approved` - Approved by head of pharmacy
- `rejected` - Rejected with reason
- `verification_required` - Needs additional verification

### 5. importation_announcements
**System-wide announcements for importation module users**

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | INT AUTO_INCREMENT | Primary key | PRIMARY KEY |
| title | VARCHAR(255) | Announcement title | NOT NULL |
| content | TEXT | Announcement content | NOT NULL |
| type | ENUM | Announcement type | DEFAULT 'general' |
| priority | ENUM | Priority level | DEFAULT 'medium' |
| targetRole | VARCHAR(50) | Target user role | NULLABLE (null = all roles) |
| isActive | BOOLEAN | Active status | DEFAULT TRUE |
| startDate | DATETIME | Start visibility | NULLABLE |
| endDate | DATETIME | End visibility | NULLABLE |
| attachmentFileId | VARCHAR(255) | Attached file | NULLABLE |
| metadata | JSON | Additional data | NULLABLE |
| viewCount | INT | Total views | DEFAULT 0 |
| createdDate | DATETIME | Creation timestamp | DEFAULT CURRENT_TIMESTAMP |
| updatedDate | DATETIME | Last update | AUTO UPDATE |
| createdBy | INT | Creator user ID | NULLABLE, FK → useraccounts.UserId |
| updatedBy | INT | Last updater ID | NULLABLE, FK → useraccounts.UserId |

**Announcement Types:**
- `general` - General information
- `urgent` - Urgent notification
- `policy` - Policy changes
- `deadline` - Deadline reminders
- `maintenance` - System maintenance

**Priority Levels:**
- `low` - Low priority
- `medium` - Normal priority
- `high` - High priority
- `critical` - Critical announcement

### 6. announcement_views
**Tracks which users have viewed announcements**

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | INT AUTO_INCREMENT | Primary key | PRIMARY KEY |
| announcementId | INT | Announcement reference | NOT NULL, FK → importation_announcements.id |
| userId | INT | Viewing user | NOT NULL, FK → useraccounts.UserId |
| viewedAt | DATETIME | View timestamp | DEFAULT CURRENT_TIMESTAMP |

**Constraints:**
- UNIQUE KEY (announcementId, userId) - Prevents duplicate views

### 7. file_storage
**Secure file storage system for all importation documents**

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | UUID primary key | PRIMARY KEY |
| originalName | VARCHAR(255) | Original filename | NOT NULL |
| fileName | VARCHAR(255) | Stored filename | NOT NULL |
| filePath | VARCHAR(500) | Storage path | NOT NULL |
| mimeType | VARCHAR(100) | File MIME type | NULLABLE |
| fileSize | INT | File size in bytes | NULLABLE |
| checksum | VARCHAR(255) | File integrity hash | NULLABLE |
| uploadedBy | INT | Uploader user ID | NULLABLE, FK → useraccounts.UserId |
| uploadedDate | DATETIME | Upload timestamp | DEFAULT CURRENT_TIMESTAMP |
| isPublic | BOOLEAN | Public access flag | DEFAULT FALSE |
| expiresAt | DATETIME | Expiration date | NULLABLE |
| metadata | JSON | Additional file info | NULLABLE |
| downloadCount | INT | Download counter | DEFAULT 0 |
| lastDownloadDate | DATETIME | Last download | NULLABLE |

### 8. importation_workflow_history
**Audit trail for all status changes and workflow actions**

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | INT AUTO_INCREMENT | Primary key | PRIMARY KEY |
| importationRequestId | INT | Request reference | NOT NULL, FK → importation_requests.id |
| fromStatus | VARCHAR(50) | Previous status | NULLABLE |
| toStatus | VARCHAR(50) | New status | NOT NULL |
| changedBy | INT | User making change | NULLABLE, FK → useraccounts.UserId |
| changeDate | DATETIME | Change timestamp | DEFAULT CURRENT_TIMESTAMP |
| comments | TEXT | Change comments | NULLABLE |
| metadata | JSON | Additional change info | NULLABLE |

## Database Relationships

### Primary Relationships
```
importation_requests (1) → (many) rfd_requests
importation_requests (1) → (many) proforma_requests  
importation_requests (1) → (many) swift_payments
importation_requests (1) → (many) importation_workflow_history

useraccounts (1) → (many) importation_requests (via agentId)
useraccounts (1) → (many) file_storage (via uploadedBy)
useraccounts (1) → (many) importation_announcements (via createdBy)

importation_announcements (1) → (many) announcement_views
```

### Foreign Key Constraints
- All foreign keys include CASCADE DELETE where appropriate
- User references maintain referential integrity
- File references link to secure storage system

## Indexes for Performance

### Primary Indexes
- All tables have clustered primary key indexes
- Foreign key columns have non-clustered indexes
- Status columns have filtered indexes for common queries

### Search Optimization
- Drug name and brand name have text indexes
- Date fields have range indexes for time-based queries
- Status fields have covering indexes for dashboard views

## Security Considerations

### Access Control
- All tables respect role-based access control
- File storage includes checksum verification
- Audit trail tracks all modifications

### Data Protection
- Sensitive financial data encrypted at rest
- File uploads validated and sandboxed
- User actions logged for compliance
