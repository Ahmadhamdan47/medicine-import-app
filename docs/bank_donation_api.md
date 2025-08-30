# Bank Donation API Documentation

## Overview
The Bank Donation API allows applications to send money donation requests to the bank via email. This is a separate system from the existing drug donations and is specifically designed for monetary contributions.

## Base URL
```
http://localhost:8066/api/bank-donations
```

## Email Configuration
- **Sender:** ahmadhamdan47@gmail.com
- **Bank Email (To):** nizarakleh@gmail.com  
- **Admin CC:** oummalorg@gmail.com

## API Endpoints

### 1. Create Bank Donation
Creates a new money donation request and automatically sends an email to the bank.

**Endpoint:** `POST /api/bank-donations`

**Request Body:**
```json
{
  "donor_type": "personal", // or "entity"
  "account_holder": "John Doe",
  "contact_person": "Jane Smith", // optional, mainly for entities
  "mobile_number": "+961-70-123456",
  "email_address": "john.doe@example.com",
  "amount": 150.50,
  "currency": "USD", // optional, defaults to USD
  "notes": "Optional notes about the donation" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bank donation created successfully and notification sent to bank",
  "data": {
    "id": 1,
    "donor_type": "personal",
    "account_holder": "John Doe",
    "mobile_number": "+961-70-123456",
    "email_address": "john.doe@example.com",
    "amount": "150.50",
    "currency": "USD",
    "status": "sent_to_bank",
    "bank_email_sent_at": "2025-08-30T10:30:00.000Z",
    "created_at": "2025-08-30T10:30:00.000Z",
    "updated_at": "2025-08-30T10:30:00.000Z"
  }
}
```

### 2. Get All Bank Donations
Retrieves all bank donations with pagination and optional filters.

**Endpoint:** `GET /api/bank-donations`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `donor_type` (optional): Filter by donor type ('personal' or 'entity')
- `status` (optional): Filter by status ('pending', 'sent_to_bank', 'confirmed', 'rejected')
- `currency` (optional): Filter by currency
- `amount_min` (optional): Minimum amount filter
- `amount_max` (optional): Maximum amount filter
- `date_from` (optional): Start date filter
- `date_to` (optional): End date filter

**Example:** `GET /api/bank-donations?page=1&limit=5&donor_type=personal&status=confirmed`

### 3. Get Bank Donation by ID
Retrieves a specific bank donation by its ID.

**Endpoint:** `GET /api/bank-donations/:id`

### 4. Update Bank Donation Status
Updates the status of a bank donation (typically used after bank confirmation).

**Endpoint:** `PUT /api/bank-donations/:id/status`

**Request Body:**
```json
{
  "status": "confirmed", // or "rejected"
  "bank_reference_number": "BNK-2025-001" // optional
}
```

### 5. Get Donation Statistics
Retrieves overall donation statistics.

**Endpoint:** `GET /api/bank-donations/statistics`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDonations": 25,
    "pendingCount": 3,
    "confirmedCount": 20,
    "totalAmount": 15750.00,
    "donationsByCurrency": [
      {
        "currency": "USD",
        "totalAmount": 12500.00,
        "count": 18
      },
      {
        "currency": "LBP",
        "totalAmount": 3250.00,
        "count": 2
      }
    ]
  }
}
```

### 6. Search Donations
Searches donations by donor information.

**Endpoint:** `GET /api/bank-donations/search?q=searchterm`

**Query Parameters:**
- `q` (required): Search term
- `page` (optional): Page number
- `limit` (optional): Items per page

### 7. Resend Bank Notification
Resends the bank notification email for a specific donation.

**Endpoint:** `POST /api/bank-donations/:id/resend-notification`

## Data Models

### BankDonation
```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  donor_type: ENUM('personal', 'entity'),
  account_holder: STRING(255),
  contact_person: STRING(255) // nullable
  mobile_number: STRING(20),
  email_address: STRING(255),
  amount: DECIMAL(15, 2),
  currency: STRING(3), // default 'USD'
  status: ENUM('pending', 'sent_to_bank', 'confirmed', 'rejected'),
  bank_email_sent_at: DATE, // nullable
  bank_reference_number: STRING(100), // nullable
  notes: TEXT, // nullable
  created_at: DATE,
  updated_at: DATE
}
```

## Email Template
When a donation is created, an email is automatically sent to the bank with the following format:

```
Subject: New Money Donation - Reference #[ID]

Dear Bank Team,

We have received a new money donation request with the following details:

DONATION DETAILS:
================
Reference Number: #[ID]
Date: [Current Date]

DONOR INFORMATION:
==================
Donor Type: [Personal/Entity]
Account Holder: [Name]
Contact Person: [Name] (if entity)
Mobile Number: [Phone]
Email Address: [Email]

FINANCIAL DETAILS:
==================
Amount: [Amount] [Currency]
Currency: [Currency Code]

ADDITIONAL NOTES: (if provided)
==================
[Notes]

Please process this donation request and provide us with a bank reference number once completed.

Best regards,
Ommal Medicine Import System
```

## Error Handling

### Validation Errors (400)
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "msg": "Donor type must be either \"personal\" or \"entity\"",
      "param": "donor_type",
      "location": "body"
    }
  ]
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Bank donation not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Error creating bank donation: [specific error message]"
}
```

## Usage Examples

### Example 1: Personal Donation
```javascript
const donation = {
  donor_type: 'personal',
  account_holder: 'Ahmad Hamdan',
  mobile_number: '+961-70-123456',
  email_address: 'ahmadhamdan47@gmail.com',
  amount: 200.00,
  currency: 'USD',
  notes: 'Monthly donation for medicine supplies'
};

fetch('/api/bank-donations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(donation)
});
```

### Example 2: Entity Donation
```javascript
const donation = {
  donor_type: 'entity',
  account_holder: 'XYZ Corporation',
  contact_person: 'John Smith',
  mobile_number: '+961-71-987654',
  email_address: 'contact@xyzcorp.com',
  amount: 5000.00,
  currency: 'USD',
  notes: 'Annual corporate donation'
};
```

## Setup Instructions

1. **Create Database Table:**
   ```bash
   node scripts/createBankDonationTable.js
   ```

2. **Test the API:**
   ```bash
   node test_bank_donations.js
   ```

3. **View Swagger Documentation:**
   Visit: `http://localhost:8066/api-docs`

## Status Flow
1. **pending** → Initial status when donation is created
2. **sent_to_bank** → Email sent to bank successfully  
3. **confirmed** → Bank has processed and confirmed the donation
4. **rejected** → Bank has rejected the donation request
