-- Migration: Change dosage numerator/denominator fields from INT to DECIMAL(10,4)
-- Date: 2026-02-05
-- Purpose: Support decimal dosage values like "2.5mg/ml"

USE ommal_medapiv2;

-- Backup note: Consider backing up the dosage table before running this migration
-- Example: CREATE TABLE dosage_backup AS SELECT * FROM dosage;

-- Alter numerator and denominator columns to DECIMAL(10,4)
ALTER TABLE `dosage`
  MODIFY COLUMN `Numerator1` DECIMAL(10,4) DEFAULT NULL,
  MODIFY COLUMN `Denominator1` DECIMAL(10,4) DEFAULT NULL,
  MODIFY COLUMN `Numerator2` DECIMAL(10,4) DEFAULT NULL,
  MODIFY COLUMN `Denominator2` DECIMAL(10,4) DEFAULT NULL,
  MODIFY COLUMN `Numerator3` DECIMAL(10,4) DEFAULT NULL,
  MODIFY COLUMN `Denominator3` DECIMAL(10,4) DEFAULT NULL;

-- Verify the changes
DESCRIBE dosage;

-- Expected result: All Numerator/Denominator columns should show type DECIMAL(10,4)
