-- MySQL script to create all importation module tables
-- Database: ommal_medapiv2

USE ommal_medapiv2;

-- ============================================
-- 1. IMPORTATION REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS importation_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    agentId INT NOT NULL,
    drugName VARCHAR(255) NOT NULL,
    brandName VARCHAR(255),
    manufacturerId INT,
    quantityRequested INT NOT NULL,
    unitPrice DECIMAL(10,2),
    totalValue DECIMAL(12,2),
    status ENUM('pending', 'under_review', 'rfd_required', 'proforma_required', 'swift_required', 'shipping', 'inspection', 'approved', 'rejected') DEFAULT 'pending',
    urgencyLevel ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    description TEXT,
    indication TEXT,
    dosageForm VARCHAR(100),
    strength VARCHAR(100),
    packSize INT,
    batchNumber VARCHAR(100),
    expiryDate DATE,
    countryOfOrigin VARCHAR(100),
    registrationNumber VARCHAR(100),
    regulatoryStatus ENUM('registered', 'pending_registration', 'emergency_use', 'compassionate_use') DEFAULT 'pending_registration',
    requestedDeliveryDate DATE,
    notes TEXT,
    
    -- Shipping and logistics
    estimatedShippingDate DATE,
    actualShippingDate DATE,
    trackingNumber VARCHAR(100),
    shippingCarrier VARCHAR(100),
    
    -- Warehouse tracking
    warehouseLocation VARCHAR(255),
    receivedDate DATE,
    inspectionDate DATE,
    inspectedBy INT,
    inspectionNotes TEXT,
    
    -- Financial information
    exchangeRate DECIMAL(10,4),
    localCurrencyValue DECIMAL(12,2),
    
    -- Audit fields
    submittedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastStatusUpdate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    
    -- Foreign key constraints
    FOREIGN KEY (agentId) REFERENCES useraccounts(UserId),
    FOREIGN KEY (inspectedBy) REFERENCES useraccounts(UserId),
    FOREIGN KEY (createdBy) REFERENCES useraccounts(UserId),
    FOREIGN KEY (updatedBy) REFERENCES useraccounts(UserId),
    
    -- Indexes
    INDEX idx_agent (agentId),
    INDEX idx_status (status),
    INDEX idx_urgency (urgencyLevel),
    INDEX idx_submission_date (submittedDate),
    INDEX idx_drug_name (drugName)
);

-- ============================================
-- 2. RFD REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rfd_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    importationRequestId INT NOT NULL,
    fileId VARCHAR(255),
    fileName VARCHAR(255),
    filePath VARCHAR(500),
    fileSize INT,
    checksum VARCHAR(255),
    status ENUM('pending', 'approved', 'rejected', 'requires_correction') DEFAULT 'pending',
    approvedBy INT,
    approvedDate DATETIME,
    rejectionReason TEXT,
    metadata JSON,
    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    
    -- Foreign key constraints
    FOREIGN KEY (importationRequestId) REFERENCES importation_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (approvedBy) REFERENCES useraccounts(UserId),
    FOREIGN KEY (createdBy) REFERENCES useraccounts(UserId),
    FOREIGN KEY (updatedBy) REFERENCES useraccounts(UserId),
    
    -- Indexes
    INDEX idx_importation_request (importationRequestId),
    INDEX idx_status (status),
    INDEX idx_file_id (fileId)
);

-- ============================================
-- 3. PROFORMA REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS proforma_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    importationRequestId INT NOT NULL,
    fileId VARCHAR(255),
    fileName VARCHAR(255),
    filePath VARCHAR(500),
    fileSize INT,
    checksum VARCHAR(255),
    invoiceNumber VARCHAR(100),
    invoiceDate DATE,
    totalAmount DECIMAL(12,2),
    currency VARCHAR(10) DEFAULT 'USD',
    status ENUM('pending', 'signed', 'rejected', 'requires_correction') DEFAULT 'pending',
    signedBy INT,
    signedDate DATETIME,
    rejectionReason TEXT,
    metadata JSON,
    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    
    -- Foreign key constraints
    FOREIGN KEY (importationRequestId) REFERENCES importation_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (signedBy) REFERENCES useraccounts(UserId),
    FOREIGN KEY (createdBy) REFERENCES useraccounts(UserId),
    FOREIGN KEY (updatedBy) REFERENCES useraccounts(UserId),
    
    -- Indexes
    INDEX idx_importation_request (importationRequestId),
    INDEX idx_status (status),
    INDEX idx_invoice_number (invoiceNumber),
    INDEX idx_file_id (fileId)
);

