// Script to create all importation module tables using Sequelize
const sequelize = require('../config/databasePharmacy');

// Import all models to ensure they're defined
const ImportationRequest = require('../src/models/importationRequest');
const RFDRequest = require('../src/models/rfdRequest');
const ProformaRequest = require('../src/models/proformaRequest');
const SwiftPayment = require('../src/models/swiftPayment');
const ImportationAnnouncement = require('../src/models/importationAnnouncement');

// Import associations to set up relationships
require('../src/models/associations/associations');

async function createImportationTables() {
    try {
        console.log('🔄 Starting database table creation...');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Create tables in order (respecting foreign key dependencies)
        console.log('\n📋 Creating importation module tables...');

        // 1. Create ImportationRequest table first (referenced by others)
        await ImportationRequest.sync({ force: false });
        console.log('✅ importation_requests table created/verified');

        // 2. Create dependent tables
        await RFDRequest.sync({ force: false });
        console.log('✅ rfd_requests table created/verified');

        await ProformaRequest.sync({ force: false });
        console.log('✅ proforma_requests table created/verified');

        await SwiftPayment.sync({ force: false });
        console.log('✅ swift_payments table created/verified');

        // 3. Create independent tables
        await ImportationAnnouncement.sync({ force: false });
        console.log('✅ importation_announcements table created/verified');

        // 4. Create additional tables using raw SQL for custom features
        await createAdditionalTables();

        console.log('\n🎉 All importation module tables created successfully!');
        
        // Display table information
        await displayTableInfo();

    } catch (error) {
        console.error('❌ Error creating tables:', error);
        throw error;
    } finally {
        await sequelize.close();
    }
}

async function createAdditionalTables() {
    console.log('\n📋 Creating additional tables...');

    // Create announcement_views table for tracking
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS announcement_views (
            id INT AUTO_INCREMENT PRIMARY KEY,
            announcementId INT NOT NULL,
            userId INT NOT NULL,
            viewedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (announcementId) REFERENCES importation_announcements(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES useraccounts(UserId),
            
            UNIQUE KEY unique_view (announcementId, userId),
            INDEX idx_announcement (announcementId),
            INDEX idx_user (userId),
            INDEX idx_viewed_at (viewedAt)
        )
    `);
    console.log('✅ announcement_views table created/verified');

    // Create file_storage table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS file_storage (
            id VARCHAR(255) PRIMARY KEY,
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
            
            FOREIGN KEY (uploadedBy) REFERENCES useraccounts(UserId),
            INDEX idx_uploaded_by (uploadedBy),
            INDEX idx_upload_date (uploadedDate),
            INDEX idx_file_name (fileName),
            INDEX idx_mime_type (mimeType),
            INDEX idx_expires_at (expiresAt)
        )
    `);
    console.log('✅ file_storage table created/verified');

    // Create workflow history table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS importation_workflow_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            importationRequestId INT NOT NULL,
            fromStatus VARCHAR(50),
            toStatus VARCHAR(50) NOT NULL,
            changedBy INT,
            changeDate DATETIME DEFAULT CURRENT_TIMESTAMP,
            comments TEXT,
            metadata JSON,
            
            FOREIGN KEY (importationRequestId) REFERENCES importation_requests(id) ON DELETE CASCADE,
            FOREIGN KEY (changedBy) REFERENCES useraccounts(UserId),
            INDEX idx_importation_request (importationRequestId),
            INDEX idx_change_date (changeDate),
            INDEX idx_from_status (fromStatus),
            INDEX idx_to_status (toStatus)
        )
    `);
    console.log('✅ importation_workflow_history table created/verified');
}

async function displayTableInfo() {
    console.log('\n📊 Table Information:');
    
    try {
        // Get table list
        const [tables] = await sequelize.query(`
            SHOW TABLES LIKE '%importation%' 
            UNION 
            SHOW TABLES LIKE '%rfd%'
            UNION 
            SHOW TABLES LIKE '%proforma%'
            UNION 
            SHOW TABLES LIKE '%swift%'
            UNION 
            SHOW TABLES LIKE '%announcement%'
            UNION 
            SHOW TABLES LIKE '%file_storage%'
            UNION 
            SHOW TABLES LIKE '%workflow%'
        `);

        if (tables.length > 0) {
            console.log('\n📋 Created Tables:');
            tables.forEach((table, index) => {
                const tableName = Object.values(table)[0];
                console.log(`${index + 1}. ${tableName}`);
            });
        }

        // Get row counts for verification
        console.log('\n📈 Table Row Counts:');
        const tablesToCheck = [
            'importation_requests',
            'rfd_requests', 
            'proforma_requests',
            'swift_payments',
            'importation_announcements',
            'announcement_views',
            'file_storage',
            'importation_workflow_history'
        ];

        for (const tableName of tablesToCheck) {
            try {
                const [result] = await sequelize.query(`SELECT COUNT(*) as count FROM ${tableName}`);
                console.log(`${tableName}: ${result[0].count} rows`);
            } catch (error) {
                console.log(`${tableName}: Table not found or error occurred`);
            }
        }

    } catch (error) {
        console.log('Could not retrieve table information:', error.message);
    }
}

// Add option to force recreate tables (use with caution!)
const args = process.argv.slice(2);
const forceRecreate = args.includes('--force');

if (forceRecreate) {
    console.log('⚠️  WARNING: Force recreation enabled - this will drop existing tables!');
    console.log('Proceeding in 3 seconds... Press Ctrl+C to cancel');
    
    setTimeout(() => {
        createImportationTables().catch(console.error);
    }, 3000);
} else {
    // Normal execution
    createImportationTables().catch(console.error);
}
