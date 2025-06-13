# Importation Backend APIs Implementation

This document summarizes the implementation of the backend APIs for the Importation module as per the requirements in `importation_backend_requirements.md`.

## Overview

The implementation follows the existing project architecture: **Model > Service > Controller > Route**

## Implemented APIs

### 1. Authentication (`/auth`)
- **POST** `/auth/login` - User login with JWT tokens
- **POST** `/auth/refresh` - Refresh access token  
- **POST** `/auth/logout` - Revoke refresh token

**Files Created:**
- `src/services/authService.js`
- `src/controllers/authController.js`  
- `src/routes/authRoutes.js`
- `src/middlewares/auth.js` - Authentication & authorization middleware

### 2. Enhanced User Management (`/users`)
- **GET** `/users/me` - Current user profile
- **PATCH** `/users/me` - Update own profile
- **POST** `/users/me/change-password` - Change password
- **GET** `/users` - Get all users (admin)
- **POST** `/users` - Create user (admin)
- **GET** `/users/:id` - Get user by ID (admin)
- **PATCH** `/users/:id` - Update user (admin)
- **DELETE** `/users/:id` - Delete user (admin)
- **POST** `/users/:id/reset-password` - Reset user password (admin)

**Files Enhanced:**
- `src/services/userService.js` - Added profile management methods
- `src/controllers/userProfileController.js` - New controller
- `src/routes/userProfileRoutes.js` - New routes

### 3. Importation Requests (`/importation-requests`)
- **POST** `/importation-requests` - Create new request (agent)
- **GET** `/importation-requests` - List with filtering & pagination
- **GET** `/importation-requests/:id` - Get request details
- **PATCH** `/importation-requests/:id` - Update request
- **DELETE** `/importation-requests/:id` - Remove request (admin)
- **PATCH** `/importation-requests/:id/shipping` - Update shipping info
- **PATCH** `/importation-requests/:id/warehouse` - Update warehouse info
- **PATCH** `/importation-requests/bulk-status` - Bulk status update
- **GET** `/importation-requests/export-csv` - Export to CSV

**Files Enhanced:**
- `src/services/importationRequestService.js` - Added exportToCSV method
- `src/controllers/importationRequestController.js` - New controller
- `src/routes/importationRequestRoutes.js` - New routes

### 4. RFD Requests (`/rfd-requests`)
- **POST** `/rfd-requests` - Upload RFD file & metadata
- **GET** `/rfd-requests` - Get all RFD requests
- **GET** `/rfd-requests/:id` - Get RFD request by ID
- **PATCH** `/rfd-requests/:id` - Change status (accept/refuse)
- **POST** `/rfd-requests/upload` - Upload RFD file

**Files Enhanced:**
- `src/services/rfdRequestService.js` - Already existed, no changes needed
- `src/controllers/rfdRequestController.js` - New controller
- `src/routes/rfdRequestRoutes.js` - New routes

### 5. Proforma Requests (`/proforma-requests`)
- **POST** `/proforma-requests` - Upload Proforma file & metadata
- **GET** `/proforma-requests` - Get all Proforma requests
- **GET** `/proforma-requests/:id` - Get Proforma request by ID
- **PATCH** `/proforma-requests/:id` - Sign/reject
- **POST** `/proforma-requests/upload` - Upload Proforma file

**Files Enhanced:**
- `src/services/proformaRequestService.js` - Already existed, no changes needed
- `src/controllers/proformaRequestController.js` - New controller
- `src/routes/proformaRequestRoutes.js` - New routes

### 6. Swift Payments (`/swift-payments`)
- **POST** `/swift-payments` - Upload Swift payment proof
- **GET** `/swift-payments` - Get all Swift payments
- **GET** `/swift-payments/:id` - Get Swift payment by ID
- **PATCH** `/swift-payments/:id` - Approve/reject
- **POST** `/swift-payments/upload` - Upload Swift payment file

**Files Enhanced:**
- `src/services/swiftPaymentService.js` - Added missing methods
- `src/controllers/swiftPaymentController.js` - New controller
- `src/routes/swiftPaymentRoutes.js` - New routes