-- ============================================
-- 4. SWIFT PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS swift_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    importationRequestId INT NOT NULL,
    fileId VARCHAR(255),
    fileName VARCHAR(255),
    filePath VARCHAR(500),
    fileSize INT,
    checksum VARCHAR(255),
    transactionReference VARCHAR(100),
    paymentAmount DECIMAL(12,2),
    paymentDate DATE,
    currency VARCHAR(10) DEFAULT 'USD',
    senderBank VARCHAR(255),
    receiverBank VARCHAR(255),
    status ENUM('pending', 'approved', 'rejected', 'verification_required') DEFAULT 'pending',
    approvedBy INT,
    approvedDate DATETIME,
    rejectionReason TEXT,
    metadata JSON,
    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    
    -- Foreign key constraints
    FOREIGN KEY (importationRequestId) REFERENCES importation_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (approvedBy) REFERENCES useraccounts(UserId),
    FOREIGN KEY (createdBy) REFERENCES useraccounts(UserId),
    FOREIGN KEY (updatedBy) REFERENCES useraccounts(UserId),
    
    -- Indexes
    INDEX idx_importation_request (importationRequestId),
    INDEX idx_status (status),
    INDEX idx_transaction_ref (transactionReference),
    INDEX idx_file_id (fileId)
);

-- ============================================
-- 5. IMPORTATION ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS importation_announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('general', 'urgent', 'policy', 'deadline', 'maintenance') DEFAULT 'general',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    targetRole VARCHAR(50), -- null means visible to all roles
    isActive BOOLEAN DEFAULT TRUE,
    startDate DATETIME,
    endDate DATETIME,
    attachmentFileId VARCHAR(255),
    metadata JSON,
    viewCount INT DEFAULT 0,
    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    
    -- Foreign key constraints
    FOREIGN KEY (createdBy) REFERENCES useraccounts(UserId),
    FOREIGN KEY (updatedBy) REFERENCES useraccounts(UserId),
    
    -- Indexes
    INDEX idx_type (type),
    INDEX idx_priority (priority),
    INDEX idx_target_role (targetRole),
    INDEX idx_active (isActive),
    INDEX idx_start_date (startDate),
    INDEX idx_end_date (endDate)
);

-- ============================================
-- 6. ANNOUNCEMENT VIEWS TABLE (for tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS announcement_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    announcementId INT NOT NULL,
    userId INT NOT NULL,
    viewedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (announcementId) REFERENCES importation_announcements(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES useraccounts(UserId),
    
    -- Prevent duplicate views
    UNIQUE KEY unique_view (announcementId, userId),
    
    -- Indexes
    INDEX idx_announcement (announcementId),
    INDEX idx_user (userId),
    INDEX idx_viewed_at (viewedAt)
);

-- ============================================
-- 7. FILE STORAGE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS file_storage (
    id VARCHAR(255) PRIMARY KEY, -- UUID
    originalName VARCHAR(255) NOT NULL,
    fileName VARCHAR(255) NOT NULL,
    filePath VARCHAR(500) NOT NULL,
    mimeType VARCHAR(100),
    fileSize INT,
    checksum VARCHAR(255),
    uploadedBy INT,
    uploadedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    isPublic BOOLEAN DEFAULT FALSE,
    expiresAt DATETIME,
    metadata JSON,
    downloadCount INT DEFAULT 0,
    lastDownloadDate DATETIME,
    
    -- Foreign key constraints
    FOREIGN KEY (uploadedBy) REFERENCES useraccounts(UserId),
    
    -- Indexes
    INDEX idx_uploaded_by (uploadedBy),
    INDEX idx_upload_date (uploadedDate),
    INDEX idx_file_name (fileName),
    INDEX idx_mime_type (mimeType),
    INDEX idx_expires_at (expiresAt)
);

-- ============================================
-- 8. IMPORTATION WORKFLOW HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS importation_workflow_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    importationRequestId INT NOT NULL,
    fromStatus VARCHAR(50),
    toStatus VARCHAR(50) NOT NULL,
    changedBy INT,
    changeDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    comments TEXT,
    metadata JSON,
    
    -- Foreign key constraints
    FOREIGN KEY (importationRequestId) REFERENCES importation_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (changedBy) REFERENCES useraccounts(UserId),
    
    -- Indexes
    INDEX idx_importation_request (importationRequestId),
    INDEX idx_change_date (changeDate),
    INDEX idx_from_status (fromStatus),
    INDEX idx_to_status (toStatus)
);

-- ============================================
-- DISPLAY TABLE CREATION STATUS
-- ============================================
SELECT 'All importation module tables created successfully!' as Status;

-- Show created tables
SHOW TABLES LIKE '%importation%';
SHOW TABLES LIKE '%rfd%';
SHOW TABLES LIKE '%proforma%';
SHOW TABLES LIKE '%swift%';
SHOW TABLES LIKE '%announcement%';
SHOW TABLES LIKE '%file_storage%';
SHOW TABLES LIKE '%workflow%';
