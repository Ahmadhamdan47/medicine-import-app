-- Create Bank Donations Table
CREATE TABLE IF NOT EXISTS `bank_donations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `donor_type` ENUM('personal', 'entity') NOT NULL COMMENT 'Type of donor - personal or entity',
    `account_holder` VARCHAR(255) NOT NULL COMMENT 'Name of the account holder',
    `contact_person` VARCHAR(255) NULL COMMENT 'Contact person name (especially for entities)',
    `mobile_number` VARCHAR(20) NOT NULL COMMENT 'Mobile phone number',
    `email_address` VARCHAR(255) NOT NULL COMMENT 'Email address of the donor',
    `amount` DECIMAL(15, 2) NOT NULL COMMENT 'Donation amount',
    `currency` VARCHAR(3) NOT NULL DEFAULT 'USD' COMMENT 'Currency code (USD, LBP, etc.)',
    `status` ENUM('pending', 'sent_to_bank', 'confirmed', 'rejected') DEFAULT 'pending' COMMENT 'Status of the donation',
    `bank_email_sent_at` DATETIME NULL COMMENT 'Timestamp when email was sent to bank',
    `bank_reference_number` VARCHAR(100) NULL COMMENT 'Reference number from bank if provided',
    `notes` TEXT NULL COMMENT 'Additional notes or comments',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better performance
    INDEX `idx_donor_type` (`donor_type`),
    INDEX `idx_status` (`status`),
    INDEX `idx_email_address` (`email_address`),
    INDEX `idx_created_at` (`created_at`),
    INDEX `idx_currency` (`currency`),
    INDEX `idx_amount` (`amount`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bank donations table for money donations through bank';

-- Add some sample data for testing (optional - remove in production)
INSERT INTO `bank_donations` 
(`donor_type`, `account_holder`, `contact_person`, `mobile_number`, `email_address`, `amount`, `currency`, `notes`) 
VALUES 
('personal', 'John Doe', NULL, '+961-70-123456', 'john.doe@example.com', 100.00, 'USD', 'Sample personal donation'),
('entity', 'ABC Company Ltd', 'Jane Smith', '+961-71-789012', 'jane.smith@abccompany.com', 500.00, 'USD', 'Corporate donation for medical supplies');
