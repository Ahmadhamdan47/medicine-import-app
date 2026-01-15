# Visual Flow: Restore Unsaved Changes

## Scenario: User Makes Changes and Closes Browser

```
┌─────────────────────────────────────────────────────────────────┐
│                        DAY 1 - 3:00 PM                          │
└─────────────────────────────────────────────────────────────────┘

👤 USER (data-entry)
  │
  ├─► Opens Drug Edit Form for Drug #123
  │
  │   Frontend calls: GET /drugs/123
  │   Returns: { DrugName: "Aspirin", Price: 10.00 }
  │
  ├─► User changes Price from $10 to $15
  │
  ├─► User clicks "Save"
  │
  │   Frontend calls: PUT /drugs/update/123
  │   Body: { Price: 15.00 }
  │
  │   🔍 Backend detects: role = "data-entry"
  │   ✅ Creates change request (Status: pending)
  │
  │   Database now has:
  │   ┌──────────────────────────────────────┐
  │   │ drug_change_requests table           │
  │   ├──────────────────────────────────────┤
  │   │ DrugID: 123                          │
  │   │ RequestedBy: 456 (user ID)           │
  │   │ Status: pending                      │
  │   │ ChangesJSON: { "Price": 15.00 }      │
  │   │ PreviousValuesJSON: { "Price": 10.00 }│
  │   └──────────────────────────────────────┘
  │
  │   Note: Drug table still has Price: 10.00
  │
  └─► User closes browser 💻 ❌


┌─────────────────────────────────────────────────────────────────┐
│                        DAY 2 - 9:00 AM                          │
└─────────────────────────────────────────────────────────────────┘

👤 USER (same user, ID: 456)
  │
  ├─► Opens Drug Edit Form for Drug #123 again
  │
  │   🆕 Frontend calls (NEW ENDPOINT):
  │   GET /drug-change-requests/drug/123/with-pending
  │
  │   🔍 Backend checks:
  │   1. Get drug data from drug table
  │      └─► { DrugName: "Aspirin", Price: 10.00 }
  │
  │   2. Check for pending requests for this user + drug
  │      └─► Found! { Price: 15.00 }
  │
  │   3. Merge pending changes with drug data
  │      └─► { DrugName: "Aspirin", Price: 15.00 } ✨
  │
  │   Response:
  │   {
  │     "drugData": {
  │       "DrugName": "Aspirin",
  │       "Price": 15.00  ⬅️ USER'S PENDING CHANGE!
  │     },
  │     "originalData": {
  │       "Price": 10.00  ⬅️ Original in database
  │     },
  │     "hasPendingChanges": true,
  │     "pendingRequest": {
  │       "id": 42,
  │       "status": "pending",
  │       "createdAt": "2026-01-14T15:00:00Z"
  │     }
  │   }
  │
  └─► Form shows Price: $15 (user's unsaved change) ✅
      Banner: "⏳ You have unsaved changes pending approval"
```

## User Options After Reopening

```
┌─────────────────────────────────────────────────────────────────┐
│         USER SEES THEIR CHANGES FROM YESTERDAY                  │
│         Price shows $15 (not $10)                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
       ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
       │   OPTION 1  │ │   OPTION 2  │ │   OPTION 3  │
       │   Modify    │ │     Wait    │ │   Discard   │
       └─────────────┘ └─────────────┘ └─────────────┘
              │               │               │
              │               │               │
              ▼               ▼               ▼
       Change Price    Leave as is     Click "Discard"
       from $15 to     and wait for    
       $20             admin           DELETE /cancel
                                       
       PUT /update     (Admin will     Pending request
       with new        review $15      removed from DB
       changes         change)         
                                       Form reloads with
       Same request                    original: $10
       updated, not    
       new request     
```

## Admin Approval Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN REVIEWS REQUEST                        │
└─────────────────────────────────────────────────────────────────┘

