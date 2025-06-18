-- Migration script to add Url column to notification table
-- This script is idempotent - it will only add the column if it doesn't exist

-- Check if the column exists, and add it if it doesn't
SET @sql = 'SELECT 1';
SELECT COUNT(*) INTO @exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'notification' 
AND COLUMN_NAME = 'Url';

SET @sql = IF(@exists = 0, 
    'ALTER TABLE notification ADD COLUMN Url VARCHAR(500) NULL',
    'SELECT "Url column already exists" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
