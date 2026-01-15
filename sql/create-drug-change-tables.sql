-- SQL Script to create drug change request and history tables
-- Run this script to add the drug edit approval system

-- Table to store change requests (pending, approved, rejected)
CREATE TABLE IF NOT EXISTS drug_change_requests (
    ChangeRequestId INT AUTO_INCREMENT PRIMARY KEY,
    DrugID INT NOT NULL,
    RequestedBy INT NOT NULL COMMENT 'UserId from useraccounts',
    RequestedByRole VARCHAR(50),
    Status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    ChangeType VARCHAR(50) COMMENT 'update or create',
    ChangesJSON JSON COMMENT 'Store all proposed changes',
    PreviousValuesJSON JSON COMMENT 'Store original values for comparison',
    ReviewedBy INT NULL COMMENT 'Admin UserId who approved/rejected',
    ReviewedAt DATETIME NULL,
    ReviewComments TEXT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_drug_id (DrugID),
    INDEX idx_status (Status),
    INDEX idx_requested_by (RequestedBy),
    FOREIGN KEY (DrugID) REFERENCES drug(DrugID) ON DELETE CASCADE,
    FOREIGN KEY (RequestedBy) REFERENCES useraccounts(UserId),
    FOREIGN KEY (ReviewedBy) REFERENCES useraccounts(UserId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table to store complete audit log of all changes
CREATE TABLE IF NOT EXISTS drug_change_history (
    HistoryId INT AUTO_INCREMENT PRIMARY KEY,
    DrugID INT NOT NULL,
    ChangeRequestId INT NULL COMMENT 'Links to change request if applicable',
    ChangedBy INT NOT NULL COMMENT 'UserId',
    ChangedByRole VARCHAR(50),
    ChangeType VARCHAR(50) COMMENT 'update, create, delete',
    FieldName VARCHAR(100) COMMENT 'Specific field that was changed',
    OldValue TEXT,
    NewValue TEXT,
    ApprovedBy INT NULL COMMENT 'Admin who approved (if applicable)',
    ChangeTimestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_drug_id (DrugID),
    INDEX idx_changed_by (ChangedBy),
    INDEX idx_change_timestamp (ChangeTimestamp),
    FOREIGN KEY (DrugID) REFERENCES drug(DrugID) ON DELETE CASCADE,
    FOREIGN KEY (ChangeRequestId) REFERENCES drug_change_requests(ChangeRequestId) ON DELETE SET NULL,
    FOREIGN KEY (ChangedBy) REFERENCES useraccounts(UserId),
    FOREIGN KEY (ApprovedBy) REFERENCES useraccounts(UserId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes for better query performance
CREATE INDEX idx_change_request_status_created ON drug_change_requests(Status, CreatedAt);
CREATE INDEX idx_history_drug_timestamp ON drug_change_history(DrugID, ChangeTimestamp);
