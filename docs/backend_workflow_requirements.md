# Backend Changes Required for Role-Based Workflow System

## Overview
The frontend has been updated to implement a comprehensive role-based workflow system for drug registration. The backend needs to support the following workflow features:

## Required Database Changes

### 1. New Tables

#### `workflow_states` Table
```sql
CREATE TABLE workflow_states (
    id VARCHAR(50) PRIMARY KEY,
    drug_id VARCHAR(50) NOT NULL,
    current_step INT NOT NULL DEFAULT 1,
    status ENUM('draft', 'agent_in_progress', 'pending_import_export_review', 'import_export_review', 'pending_quality_review', 'quality_review', 'pending_pricing_review', 'pricing_review', 'approved', 'rejected') NOT NULL DEFAULT 'draft',
    created_by VARCHAR(100) NOT NULL,
    assigned_to VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_drug_id (drug_id),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by)
);
```

#### `step_completions` Table
```sql
CREATE TABLE step_completions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id VARCHAR(50) NOT NULL,
    step_number INT NOT NULL,
    completed_at TIMESTAMP,
    completed_by VARCHAR(100),
    approved BOOLEAN DEFAULT FALSE,
    approved_at TIMESTAMP,
    approved_by VARCHAR(100),
    rejected_at TIMESTAMP,
    rejected_by VARCHAR(100),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflow_states(id) ON DELETE CASCADE,
    UNIQUE KEY unique_workflow_step (workflow_id, step_number)
);
```

#### `quality_reviews` Table
```sql
CREATE TABLE quality_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id VARCHAR(50) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'under_review') NOT NULL DEFAULT 'pending',
    report TEXT,
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflow_states(id) ON DELETE CASCADE
);
```

#### `pricing_reviews` Table
```sql
CREATE TABLE pricing_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id VARCHAR(50) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'under_review') NOT NULL DEFAULT 'pending',
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflow_states(id) ON DELETE CASCADE
);
```

#### `workflow_notifications` Table
```sql
CREATE TABLE workflow_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id VARCHAR(50) NOT NULL,
    step_number INT NOT NULL,
    notified_at TIMESTAMP,
    acknowledged_at TIMESTAMP,
    acknowledged_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflow_states(id) ON DELETE CASCADE
);
```

### 2. Update Existing Tables

#### Update `users` table to include roles
```sql
ALTER TABLE users ADD COLUMN role ENUM('agent', 'import_export', 'quality_committee', 'pricing_committee', 'admin') DEFAULT 'agent';
```

## Required API Endpoints

### 1. Workflow Management Endpoints

#### `GET /api/workflow/{drugId}`
- Returns the workflow state for a specific drug
- Response format:
```json
{
  "drugId": "string",
  "currentStep": 1,
  "status": "agent_in_progress",
  "createdBy": "string",
  "assignedTo": "string",
  "stepCompletions": {
    "1": {
      "completedAt": "2024-01-01T00:00:00Z",
      "completedBy": "user1",
      "approved": true,
      "approvedAt": "2024-01-01T01:00:00Z",
      "approvedBy": "reviewer1",
      "comments": "Approved with no issues"
    }
  },
  "qualityReview": {
    "status": "approved",
    "report": "Quality review report text",
    "reviewedBy": "quality_reviewer",
    "reviewedAt": "2024-01-01T02:00:00Z",
    "comments": "Quality approved"
  },
  "pricingReview": {
    "status": "pending",
    "reviewedBy": null,
    "reviewedAt": null,
    "comments": null
  },
  "notifications": {
    "5": {
      "notifiedAt": "2024-01-01T03:00:00Z",
      "acknowledgedAt": "2024-01-01T03:30:00Z",
      "acknowledgedBy": "import_export_user"
    }
  }
}
```

#### `PUT /api/workflow/{drugId}`
- Updates the workflow state
- Accepts the full workflow state object
- Updates all related tables (workflow_states, step_completions, quality_reviews, pricing_reviews, workflow_notifications)

#### `POST /api/workflow`
- Creates a new workflow state
- Used when a workflow doesn't exist for a drug

### 2. Role-Based Access Control

#### Update existing endpoints to check permissions:
- `GET /api/drugs-under-process` - Filter based on user role
- `PUT /api/drugs-under-process` - Check edit permissions
- `POST /api/drugs-under-process` - Check create permissions

### 3. Notification Endpoints