### 7. Importation Announcements (`/importation-announcements`)
- **POST** `/importation-announcements` - Create announcement (import_export)
- **GET** `/importation-announcements` - List visible announcements
- **GET** `/importation-announcements/:id` - Get announcement by ID
- **PATCH** `/importation-announcements/:id` - Update announcement
- **DELETE** `/importation-announcements/:id` - Remove announcement
- **POST** `/importation-announcements/:id/view` - Mark as viewed

**Files Enhanced:**
- `src/services/importationAnnouncementService.js` - Added missing methods
- `src/controllers/importationAnnouncementController.js` - New controller
- `src/routes/importationAnnouncementRoutes.js` - New routes

### 8. File Storage (`/files`)
- **POST** `/files` - Upload file (multipart/form-data)
- **GET** `/files/:fileId` - Get signed URL download
- **DELETE** `/files/:fileId` - Delete file (admin)
- **GET** `/files/:fileId/download` - Direct file download

**Files Created:**
- `src/services/fileStorageService.js` - New file storage service
- `src/controllers/fileStorageController.js` - New controller
- `src/routes/fileStorageRoutes.js` - New routes

## Role-Based Access Control

The implementation includes comprehensive role-based access control:

### Roles
- **agent** - External suppliers/manufacturers
- **import_export** - Internal staff managing workflow
- **head_pharmacy** - Authorizes Swift payments
- **inspector** - Warehouse/customs inspectors
- **admin** - Technical/IT admin

### Middleware
- `authenticateToken` - Validates JWT tokens
- `authorizeRoles(...roles)` - Restricts access to specific roles
- `authorizeOwnerOrAdmin` - Allows access to resource owners or admins

## Key Features

### Security
- JWT-based authentication with access/refresh tokens
- Role-based authorization
- Password hashing with bcrypt
- File upload validation
- Signed URLs for secure file downloads

### File Management
- Secure file upload with validation
- Checksum verification
- File type restrictions
- Storage abstraction (can be extended for cloud storage)

### Data Validation
- Input validation in controllers
- Proper error handling and responses
- Consistent API response format

### Documentation
- Complete Swagger/OpenAPI documentation
- Detailed schema definitions
- Example requests and responses

## Database Models

All endpoints use existing Sequelize models:
- `ImportationRequest`
- `RFDRequest` 
- `ProformaRequest`
- `SwiftPayment`
- `ImportationAnnouncement`
- `UserAccounts`
- `Roles`

## Updated Files

### Main Application
- `index.js` - Added new route imports and registrations

### New Files Created
- `src/middlewares/auth.js`
- `src/services/authService.js`
- `src/services/fileStorageService.js`
- `src/controllers/authController.js`
- `src/controllers/importationRequestController.js`
- `src/controllers/rfdRequestController.js`
- `src/controllers/proformaRequestController.js`
- `src/controllers/swiftPaymentController.js`
- `src/controllers/importationAnnouncementController.js`
- `src/controllers/fileStorageController.js`
- `src/controllers/userProfileController.js`
- `src/routes/authRoutes.js`
- `src/routes/importationRequestRoutes.js`
- `src/routes/rfdRequestRoutes.js`
- `src/routes/proformaRequestRoutes.js`
- `src/routes/swiftPaymentRoutes.js`
- `src/routes/importationAnnouncementRoutes.js`
- `src/routes/fileStorageRoutes.js`
- `src/routes/userProfileRoutes.js`

### Enhanced Files
- `src/services/userService.js` - Added profile management methods
- `src/services/importationRequestService.js` - Added exportToCSV method
- `src/services/swiftPaymentService.js` - Added missing methods
- `src/services/importationAnnouncementService.js` - Added missing methods

## Next Steps

1. **Test the APIs** - Use the Swagger documentation at `/api-docs` to test all endpoints
2. **Database Setup** - Ensure all required tables exist with proper relationships
3. **Environment Variables** - Set up JWT secrets, file paths, etc.
4. **File Storage** - Configure upload directory and permissions
5. **Frontend Integration** - Update frontend to use new authentication and APIs

## API Documentation

Access the complete API documentation at: `http://localhost:3000/api-docs`

All endpoints are fully documented with request/response schemas, examples, and authentication requirements.
