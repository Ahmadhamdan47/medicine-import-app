# Drug Import & Update Workflow (Complete Frontend Guide)

This document consolidates ALL logic, endpoints, request/response formats, authentication and role requirements for the enhanced drug update workflow. It is written in plain English first, then gives precise technical details so the frontend can integrate confidently.

---
## 1. High-Level Explanation (Plain English)

An admin user signs in, uploads a spreadsheet (CSV or TSV) containing drug information. The system scans the headers, suggests how each column maps to fields in the database, and converts Lebanese Lira price values to USD automatically. The admin can adjust the column mapping (choose which CSV headers correspond to database columns). Then, before touching the live data, the system builds a temporary “working copy” table and shows what would change: which rows are updates versus new inserts and what fields would be modified.

If the preview looks good, the admin applies the changes to the working copy (still not live). They can then review a final diff that compares original data with staged changes. Finally, the admin either commits (replaces the live table with the working table) or rolls back (throws everything away without modifying the live table). The system keeps a backup copy of the original table during the session (until rollback or cleanup). All steps are performed within an import session identified by a unique sessionId.

Key safety measures: optional columns are allowed (missing ones are skipped), currency conversion happens on the fly, and rollback simply discards the session tables before commit to avoid foreign key issues. Only the admin (and optionally other privileged roles you allow) can execute this workflow. Normal users/agents cannot modify drug master data.

Physical backups: before we create the session backup table and again just before committing to live, the service writes a physical SQL dump of the live `drug` table to `db/` (e.g., `db/drug_table_backup_pre-preview_YYYYMMDD-HHmmss_<session>.sql` and `db/drug_table_backup_pre-commit_...`). This gives you a file-based snapshot in addition to the in-database backup table.

---
## 2. Role & Authentication Requirements

| Capability | Required Role (Recommended) | Notes |
|------------|-----------------------------|-------|
| Start drug import session | admin | Can also extend to `pharmacy_service` if needed |
| Upload/Analyze CSV | admin | Session created on upload |
| Set Column Mapping | admin | Validates mapping contains MoPH code |
| Preview Changes | admin | Read-only check of proposed modifications |
| Apply Changes (stage) | admin | Writes to working table only |
| Final Changes (diff) | admin | Compares backup vs working |
| Commit | admin | Irreversible replacement of live table |
| Rollback (pre-commit) | admin | Drops session tables; leaves live table untouched |
| List Sessions | admin | Operational oversight |

Authentication: Login via `/api/users/login` (see existing `userRoutes.js`). Supply `Authorization: Bearer <token>` for protected endpoints. The response from login typically returns: `token`, `role`, optional profile info. Store the token client-side (e.g. localStorage) and include in every subsequent request.

Admin account: Must exist in the database with the `Admin` role (RoleName: `Admin`). Scripts like `addImportationRoles.js` and `addNewRoles.js` ensure all necessary roles are present.

Login endpoint (from `userRoutes.js`):

```
POST /api/users/login
Body: { "username": "admin_username", "password": "secret" }
Response: { token, role, donorData?, email? }
```

After login, front end stores the token and proceeds with the workflow.

---
## 3. Workflow Overview (Technical Sequence)

```
Available Columns → Upload & Analyze → Set Mapping → Preview → Apply → Final Changes → Commit or Rollback
```

Each step requires the `sessionId` obtained at upload time, except the initial utility call.

Tables used internally:
- `drug` (live / authoritative)
- `drug_backup_<sessionId>` (original snapshot)
- `drug_working_<sessionId>` (staged modified copy)

Session states tracked in memory; final commit renames tables atomically. Rollback (before commit) deletes backup and working tables without touching `drug`.

Currency conversion: Columns recognized as currency (`Public Price LL`, `PublicPrice LL`, `Price LL`) are converted using `LBP_TO_USD_RATE = 89500`. Example: 1,790,000 LBP → 20.00 USD.

---
## 4. Endpoints (Drug Import Routes)

Base prefix (as registered in `index.js`):
```
/api/drug-import
```

