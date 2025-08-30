-- Add real_nssf_coverage column to nssf_pricing table
-- This script adds the real_nssf_coverage field (non-percentage amount) to the existing nssf_pricing table

USE ommal_medapiv2; -- Replace with your actual database name if different

-- Add the real_nssf_coverage column
ALTER TABLE nssf_pricing 
ADD COLUMN real_nssf_coverage DECIMAL(12, 2) NULL 
COMMENT 'Real NSSF Coverage Amount (non-percentage) in LBP' 
AFTER real_nssf_coverage_percentage;

-- Optional: Update existing records to calculate real_nssf_coverage
-- This will set real_nssf_coverage equal to nssf_coverage_amount_lbp for existing records
UPDATE nssf_pricing 
SET real_nssf_coverage = nssf_coverage_amount_lbp 
WHERE real_nssf_coverage IS NULL 
AND nssf_coverage_amount_lbp IS NOT NULL;

-- Display the updated table structure
DESCRIBE nssf_pricing;

-- Show a sample of updated records
SELECT 
    id,
    drug_id,
    public_price_lbp,
    nssf_price_lbp,
    nssf_coverage_percentage,
    nssf_coverage_amount_lbp,
    real_nssf_coverage_percentage,
    real_nssf_coverage,
    is_active,
    effective_date
FROM nssf_pricing 
LIMIT 5;
