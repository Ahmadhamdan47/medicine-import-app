-- Create workflow_states table
CREATE TABLE IF NOT EXISTS workflow_states (
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
    INDEX idx_created_by (created_by),
    FOREIGN KEY (drug_id) REFERENCES drugsunderprocesses(id) ON DELETE CASCADE
);

-- Create step_completions table
CREATE TABLE IF NOT EXISTS step_completions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id VARCHAR(50) NOT NULL,
    step_number INT NOT NULL,
    completed_at TIMESTAMP NULL,
    completed_by VARCHAR(100),
    approved BOOLEAN DEFAULT FALSE,
    approved_at TIMESTAMP NULL,
    approved_by VARCHAR(100),
    rejected_at TIMESTAMP NULL,
    rejected_by VARCHAR(100),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflow_states(id) ON DELETE CASCADE,
    UNIQUE KEY unique_workflow_step (workflow_id, step_number)
);

-- Create quality_reviews table
CREATE TABLE IF NOT EXISTS quality_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id VARCHAR(50) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'under_review') NOT NULL DEFAULT 'pending',
    report TEXT,
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP NULL,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflow_states(id) ON DELETE CASCADE
);

-- Create pricing_reviews table
CREATE TABLE IF NOT EXISTS pricing_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id VARCHAR(50) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'under_review') NOT NULL DEFAULT 'pending',
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP NULL,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflow_states(id) ON DELETE CASCADE
);

-- Create workflow_notifications table
CREATE TABLE IF NOT EXISTS workflow_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id VARCHAR(50) NOT NULL,
    step_number INT NOT NULL,
    notified_at TIMESTAMP NULL,
    acknowledged_at TIMESTAMP NULL,
    acknowledged_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflow_states(id) ON DELETE CASCADE
);

-- Update users table to include roles (if role column doesn't exist)
ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('agent', 'import_export', 'quality_committee', 'pricing_committee', 'admin') DEFAULT 'agent';