### 4.1 GET /api/drug-import/available-columns
Returns all database columns that can be mapped plus default suggestions and currency conversion info.

Response sample:
```json
{
  "success": true,
  "availableColumns": ["MoPHCode", "DrugName", "PublicPrice", "Form"],
  "defaultMappings": {"Code": "MoPHCode", "Brand name": "DrugName"},
  "currencyConversion": {"columns": ["Public Price LL"], "rate": 89500}
}
```

### 4.2 POST /api/drug-import/upload-analyze
Multipart form-data with file field name: `csvFile`.
Analyzes headers, samples rows, creates session, makes backup + working placeholders.

Response sample:
```json
{
  "success": true,
  "sessionId": "drug_update_1763126406169_abcd1234",
  "fileName": "sample.csv",
  "analysis": {
    "headers": ["Code", "Brand name", "Public Price LL"],
    "sampleData": [{"Code": "123", "Brand name": "Demo", "Public Price LL": "1790000"}],
    "rowCount": 4,
    "suggestedMappings": {"Code": "MoPHCode", "Brand name": "DrugName", "Public Price LL": "PublicPrice"},
    "currencyColumns": ["Public Price LL"],
    "exchangeRate": 89500
  },
  "nextStep": "POST /api/drug-import/set-mapping"
}
```

### 4.3 POST /api/drug-import/set-mapping
Body:
```json
{
  "sessionId": "drug_update_1763126406169_abcd1234",
  "columnMapping": {
    "Code": "MoPHCode",
    "Brand name": "DrugName",
    "Public Price LL": "PublicPrice",
    "Strength": "Dosage"
  }
}
```
Response includes validation info (required MoPHCode presence, warnings for unmapped headers):
```json
{
  "success": true,
  "mappingCount": 4,
  "validation": {"valid": true, "errors": [], "warnings": []},
  "nextStep": "GET /api/drug-import/preview/:sessionId"
}
```

### 4.4 GET /api/drug-import/preview/:sessionId
Computes potential inserts and updates (NO writes yet). Provides summary + detailed changes.
```json
{
  "success": true,
  "preview": {
    "summary": {"totalRows": 4, "updates": 4, "inserts": 0, "errors": 0, "skippedColumns": []},
    "details": {
      "updates": [{"MoPHCode": "123", "changes": {"PublicPrice": {"from": 18.5, "to": 20.0}}}],
      "inserts": [],
      "errors": []
    }
  },
  "nextStep": "POST /api/drug-import/apply/:sessionId"
}
```

### 4.5 POST /api/drug-import/apply/:sessionId
Creates working copy (if not already) and performs staged updates/inserts on working table only.
```json
{
  "success": true,
  "result": {"updatedCount": 4, "insertedCount": 0, "totalProcessed": 4, "skippedColumns": []},
  "nextStep": "GET /api/drug-import/final-changes/:sessionId"
}
```

### 4.6 GET /api/drug-import/final-changes/:sessionId
Returns unified diff (INSERT / DELETE / UPDATE) based on comparison of backup vs working.
```json
{
  "success": true,
  "finalChanges": [
    {"MoPHCode": "123", "ChangeType": "UPDATE", "Original_DrugName": "Old", "New_DrugName": "New"}
  ],
  "changeCount": 4,
  "nextStep": "Commit or Rollback"
}
```

### 4.7 POST /api/drug-import/commit/:sessionId
Atomically renames `drug` → `drug_old_<session>` and `working` → `drug`, then drops old table. Irreversible.
```json
{"success": true, "message": "Changes committed successfully"}
```

Note: just before this commit, a physical SQL dump of the current live `drug` table is written to `db/`.

### 4.8 POST /api/drug-import/rollback/:sessionId
Pre-commit rollback: drops working + backup tables and clears session (live table unchanged).
```json
{"success": true, "message": "Rollback successful (session tables dropped; original table untouched)"}
```

