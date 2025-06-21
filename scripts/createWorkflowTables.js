const sequelize = require('../config/databasePharmacy');

async function createWorkflowTables() {
    try {
        console.log('Creating workflow tables...');

        // Create workflow_states table
        await sequelize.query(`
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
                INDEX idx_created_by (created_by)
            )
        `);
        console.log('✓ workflow_states table created');        // Create step_completions table
        await sequelize.query(`
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
            )
        `);
        console.log('✓ step_completions table created');        // Create quality_reviews table
        await sequelize.query(`
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
            )
        `);
        console.log('✓ quality_reviews table created');        // Create pricing_reviews table
        await sequelize.query(`
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
            )
        `);
        console.log('✓ pricing_reviews table created');        // Create workflow_notifications table
        await sequelize.query(`
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
            )
        `);
        console.log('✓ workflow_notifications table created');        // Check if useraccounts table exists and add WorkflowRole column if needed
        try {
            const [userAccounts] = await sequelize.query("SHOW TABLES LIKE 'useraccounts'");
            if (userAccounts.length > 0) {
                // Check if WorkflowRole column exists
                const [columns] = await sequelize.query("SHOW COLUMNS FROM useraccounts LIKE 'WorkflowRole'");
                if (columns.length === 0) {
                    await sequelize.query(`
                        ALTER TABLE useraccounts ADD COLUMN WorkflowRole ENUM('agent', 'import_export', 'quality_committee', 'pricing_committee', 'admin') DEFAULT 'agent'
                    `);
                    console.log('✓ Added WorkflowRole column to useraccounts table');
                } else {
                    console.log('✓ WorkflowRole column already exists in useraccounts table');
                }
            } else {
                console.log('⚠ UserAccounts table does not exist, skipping WorkflowRole column addition');
            }

            // Check if workflow roles exist in roles table
            const [roles] = await sequelize.query("SHOW TABLES LIKE 'roles'");
            if (roles.length > 0) {
                // Insert workflow roles if they don't exist
                const workflowRoles = [
                    'Workflow Agent',
                    'Import Export Officer',
                    'Quality Committee Member',
                    'Pricing Committee Member',
                    'Workflow Admin'
                ];
                
                for (const roleName of workflowRoles) {
                    await sequelize.query(`
                        INSERT IGNORE INTO roles (RoleName) VALUES (?)
                    `, {
                        replacements: [roleName]
                    });
                }
                console.log('✓ Workflow roles added to roles table');
            }
        } catch (error) {
            console.log('⚠ Could not update user tables:', error.message);
        }

        console.log('✅ All workflow tables created successfully!');
        
    } catch (error) {
        console.error('❌ Error creating workflow tables:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    createWorkflowTables()
        .then(() => {
            console.log('Migration completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Migration failed:', error);
            process.exit(1);
        });
}

module.exports = createWorkflowTables;
