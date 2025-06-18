-- Script to create NSSF Pricing table
-- Run this script in your MySQL database to create the nssf_pricing table

USE ommal_medapiv2; -- Replace with your actual database name if different

-- Create the nssf_pricing table
CREATE TABLE IF NOT EXISTS `nssf_pricing` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `drug_id` INT NOT NULL,
    `effective_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `public_price_lbp` DECIMAL(12, 2) NULL COMMENT 'Public Price (MoPH) in LBP',
    `nssf_price_lbp` DECIMAL(12, 2) NULL COMMENT 'NSSF Price in LBP',
    `nssf_coverage_percentage` DECIMAL(5, 2) NULL COMMENT 'NSSF Coverage Percentage (e.g., 80.00 for 80%)',
    `nssf_coverage_amount_lbp` DECIMAL(12, 2) NULL COMMENT 'NSSF Coverage Amount in LBP',
    `real_nssf_coverage_percentage` DECIMAL(5, 2) NULL COMMENT 'Real NSSF Coverage Percentage per public price (MoPH) - calculated as (nssf_coverage_amount_lbp / public_price_lbp) * 100',
    `is_active` BOOLEAN DEFAULT TRUE COMMENT 'Whether this pricing record is currently active',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT `fk_nssf_pricing_drug_id` 
        FOREIGN KEY (`drug_id`) 
        REFERENCES `drug` (`DrugID`) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    -- Indexes for performance
    INDEX `idx_drug_date` (`drug_id`, `effective_date`),
    INDEX `idx_drug_active` (`drug_id`, `is_active`),
    
    -- Unique constraint to prevent duplicate records for same drug and date
    UNIQUE KEY `unique_drug_date` (`drug_id`, `effective_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='NSSF pricing and coverage information for drugs';

-- Create a trigger to automatically calculate real_nssf_coverage_percentage
DELIMITER $$

CREATE TRIGGER `calculate_real_nssf_coverage_before_insert`
    BEFORE INSERT ON `nssf_pricing`
    FOR EACH ROW
BEGIN
    IF NEW.public_price_lbp IS NOT NULL 
       AND NEW.nssf_coverage_amount_lbp IS NOT NULL 
       AND NEW.public_price_lbp > 0 THEN
        SET NEW.real_nssf_coverage_percentage = (NEW.nssf_coverage_amount_lbp / NEW.public_price_lbp) * 100;
    END IF;
END$$

CREATE TRIGGER `calculate_real_nssf_coverage_before_update`
    BEFORE UPDATE ON `nssf_pricing`
    FOR EACH ROW
BEGIN
    IF NEW.public_price_lbp IS NOT NULL 
       AND NEW.nssf_coverage_amount_lbp IS NOT NULL 
       AND NEW.public_price_lbp > 0 THEN
        SET NEW.real_nssf_coverage_percentage = (NEW.nssf_coverage_amount_lbp / NEW.public_price_lbp) * 100;
    END IF;
END$$

DELIMITER ;

-- Insert some sample data (optional - remove if not needed)
-- INSERT INTO `nssf_pricing` 
-- (`drug_id`, `effective_date`, `public_price_lbp`, `nssf_price_lbp`, `nssf_coverage_percentage`, `nssf_coverage_amount_lbp`, `is_active`)
-- VALUES 
-- (1, '2025-06-18 00:00:00', 100000.00, 20000.00, 80.00, 80000.00, TRUE),
-- (2, '2025-06-18 00:00:00', 50000.00, 10000.00, 75.00, 37500.00, TRUE),
-- (3, '2025-06-18 00:00:00', 200000.00, 40000.00, 85.00, 170000.00, TRUE);

-- Verify the table was created successfully
DESCRIBE `nssf_pricing`;

-- Show indexes
SHOW INDEX FROM `nssf_pricing`;

-- Show triggers
SHOW TRIGGERS LIKE 'nssf_pricing';

SELECT 'NSSF Pricing table created successfully!' AS message;