### 4.9 GET /api/drug-import/session/:sessionId
Session introspection.
```json
{
  "success": true,
  "session": {
    "sessionId": "drug_update_1763126406169_abcd1234",
    "backupTable": "drug_backup_drug_update_1763126406169_abcd1234",
    "workingTable": "drug_working_drug_update_1763126406169_abcd1234",
    "initialized": true,
    "fileName": "sample.csv",
    "mappingInfo": {"isUsingCustomMapping": true}
  }
}
```

### 4.10 GET /api/drug-import/sessions (Admin)
Lists all active sessions.
```json
{"success": true, "sessions": [{"sessionId": "drug_update_...", "fileName": "sample.csv"}]}
```

---
## 5. Authentication & User Routes (Reference)

Base prefix (common pattern): `/api/users`

| Method | URL | Purpose |
|--------|-----|---------|
| POST | /api/users/login | Authenticate and obtain JWT token |
| POST | /api/users/register | Register new user (non-admin) |
| POST | /api/users/Donor/register | Specialized donor registration |
| POST | /api/users/Recipient/register | Specialized recipient registration |
| GET | /api/users/Donor/:userId | Get donor profile |
| GET | /api/users/Recipient/:userId | Get recipient profile |
| POST | /api/users/send-otp | Send OTP for verification |
| POST | /api/users/verify-otp | Validate OTP |

Admin obtains token from `/login` and then may access `/api/drug-import/...` endpoints with header:
```
Authorization: Bearer <token>
```

Role setup scripts:
- `scripts/addImportationRoles.js` (adds Import/Export, Head Pharmacy, Inspector)
- `scripts/addNewRoles.js` (adds Quality Study Committee, Pricing Committee)

Test user creation and role mapping detailed in `docs/TEST_USERS.md`.

---
## 6. Column Mapping Logic

1. System suggests default mapping (e.g., `Code` → `MoPHCode`, `Brand name` → `DrugName`).
2. Admin may override by POSTing full `columnMapping` object.
3. Required check: mapping must include a source for `MoPHCode` (primary identifier). If missing, preview fails.
4. Unknown or unmatched headers are ignored; reported under `skippedColumns`.
5. Currency columns auto-converted using fixed rate 89,500 (LBP → USD). Conversion applied during parsing.

Edge Cases:
- Duplicate MoPH codes in CSV: system treats them as updates to same row; last occurrence wins.
- Empty rows: skipped silently.
- Non-numeric price values: logged as errors in preview; row excluded from price update (other fields may still update).
- Large files: stream parsing prevents memory overload.

---
## 7. Frontend Integration Flow (Pseudo-Code)

```javascript
async function runDrugImport(file) {
  const token = localStorage.getItem('token');
  const authHeaders = { Authorization: `Bearer ${token}` };

  // 1. Available columns (optional pre-step)
  const cols = await fetch('/api/drug-import/available-columns', { headers: authHeaders }).then(r => r.json());

  // 2. Upload & analyze
  const fd = new FormData();
  fd.append('csvFile', file);
  const upload = await fetch('/api/drug-import/upload-analyze', { method: 'POST', headers: authHeaders, body: fd }).then(r => r.json());
  const sessionId = upload.sessionId;

  // 3. Set mapping (use suggested + UI choices)
  const mapping = { 'Code': 'MoPHCode', 'Brand name': 'DrugName', 'Public Price LL': 'PublicPrice' };
  await fetch('/api/drug-import/set-mapping', {
    method: 'POST',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, columnMapping: mapping })
  });

  // 4. Preview
  const preview = await fetch(`/api/drug-import/preview/${sessionId}`, { headers: authHeaders }).then(r => r.json());

  // 5. Apply
  await fetch(`/api/drug-import/apply/${sessionId}`, { method: 'POST', headers: authHeaders });

  // 6. Final changes
  const final = await fetch(`/api/drug-import/final-changes/${sessionId}`, { headers: authHeaders }).then(r => r.json());

  // 7. Decision
  const commit = true; // from user interaction
  if (commit) {
    await fetch(`/api/drug-import/commit/${sessionId}`, { method: 'POST', headers: authHeaders });
  } else {
    await fetch(`/api/drug-import/rollback/${sessionId}`, { method: 'POST', headers: authHeaders });
  }
}
```