👔 ADMIN
  │
  ├─► Views pending requests
  │   GET /drug-change-requests/pending
  │
  ├─► Sees: "User requested Price change: $10 → $15"
  │
  ├─► Clicks "View Details"
  │   GET /drug-change-requests/42
  │
  │   Shows Before/After comparison:
  │   ┌──────────────────────────┐
  │   │ Field    │ Before │ After│
  │   ├──────────┼────────┼──────┤
  │   │ Price    │ $10.00 │$15.00│
  │   └──────────────────────────┘
  │
  └─► Admin Decides:

      APPROVE ✅                    REJECT ❌
      │                            │
      PUT /42/approve              PUT /42/reject
      │                            │
      ┌─────────────────┐         ┌─────────────────┐
      │ 1. Update drug  │         │ 1. Change       │
      │    Price: 15.00 │         │    request stays│
      │                 │         │    in database  │
      │ 2. Log to       │         │    (rejected)   │
      │    history      │         │                 │
      │                 │         │ 2. Notify user  │
      │ 3. Mark request │         │    (optional)   │
      │    as approved  │         │                 │
      └─────────────────┘         └─────────────────┘
```

## Key Differences: Before vs After

### BEFORE (Without Restore Feature)
```
Day 1: User edits → Changes saved as pending
Day 2: User opens same drug → Sees ORIGINAL data ($10)
       User thinks: "Where did my changes go?" 😕
```

### AFTER (With Restore Feature)
```
Day 1: User edits → Changes saved as pending
Day 2: User opens same drug → Sees THEIR CHANGES ($15) ✨
       User thinks: "Perfect! My changes are still here!" 😊
```

## Database State Over Time

```
TIME    │ DRUG TABLE     │ CHANGE_REQUESTS TABLE         │ USER SEES
────────┼────────────────┼───────────────────────────────┼──────────────
Initial │ Price: $10     │ (empty)                       │ $10
        │                │                               │
Day 1   │ Price: $10     │ DrugID: 123                   │ Submits $15
15:00   │ (unchanged)    │ RequestedBy: 456              │ 
        │                │ Status: pending               │
        │                │ ChangesJSON: {"Price": 15.00} │
        │                │                               │
Day 2   │ Price: $10     │ (same as above)               │ Opens form
09:00   │ (still $10)    │ Status: still pending         │ Sees: $15 ✅
        │                │                               │
Day 2   │ Price: $10     │ Status: pending               │ Changes to
11:00   │ (still $10)    │ ChangesJSON: {"Price": 20.00} │ $20 instead
        │                │ (updated, same request)       │
        │                │                               │
Admin   │ Price: $20 ✅  │ Status: approved              │ Form now
approves│ (NOW changed)  │ (request closed)              │ shows $20
```

## Multiple Users Scenario

```
┌────────────────────────────────────────────────────────────┐
│           Drug #123 - Multiple Users Editing               │
└────────────────────────────────────────────────────────────┘

👤 USER A (ID: 101)              👤 USER B (ID: 202)
│                                │
├─► Opens Drug #123              ├─► Opens Drug #123
│   Original: Price $10          │   Original: Price $10
│                                │
├─► Changes to $15               ├─► Changes to $12
│   Creates request #1           │   Creates request #2
│                                │
└─► Closes browser               └─► Closes browser


NEXT DAY:                        NEXT DAY:
👤 USER A reopens                👤 USER B reopens
   Sees: $15 (their change)         Sees: $12 (their change)

✅ INDEPENDENT REQUESTS           ✅ INDEPENDENT REQUESTS
Request #1: User A → $15         Request #2: User B → $12
Status: pending                  Status: pending


Drug table still shows: $10 (unchanged)
Admin will review BOTH requests separately
```

## Summary

✅ **Automatic**: No extra work for users
✅ **Persistent**: Changes survive browser close, logout, etc.
✅ **Per-User**: Each user's changes are independent
✅ **Modifiable**: Users can update their pending changes
✅ **Cancelable**: Users can discard pending changes
✅ **Transparent**: Users see exactly what they submitted

The backend automatically handles all of this! 🎉
