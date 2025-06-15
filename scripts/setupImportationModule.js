// Complete setup script for importation module
const sequelize = require('../config/databasePharmacy');
const Roles = require('../src/models/roles');

// Import all models
const ImportationRequest = require('../src/models/importationRequest');
const RFDRequest = require('../src/models/rfdRequest');
const ProformaRequest = require('../src/models/proformaRequest');
const SwiftPayment = require('../src/models/swiftPayment');
const ImportationAnnouncement = require('../src/models/importationAnnouncement');

// Import associations
require('../src/models/associations/associations');

async function setupImportationModule() {
    try {
        console.log('🚀 Starting Importation Module Setup...');
        console.log('=====================================\n');
        
        // Step 1: Connect to database
        await sequelize.authenticate();
        console.log('✅ Database connection established');

        // Step 2: Setup roles
        console.log('\n📋 Setting up roles...');
        await setupRoles();

        // Step 3: Create tables
        console.log('\n📋 Creating tables...');
        await createTables();

        // Step 4: Verify setup
        console.log('\n📋 Verifying setup...');
        await verifySetup();

        console.log('\n🎉 Importation Module Setup Complete!');
        console.log('=====================================');
        console.log('✅ All roles created');
        console.log('✅ All tables created');
        console.log('✅ Ready for use');

    } catch (error) {
        console.error('❌ Setup failed:', error);
        throw error;
    } finally {
        await sequelize.close();
    }
}

async function setupRoles() {
    try {
        // Check existing roles
        const existingRoles = await Roles.findAll({ order: [['RoleId', 'ASC']] });
        console.log('Current roles:');
        existingRoles.forEach(role => {
            console.log(`  - RoleId: ${role.RoleId}, RoleName: ${role.RoleName}`);
        });

        // Required roles for importation system
        const requiredRoles = [
            { id: 4, name: 'Import/Export' },
            { id: 5, name: 'Head Pharmacy' },
            { id: 6, name: 'Inspector' },
            { id: 8, name: 'Quality Study Committee' },
            { id: 9, name: 'Pricing Committee' }
        ];

        // Add missing roles
        for (const role of requiredRoles) {
            const existingRole = await Roles.findOne({ 
                where: { RoleName: role.name } 
            });

            if (!existingRole) {
                await Roles.create({
                    RoleId: role.id,
                    RoleName: role.name
                });
                console.log(`✅ Created role: ${role.name} (ID: ${role.id})`);
            } else {
                console.log(`✅ Role already exists: ${role.name} (ID: ${existingRole.RoleId})`);
            }
        }

    } catch (error) {
        console.error('❌ Error setting up roles:', error);
        throw error;
    }
}

async function createTables() {
    try {
        // Create main tables using Sequelize models
        console.log('Creating main tables...');
        
        await ImportationRequest.sync({ force: false });
        console.log('✅ importation_requests');

        await RFDRequest.sync({ force: false });
        console.log('✅ rfd_requests');

        await ProformaRequest.sync({ force: false });
        console.log('✅ proforma_requests');

        await SwiftPayment.sync({ force: false });
        console.log('✅ swift_payments');

        await ImportationAnnouncement.sync({ force: false });
        console.log('✅ importation_announcements');

        // Create additional tables with custom SQL
        console.log('\nCreating supporting tables...');
        
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS announcement_views (
                id INT AUTO_INCREMENT PRIMARY KEY,
                announcementId INT NOT NULL,
                userId INT NOT NULL,
                viewedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                
                FOREIGN KEY (announcementId) REFERENCES importation_announcements(id) ON DELETE CASCADE,
                FOREIGN KEY (userId) REFERENCES useraccounts(UserId),
                
                UNIQUE KEY unique_view (announcementId, userId)
            )
        `);
        console.log('✅ announcement_views');

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
                
                FOREIGN KEY (uploadedBy) REFERENCES useraccounts(UserId)
            )
        `);
        console.log('✅ file_storage');

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
                FOREIGN KEY (changedBy) REFERENCES useraccounts(UserId)
            )
        `);
        console.log('✅ importation_workflow_history');

    } catch (error) {
        console.error('❌ Error creating tables:', error);
        throw error;
    }
}

async function verifySetup() {
    try {
        // Verify roles
        const roles = await Roles.findAll({ order: [['RoleId', 'ASC']] });
        console.log('\nFinal roles:');
        roles.forEach(role => {
            console.log(`  ${role.RoleId}: ${role.RoleName}`);
        });

        // Verify tables
        const [tables] = await sequelize.query(`
            SHOW TABLES LIKE '%importation%' 
            UNION SHOW TABLES LIKE '%rfd%'
            UNION SHOW TABLES LIKE '%proforma%'
            UNION SHOW TABLES LIKE '%swift%'
            UNION SHOW TABLES LIKE '%announcement%'
            UNION SHOW TABLES LIKE '%file_storage%'
            UNION SHOW TABLES LIKE '%workflow%'
        `);

        console.log('\nCreated tables:');
        tables.forEach((table, index) => {
            const tableName = Object.values(table)[0];
            console.log(`  ${index + 1}. ${tableName}`);
        });

        console.log('\n📊 System ready for:');
        console.log('  - User authentication with role-based access');
        console.log('  - Importation request management');
        console.log('  - RFD document handling');
        console.log('  - Proforma invoice processing');
        console.log('  - Swift payment verification');
        console.log('  - Announcement system');
        console.log('  - File storage and management');
        console.log('  - Workflow tracking and history');

    } catch (error) {
        console.error('❌ Error during verification:', error);
        throw error;
    }
}

// Run the setup
setupImportationModule().catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
});