#### `GET /api/notifications`
- Returns pending notifications for the current user based on their role
- Response format:
```json
[
  {
    "type": "step_completion",
    "drugId": "123",
    "drugName": "Sample Drug",
    "stepNumber": 5,
    "message": "Agent has completed Step 5 and is waiting for your review",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### `POST /api/notifications/acknowledge`
- Marks notifications as acknowledged
- Body: `{ "drugId": "123", "stepNumber": 5 }`

## Business Logic Requirements

### 1. Step Access Control
Implement the following access matrix:

| Step | Agent | Import/Export | Quality Committee | Pricing Committee |
|------|-------|---------------|-------------------|-------------------|
| 1-5  | Edit  | View Only     | View Only         | View Only         |
| 6    | View  | Edit          | View Only         | View Only         |
| 7    | No Access | Edit      | View Only         | View Only         |
| 8    | View  | Edit          | View Only         | View Only         |

### 2. Workflow Status Transitions

#### Agent Workflow (Steps 1-5):
1. Agent creates new drug registration (status: `agent_in_progress`)
2. Agent fills steps 1-4 (can save and continue)
3. Agent completes step 5 → status changes to `pending_import_export_review`
4. Notification sent to Import/Export department
5. Agent cannot proceed until Import/Export acknowledges and approves

#### Import/Export Review:
1. Import/Export user receives notification about completed step 5
2. They acknowledge receipt → can begin working on steps 6-8
3. Status changes to `import_export_review`
4. Import/Export completes step 6 → status changes to `pending_pricing_review`
5. Pricing committee receives notification

#### Quality Committee Review (after Step 4):
1. After step 4 completion, documents are automatically sent for quality review
2. Status includes `pending_quality_review`
3. Quality committee can approve/reject with report
4. If rejected, workflow status becomes `rejected`
5. If approved, workflow continues

#### Pricing Committee Review (after Step 6):
1. After step 6 completion, pricing info sent for review
2. Status changes to `pending_pricing_review`
3. Pricing committee can approve/reject
4. If approved, Import/Export can continue to steps 7-8
5. If rejected, workflow status becomes `rejected`

### 3. Approval Requirements

#### Step 5 Approval:
- Required before Import/Export can begin their work
- Import/Export department must acknowledge and approve
- Agent cannot proceed until approved

#### Quality Review:
- Triggered automatically after Step 4
- Must be approved before workflow can proceed
- Includes free-text report capability

#### Pricing Review:
- Triggered automatically after Step 6
- Must be approved before steps 7-8 can be completed
- Pricing committee has final say on pricing information

### 4. Step Skipping Logic
- Agents can view steps 6 and 8 but skip step 7 (view-only access)
- Import/Export department has full access to steps 6-8
- Quality and Pricing committees have view-only access to all steps

## Implementation Notes

### 1. Database Triggers
Consider implementing database triggers to:
- Automatically update `updated_at` timestamps
- Send notifications when workflow status changes
- Log all workflow state changes for audit trail

### 2. Email Notifications
Implement email notifications for:
- Step completion requiring approval
- Workflow status changes
- Assignment changes
- Rejections with reasons

### 3. Audit Trail
Maintain complete audit trail of:
- All workflow status changes
- Step completions and approvals
- User actions and timestamps
- Comments and rejection reasons

### 4. Performance Considerations
- Index all foreign keys and commonly queried fields
- Consider caching frequently accessed workflow states
- Implement pagination for notification lists
- Use database views for complex workflow queries

## Testing Requirements

### 1. Unit Tests
- Test all workflow state transitions
- Test role-based access control
- Test approval/rejection flows
- Test notification generation

### 2. Integration Tests
- Test complete workflow from start to finish
- Test multi-user scenarios
- Test error handling and edge cases
- Test notification delivery

### 3. User Acceptance Testing
- Test with actual users from each role
- Verify workflow matches business requirements
- Test usability of approval/rejection interfaces
- Verify notification timing and content

## Security Considerations

### 1. Role Verification
- Always verify user role on server side
- Never trust client-side role information
- Implement proper authentication middleware

### 2. Data Access Control
- Users can only access drugs they're authorized for
- Implement row-level security where possible
- Log all data access for audit purposes

### 3. Input Validation
- Validate all workflow state transitions
- Prevent invalid status changes
- Sanitize all user inputs, especially comments and reports

This backend implementation will provide a robust, secure, and scalable workflow system that matches the frontend requirements.