---
## 8. Error Handling & Common Responses

| Scenario | HTTP Code | Message Example | Action |
|----------|-----------|-----------------|--------|
| Missing file upload | 400 | "No file provided" | Prompt user to select file |
| Invalid mapping (no MoPHCode) | 400 | "Mapping must include MoPHCode" | Force user to map identifier |
| Session not found | 404 | "Session not found" | Re-init workflow |
| Attempt to rollback after commit | 400 | "Cannot rollback after commit" | Inform irreversible state |
| Database constraint during commit | 500 | Detailed error text | Show admin logs; retry |
| Currency parse error | 200 (in preview) | Row listed under errors | Allow user to fix source CSV |

All workflow endpoints return `success: false` and `error` string on failure.

---
## 9. Security Considerations

- Restrict all `/api/drug-import/*` routes to `admin` role by middleware (not shown here). Optionally permit `pharmacy_service` for viewing preview/final-changes but deny commit/rollback.
- Validate file size (< 50MB) and type; reject unexpected MIME types.
- Sanitize mapping input to avoid SQL injection (mapping only accepted for known column names).
- Use HTTPS in production; never expose raw database table names to non-admin roles.

---
## 10. Post-Commit Cleanup

After commit: working table becomes new `drug`; backup old table dropped. Consider triggering:
- Cache invalidation (if frontend caches drug list)
- Audit logging (store commit timestamp & admin user)
- Notification to stakeholders (email or internal announcement)

---
## 11. Future Enhancements (Optional)

- Add `dryRun=true` query parameter to preview advanced validation (duplicate detection, value range checks).
- Support partial commit (only inserts or only updates).
- Add `/api/drug-import/abort/:sessionId` to explicitly discard without diff.
- Exchange rate endpoint for dynamic updates.
- Version history table instead of dropping old table.

---
## 12. Quick Checklist for Frontend Implementation

1. Ensure admin login flow implemented (store JWT).  
2. Build UI wizard (steps: Upload → Mapping → Preview → Apply → Review → Confirm).  
3. Provide mapping editor with auto-suggestions + required identifier highlight.  
4. Render preview counts and detailed change list (collapsible).  
5. Confirm screen shows diff before enabling Commit button.  
6. Graceful error banners using `error` field from API responses.  
7. Disable Commit if `changeCount === 0`.  
8. Show rollback option until commit performed.  
9. After commit, refresh drug list or force re-fetch.  
10. Log audit actions to console or monitoring service.  

---
## 13. Reference: Roles (From Setup Scripts)

Core roles added by scripts:
- Import/Export
- Head Pharmacy
- Inspector
- Quality Study Committee
- Pricing Committee
Plus pre-existing: Admin, Agent, Donor, Recipient, Pharmacy Service.

Only `Admin` is required for the drug import workflow by default; extend if business rules change.

---
## 14. Support & Maintenance Notes

If `final-changes` returns zero records unexpectedly:
- Confirm mapping actually changed values (maybe identical data).  
- Check if currency column values present; empty or malformed price may reduce update count.  
- Inspect server logs for SQL errors.  

If rollback fails with foreign key error (older behavior):
- Ensure updated rollback logic deployed (drops session tables only).  
- Avoid performing commit before testing rollback.  

If login fails for admin:
- Verify role exists via `Roles` table.  
- Re-run role creation scripts.  
- Confirm password hash matches expected login credential.  

---
## 15. Final Notes

This document intentionally duplicates critical details from earlier partial docs (`interactive-mapping-api.md`, `enhanced-drug-update-service.md`, authentication summaries) to provide a single authoritative reference for frontend engineering.

Keep this file updated whenever workflow logic or endpoints change.

---
**Version:** 2025-11-14  
**Maintainer:** Drug Import Feature Team  
**Exchange Rate Source:** Static configuration (update manually as needed).
