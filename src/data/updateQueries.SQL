-- Step 1: Remove the Inspection column from batchlottracking if it exists
ALTER TABLE batchlottracking
DROP COLUMN IF EXISTS Inspection;

-- Step 2: Add the Inspection column to batchserialnumber
ALTER TABLE batchserialnumber
ADD COLUMN Inspection ENUM('non-inspected', 'inspected', 'rejected') NULL;
