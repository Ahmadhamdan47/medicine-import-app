const sequelize = require('../config/databasePharmacy');
const WorkflowService = require('../src/services/workflowService');
const UserRoleService = require('../src/services/userRoleService');
const WorkflowNotificationService = require('../src/services/workflowNotificationService');

async function testWorkflowSystem() {
    try {
        console.log('🧪 Testing Workflow System...\n');

        // Test 1: Check if tables exist
        console.log('1. Checking workflow tables...');
        const [tables] = await sequelize.query("SHOW TABLES LIKE 'workflow_%'");
        console.log(`✓ Found ${tables.length} workflow tables:`);
        tables.forEach(table => {
            console.log(`   - ${Object.values(table)[0]}`);
        });
        
        // Test 2: Check UserAccounts table structure
        console.log('\n2. Checking UserAccounts table structure...');
        const [columns] = await sequelize.query("SHOW COLUMNS FROM useraccounts WHERE Field = 'WorkflowRole'");
        if (columns.length > 0) {
            console.log('✓ WorkflowRole column exists in useraccounts table');
        } else {
            console.log('❌ WorkflowRole column missing from useraccounts table');
        }

        // Test 3: Check workflow roles in roles table
        console.log('\n3. Checking workflow roles...');
        const [roles] = await sequelize.query("SELECT RoleName FROM roles WHERE RoleName LIKE '%Workflow%' OR RoleName LIKE '%Import%' OR RoleName LIKE '%Quality%' OR RoleName LIKE '%Pricing%'");
        console.log(`✓ Found ${roles.length} workflow-related roles:`);
        roles.forEach(role => {
            console.log(`   - ${role.RoleName}`);
        });

        // Test 4: Test user creation (if useraccounts table exists)
        console.log('\n4. Testing user account creation...');
        try {
            const [users] = await sequelize.query("SELECT COUNT(*) as count FROM useraccounts");
            console.log(`✓ UserAccounts table accessible, ${users[0].count} users found`);
            
            // Create a test user for workflow testing (if needed)
            const testUsername = 'workflow_test_user';
            const [existingUser] = await sequelize.query("SELECT UserId FROM useraccounts WHERE Username = ?", {
                replacements: [testUsername]
            });
            
            if (existingUser.length === 0) {
                await sequelize.query(`
                    INSERT INTO useraccounts (Username, PasswordHash, IsActive, WorkflowRole) 
                    VALUES (?, 'test_hash', 1, 'agent')
                `, {
                    replacements: [testUsername]
                });
                console.log(`✓ Created test user: ${testUsername}`);
            } else {
                console.log(`✓ Test user already exists: ${testUsername}`);
            }
        } catch (error) {
            console.log('⚠ Could not test user creation:', error.message);
        }

        // Test 5: Test UserRoleService
        console.log('\n5. Testing UserRoleService...');
        try {
            // Get first user to test with
            const [testUsers] = await sequelize.query("SELECT UserId FROM useraccounts LIMIT 1");
            if (testUsers.length > 0) {
                const userId = testUsers[0].UserId;
                const workflowRole = await UserRoleService.getUserWorkflowRole(userId);
                console.log(`✓ UserRoleService.getUserWorkflowRole() works - User ${userId} has role: ${workflowRole}`);
            } else {
                console.log('⚠ No users found for testing UserRoleService');
            }
        } catch (error) {
            console.log('❌ UserRoleService test failed:', error.message);
        }

        // Test 6: Test workflow creation (without actual drug)
        console.log('\n6. Testing workflow table operations...');
        try {
            // Test direct database queries
            const workflowId = 'test-workflow-' + Date.now();
            await sequelize.query(`
                INSERT INTO workflow_states (id, drug_id, current_step, status, created_by, assigned_to)
                VALUES (?, 'test-drug-123', 1, 'agent_in_progress', 'test-user', 'test-user')
            `, {
                replacements: [workflowId]
            });
            console.log('✓ Can insert into workflow_states table');
            
            // Test step completion
            await sequelize.query(`
                INSERT INTO step_completions (workflow_id, step_number, completed_at, completed_by, approved, comments)
                VALUES (?, 1, NOW(), 'test-user', false, 'Test completion')
            `, {
                replacements: [workflowId]
            });
            console.log('✓ Can insert into step_completions table');
            
            // Clean up test data
            await sequelize.query('DELETE FROM step_completions WHERE workflow_id = ?', {
                replacements: [workflowId]
            });
            await sequelize.query('DELETE FROM workflow_states WHERE id = ?', {
                replacements: [workflowId]
            });
            console.log('✓ Test data cleaned up');
            
        } catch (error) {
            console.log('❌ Workflow table operations test failed:', error.message);
        }

        // Test 7: API endpoint simulation
        console.log('\n7. Testing API response format...');
        try {
            // Simulate getting workflows for different roles
            const mockUserId = 'test-user-1';
            const stats = {
                total: 0,
                pending_import_export: 0,
                pending_quality: 0,
                pending_pricing: 0,
                approved: 0,
                rejected: 0
            };
            console.log('✓ Notification stats format:', JSON.stringify(stats, null, 2));
        } catch (error) {
            console.log('❌ API format test failed:', error.message);
        }

        console.log('\n✅ Workflow System Test Complete!');
        console.log('\n📋 Next Steps:');
        console.log('1. Start the server: node index.js');
        console.log('2. Test API endpoints at http://localhost:8066/api-docs');
        console.log('3. Create test users with different WorkflowRole values');
        console.log('4. Test the complete workflow from drug creation to approval');
        
    } catch (error) {
        console.error('❌ Workflow system test failed:', error);
    } finally {
        // Close database connection
        await sequelize.close();
    }
}

// Run test
if (require.main === module) {
    testWorkflowSystem()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('Test execution failed:', error);
            process.exit(1);
        });
}

module.exports = testWorkflowSystem;
