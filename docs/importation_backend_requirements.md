Backend Requirements – Importation Module
========================================

Purpose
-------
This document enumerates the minimum backend work necessary to replace the current **in-memory / localStorage** implementation with a fully-featured server-side backend for the Importation module.  It is split into two parts:

1. **Accounts & Roles** – which user and service accounts must exist.
2. **APIs** – endpoints that must be implemented (or wired to existing services) so the front-end can persist and retrieve data from a real database.

--------------------------------------------------------------------

1  Accounts & Roles
-------------------
Below is the canonical list of **user roles** used in the UI together with a short description and recommended permissions.  Every production environment (DEV / QA / PROD) should have at least one active account for each role so that end-to-end tests can run.

| Role key in UI | Purpose / who uses it | Minimum privileges |
|----------------|-----------------------|--------------------|
| **agent** | External supplier / manufacturer representative who submits new importation requests and uploads subsequent documents (RFD, Pro forma, Swift, …). | • Create / view **own** requests<br/>• Upload/replace files tied to own requests<br/>• View decision history & status |
| **import_export** | Internal Import / Export department staff who review requests, approve quantities, and manage RFD & Pro-forma workflow. | • Full CRUD on **all** requests<br/>• Change status & add remarks<br/>• See / download all attachments |
| **head_pharmacy** | Head of Pharmacy who authorises Swift payments and gives final sign-off. | • Read-only on previous steps<br/>• Approve / reject Swift payment<br/>• Update shipping & border-crossing info |
| **inspector** | Warehouse / customs inspector who performs the final quality check. | • Read-only on requests<br/>• Update inspection outcome & batch details |
| **admin** *(new)* | Technical / IT admin for user & reference-data management. | • Manage users & roles<br/>• Manage reference tables (ATC codes, warehouses…) |

Service accounts (non-human):
• **notification-svc** – allowed to call the email/SMS gateway.
• **file-processor** – has write access to the file-storage bucket to generate thumbnails / virus-scan uploads.


--------------------------------------------------------------------

2  API Surface
--------------
The existing front-end already expects the following data models:
• ImportationRequest
• RFDRequest
• ProformaRequest
• ImportationAnnouncement

For each entity we need a **REST**  resource with predictable CRUD verbs.  The tables below use REST for clarity.

### 2.1 Authentication
| Method | Path | Body / Params | Description |
|--------|------|---------------|-------------|
| POST | /auth/login | email, password | Issue access & refresh tokens |
| POST | /auth/refresh | refresh_token | Rotate tokens |
| POST | /auth/logout | – | Revoke refresh token |

### 2.2 Users
| GET | /users/me | – | Current user profile |
| PATCH | /users/me | profile fields | Update own profile |
| (admin) CRUD | /users | – | Full user management |

### 2.3 Importation Requests
| Method | Path | Purpose |
|--------|------|---------|
| POST | /importation-requests | Create new request (agent) |
| GET | /importation-requests | List (filter by status, pagination) |
| GET | /importation-requests/{id} | Details including nested workflow object |
| PATCH | /importation-requests/{id} | Update editable fields / status |
| DELETE | /importation-requests/{id} | Remove (admin only) |

**Bulk endpoints (optional)** – /importation-requests/bulk-status, /importation-requests/export-csv

### 2.4 RFD Declarations
| POST | /rfd-requests | Upload RFD file & metadata |
| PATCH | /rfd-requests/{id} | Change status (accept / refuse) |

### 2.5 Pro-forma Invoices
| POST | /proforma-requests | Upload Pro-forma file & metadata |
| PATCH | /proforma-requests/{id} | Sign / reject |

### 2.6 Swift Payments
| POST | /swift-payments | Upload Swift payment proof |
| PATCH | /swift-payments/{id} | Approve / reject |

### 2.7 Shipping & Warehouse
| PATCH | /importation-requests/{id}/shipping | Update shipping method, ETA, border crossing |
| PATCH | /importation-requests/{id}/warehouse | Update warehouse info, batch list |

### 2.8 Importation Announcements
| POST | /importation-announcements | Create announcement (import_export) |
| GET | /importation-announcements | List visible announcements |
| DELETE | /importation-announcements/{id} | Remove |

### 2.9 File Storage
All document uploads (RFD, Pro-forma, Swift, etc.) should be stored in an object store (e.g., AWS S3, Azure Blob).  API contract:
| POST | /files | multipart/form-data | Returns `fileId`, `url`, `checksum` |
| GET | /files/{fileId} | – | Signed URL download |

--------------------------------------------------------------------

