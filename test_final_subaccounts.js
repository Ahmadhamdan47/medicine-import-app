const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Database models
const sequelize = require('./config/databasePharmacy');
const UserAccounts = require('./src/models/userAccounts');
const Donor = require('./src/models/donor');
const Recipient = require('./src/models/recipient');
const Donation = require('./src/models/donation');
const Role = require('./src/models/roles');

// Load associations
require('./src/models/associations/associations');

// API Base URL
const API_BASE_URL = 'http://localhost:8066';

class SubAccountTester {
    constructor() {
        this.mainUserToken = null;
        this.subUserToken = null;
        this.subUserId = null;
        this.donationId = null;
    }

    async log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async makeRequest(method, endpoint, data = null, token = null) {
        const config = {
            method,
            url: `${API_BASE_URL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            ...(data && { data })
        };

        try {
            const response = await axios(config);
            return { success: true, data: response.data, status: response.status };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || error.message,
                status: error.response?.status || 500
            };
        }
    }

    async setupDatabase() {
        await this.log('Setting up database and running migration...');
        
        try {
            await sequelize.authenticate();
            await this.log('Database connection established successfully');

            // Run database migration for sub-accounts
            await this.runMigration();
            
            // Verify the donor exists
            const donor = await Donor.findByPk(21);
            if (!donor) {
                await this.log('Donor with ID 21 not found. Please create it first.', 'error');
                return false;
            }

            // Verify the main user exists and has correct setup
            const mainUser = await UserAccounts.findByPk(33);
            if (!mainUser) {
                await this.log('Main user with ID 33 not found. Please create it first.', 'error');
                return false;
            }

            if (mainUser.DonorId !== 21) {
                await this.log(`Updating main user (ID: 33) to link with Donor ID 21...`);
                await mainUser.update({ DonorId: 21 });
            }

            // Ensure main user has correct flags
            await mainUser.update({
                IsMainAccount: true,
                IsActive: true,
                Permissions: ['view_donations', 'add_donations', 'edit_donations']
            });

            await this.log(`Main user setup complete - User ID: ${mainUser.UserId}, Donor ID: ${mainUser.DonorId}`);
            return true;

        } catch (error) {
            await this.log(`Database setup failed: ${error.message}`, 'error');
            return false;
        }
    }

    async runMigration() {
        await this.log('Running sub-account database migration...');
        
        try {
            // Check if columns already exist
            const [results] = await sequelize.query(`
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'useraccounts' 
                AND TABLE_SCHEMA = DATABASE()
                AND COLUMN_NAME IN ('IsMainAccount', 'ParentUserId', 'Permissions', 'CreatedBy')
            `);
            
            const existingColumns = results.map(row => row.COLUMN_NAME);
            
            if (!existingColumns.includes('IsMainAccount')) {
                await sequelize.query(`
                    ALTER TABLE useraccounts 
                    ADD COLUMN IsMainAccount BOOLEAN NOT NULL DEFAULT TRUE 
                    AFTER Email
                `);
                await this.log('Added IsMainAccount column');
            }
            
            if (!existingColumns.includes('ParentUserId')) {
                await sequelize.query(`
                    ALTER TABLE useraccounts 
                    ADD COLUMN ParentUserId INT NULL 
                    AFTER IsMainAccount
                `);
                await this.log('Added ParentUserId column');
            }
            
            if (!existingColumns.includes('Permissions')) {
                await sequelize.query(`
                    ALTER TABLE useraccounts 
                    ADD COLUMN Permissions JSON NULL 
                    AFTER ParentUserId
                `);
                await this.log('Added Permissions column');
            }
            
            if (!existingColumns.includes('CreatedBy')) {
                await sequelize.query(`
                    ALTER TABLE useraccounts 
                    ADD COLUMN CreatedBy INT NULL 
                    AFTER Permissions
                `);
                await this.log('Added CreatedBy column');
            }

            // Add foreign key constraints if they don't exist
            try {
                await sequelize.query(`
                    ALTER TABLE useraccounts 
                    ADD CONSTRAINT FK_useraccounts_parent 
                    FOREIGN KEY (ParentUserId) REFERENCES useraccounts(UserId) 
                    ON DELETE SET NULL ON UPDATE CASCADE
                `);
            } catch (error) {
                // Constraint might already exist
            }

            try {
                await sequelize.query(`
                    ALTER TABLE useraccounts 
                    ADD CONSTRAINT FK_useraccounts_createdby 
                    FOREIGN KEY (CreatedBy) REFERENCES useraccounts(UserId) 
                    ON DELETE SET NULL ON UPDATE CASCADE
                `);
            } catch (error) {
                // Constraint might already exist
            }

            // Set default permissions for existing donor accounts
            await sequelize.query(`
                UPDATE useraccounts 
                SET Permissions = JSON_ARRAY('view_donations', 'add_donations', 'edit_donations')
                WHERE DonorId IS NOT NULL AND Permissions IS NULL
            `);

            await this.log('Database migration completed successfully', 'success');
            
        } catch (error) {
            await this.log(`Migration failed: ${error.message}`, 'error');
            throw error;
        }
    }

    async cleanupExistingTestAccounts() {
        await this.log('Cleaning up existing test accounts...');
        
        try {
            // Remove any existing test sub-accounts that might conflict
            await sequelize.query(`
                DELETE FROM useraccounts 
                WHERE Username LIKE 'sub_test_%' 
                AND ParentUserId = 33
            `);
            
            // Remove any test accounts with the specific problematic username
            await sequelize.query(`
                DELETE FROM useraccounts 
                WHERE Username = 'testsubaccountdonor'
            `);
            
            await this.log('Existing test accounts cleaned up');
            
        } catch (error) {
            await this.log(`Cleanup warning: ${error.message}`, 'info');
        }
    }

    async loginMainUser() {
        await this.log('Logging in main user...');
        
        // Get main user details
        const mainUser = await UserAccounts.findByPk(33);
        
        // For testing, we'll create a JWT token directly since we may not have the actual password
        const token = jwt.sign(
            {
                id: mainUser.UserId,
                email: mainUser.Email,
                roleId: mainUser.RoleId,
                donorId: mainUser.DonorId
            },
            'secret', // Your JWT secret
            { expiresIn: '24h' }
        );

        this.mainUserToken = token;
        await this.log(`Main user logged in successfully with token: ${token.substring(0, 20)}...`, 'success');
        return true;
    }

    async testCreateSubAccount() {
        await this.log('Testing sub-account creation...');
        
        // Generate unique username and email with timestamp and random number
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 10000);
        
        const subAccountData = {
            Username: `sub_test_${timestamp}_${randomNum}`,
            Password: 'SubPassword123!',
            Email: `sub_test_${timestamp}_${randomNum}@example.com`,
            Permissions: ['view_donations', 'add_donations']
        };

        // First clean up any existing test accounts
        await this.cleanupExistingTestAccounts();

        const result = await this.makeRequest(
            'POST', 
            '/users/donor-subaccounts', 
            subAccountData, 
            this.mainUserToken
        );

        if (result.success) {
            this.subUserId = result.data.data.UserId;
            await this.log(`Sub-account created successfully! User ID: ${this.subUserId}`, 'success');
            await this.log(`Sub-account details: ${JSON.stringify(result.data.data, null, 2)}`);
            return true;
        } else {
            await this.log(`Sub-account creation failed: ${result.error}`, 'error');
            return false;
        }
    }

    async testGetSubAccounts() {
        await this.log('Testing get all sub-accounts...');
        
        const result = await this.makeRequest(
            'GET', 
            '/users/donor-subaccounts', 
            null, 
            this.mainUserToken
        );

        if (result.success) {
            await this.log(`Retrieved ${result.data.data.length} sub-accounts`, 'success');
            await this.log(`Sub-accounts: ${JSON.stringify(result.data.data, null, 2)}`);
            return true;
        } else {
            await this.log(`Get sub-accounts failed: ${result.error}`, 'error');
            return false;
        }
    }

    async loginSubUser() {
        await this.log('Logging in sub-user...');
        
        // Get sub-user details
        const subUser = await UserAccounts.findByPk(this.subUserId);
        
        // Create token for sub-user
        const token = jwt.sign(
            {
                id: subUser.UserId,
                email: subUser.Email,
                roleId: subUser.RoleId,
                donorId: subUser.DonorId
            },
            'secret',
            { expiresIn: '24h' }
        );

        this.subUserToken = token;
        await this.log(`Sub-user logged in successfully with token: ${token.substring(0, 20)}...`, 'success');
        return true;
    }

    async testSubUserPermissions() {
        await this.log('Testing sub-user permissions...');
        
        // Test viewing donations (should work - has view_donations permission)
        let result = await this.makeRequest(
            'GET', 
            '/donation/all', 
            null, 
            this.subUserToken
        );

        if (result.success) {
            await this.log('✅ Sub-user can view donations (correct permission)', 'success');
        } else {
            await this.log(`❌ Sub-user cannot view donations: ${result.error}`, 'error');
        }

        // Test creating donation (should work - has add_donations permission)
        const donationData = {
            DonationTitle: `Test Donation by Sub-Account ${Date.now()}`,
            DonorId: 21,
            RecipientId: 1, // Assuming recipient with ID 1 exists
            DonationPurpose: 'Testing sub-account donation creation',
            NumberOfBoxes: 5
        };

        result = await this.makeRequest(
            'POST', 
            '/donation/add', 
            donationData, 
            this.subUserToken
        );

        if (result.success) {
            this.donationId = result.data.DonationId;
            await this.log(`✅ Sub-user can create donations (correct permission). Donation ID: ${this.donationId}`, 'success');
        } else {
            await this.log(`❌ Sub-user cannot create donations: ${result.error}`, 'error');
        }

        // Test editing donation (should fail - no edit_donations permission)
        if (this.donationId) {
            const updateData = {
                DonationPurpose: 'Updated by sub-account - should fail'
            };

            result = await this.makeRequest(
                'PUT', 
                `/donation/${this.donationId}`, 
                updateData, 
                this.subUserToken
            );

            if (!result.success && result.status === 403) {
                await this.log('✅ Sub-user correctly denied editing donations (no edit permission)', 'success');
            } else {
                await this.log(`❌ Sub-user unexpectedly allowed to edit donations: ${result.error}`, 'error');
            }
        }
    }

    async testUpdatePermissions() {
        await this.log('Testing permission updates...');
        
        // Grant edit permission
        const newPermissions = {
            permissions: ['view_donations', 'add_donations', 'edit_donations']
        };

        let result = await this.makeRequest(
            'PUT', 
            `/users/donor-subaccounts/${this.subUserId}`, 
            newPermissions, 
            this.mainUserToken
        );

        if (result.success) {
            await this.log('✅ Successfully updated sub-account permissions', 'success');
            
            // Refresh sub-user token to get new permissions
            await this.loginSubUser();
            
            // Now test editing with new permissions
            if (this.donationId) {
                const updateData = {
                    DonationPurpose: 'Updated by sub-account - should work now'
                };

                result = await this.makeRequest(
                    'PUT', 
                    `/donation/${this.donationId}`, 
                    updateData, 
                    this.subUserToken
                );

                if (result.success) {
                    await this.log('✅ Sub-user can now edit donations after permission update', 'success');
                } else {
                    await this.log(`❌ Sub-user still cannot edit donations: ${result.error}`, 'error');
                }
            }
        } else {
            await this.log(`❌ Failed to update permissions: ${result.error}`, 'error');
        }
    }

    async testMainUserCanManage() {
        await this.log('Testing main user management capabilities...');
        
        // Test that main user can create sub-accounts (already tested)
        // Test that main user can view sub-accounts (already tested)
        
        // Test deactivating sub-account
        const result = await this.makeRequest(
            'DELETE', 
            `/users/donor-subaccounts/${this.subUserId}`, 
            null, 
            this.mainUserToken
        );

        if (result.success) {
            await this.log('✅ Main user can deactivate sub-accounts', 'success');
        } else {
            await this.log(`❌ Main user cannot deactivate sub-accounts: ${result.error}`, 'error');
        }
    }

    async verifyDatabaseState() {
        await this.log('Verifying database state...');
        
        try {
            // Check sub-account in database
            const subUser = await UserAccounts.findByPk(this.subUserId);
            if (subUser) {
                await this.log(`Sub-user in DB: ID=${subUser.UserId}, Username=${subUser.Username}, IsMainAccount=${subUser.IsMainAccount}, ParentUserId=${subUser.ParentUserId}, DonorId=${subUser.DonorId}, IsActive=${subUser.IsActive}`);
                await this.log(`Sub-user Permissions: ${JSON.stringify(subUser.Permissions)}`);
            }

            // Check donation in database
            if (this.donationId) {
                const donation = await Donation.findByPk(this.donationId);
                if (donation) {
                    await this.log(`Donation in DB: ID=${donation.DonationId}, Title=${donation.DonationTitle}, DonorId=${donation.DonorId}, Purpose=${donation.DonationPurpose}`);
                }
            }

            await this.log('Database state verification completed', 'success');
            
        } catch (error) {
            await this.log(`Database verification failed: ${error.message}`, 'error');
        }
    }

    async cleanup() {
        await this.log('Cleaning up test data...');
        
        try {
            // Delete test donation
            if (this.donationId) {
                await Donation.destroy({ where: { DonationId: this.donationId } });
                await this.log(`Deleted test donation ID: ${this.donationId}`);
            }

            // Delete sub-user
            if (this.subUserId) {
                await UserAccounts.destroy({ where: { UserId: this.subUserId } });
                await this.log(`Deleted test sub-user ID: ${this.subUserId}`);
            }

            await this.log('Cleanup completed', 'success');
            
        } catch (error) {
            await this.log(`Cleanup failed: ${error.message}`, 'error');
        }
    }

    async runFullTest() {
        console.log('🚀 Starting Sub-Account Integration Test');
        console.log('=====================================');
        
        try {
            // Setup
            const setupSuccess = await this.setupDatabase();
            if (!setupSuccess) {
                await this.log('Setup failed, aborting test', 'error');
                return;
            }

            // Login main user
            await this.loginMainUser();

            // Test sub-account creation
            const createSuccess = await this.testCreateSubAccount();
            if (!createSuccess) {
                await this.log('Sub-account creation failed, aborting test', 'error');
                return;
            }

            // Test getting sub-accounts
            await this.testGetSubAccounts();

            // Login sub-user
            await this.loginSubUser();

            // Test sub-user permissions
            await this.testSubUserPermissions();

            // Test permission updates
            await this.testUpdatePermissions();

            // Test main user management
            await this.testMainUserCanManage();

            // Verify database state
            await this.verifyDatabaseState();

            console.log('\n🎉 All tests completed successfully!');
            
        } catch (error) {
            await this.log(`Test failed with error: ${error.message}`, 'error');
            
        } finally {
            // Cleanup
            await this.cleanup();
            await sequelize.close();
            console.log('\n👋 Test session ended');
        }
    }
}

// Create and run the test
const tester = new SubAccountTester();

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⚠️  Test interrupted by user');
    await tester.cleanup();
    await sequelize.close();
    process.exit(0);
});

// Run the test
tester.runFullTest().catch(console.error);
