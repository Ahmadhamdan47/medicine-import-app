-- Sub-Account Management Database Migration
-- Add new columns to useraccounts table for sub-account functionality

-- Add IsMainAccount column (default true for existing accounts)
ALTER TABLE useraccounts 
ADD COLUMN IsMainAccount BOOLEAN NOT NULL DEFAULT TRUE 
AFTER Email;

-- Add ParentUserId column for sub-account relationship
ALTER TABLE useraccounts 
ADD COLUMN ParentUserId INT NULL 
AFTER IsMainAccount;

-- Add Permissions column to store sub-account permissions as JSON
ALTER TABLE useraccounts 
ADD COLUMN Permissions JSON NULL 
AFTER ParentUserId;

-- Add CreatedBy column to track who created the account
ALTER TABLE useraccounts 
ADD COLUMN CreatedBy INT NULL 
AFTER Permissions;

-- Add foreign key constraint for ParentUserId
ALTER TABLE useraccounts 
ADD CONSTRAINT FK_useraccounts_parent 
FOREIGN KEY (ParentUserId) REFERENCES useraccounts(UserId) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- Add foreign key constraint for CreatedBy
ALTER TABLE useraccounts 
ADD CONSTRAINT FK_useraccounts_createdby 
FOREIGN KEY (CreatedBy) REFERENCES useraccounts(UserId) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- Add index for better performance on sub-account queries
CREATE INDEX IDX_useraccounts_parent ON useraccounts(ParentUserId);
CREATE INDEX IDX_useraccounts_main_account ON useraccounts(IsMainAccount);
CREATE INDEX IDX_useraccounts_donor_main ON useraccounts(DonorId, IsMainAccount);

-- Set default permissions for existing donor accounts
UPDATE useraccounts 
SET Permissions = JSON_ARRAY('view_donations', 'add_donations', 'edit_donations')
WHERE DonorId IS NOT NULL AND Permissions IS NULL;

-- Verify the changes
DESCRIBE useraccounts;

-- Show sample data to verify structure
SELECT 
    UserId, 
    Username, 
    DonorId, 
    IsMainAccount, 
    ParentUserId, 
    Permissions, 
    CreatedBy,
    IsActive
FROM useraccounts 
WHERE DonorId IS NOT NULL 
LIMIT 5;
