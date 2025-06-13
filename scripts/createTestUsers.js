// Script to create test users for the importation system
const sequelize = require('../config/databasePharmacy');
const UserAccounts = require('../src/models/userAccounts');
const Roles = require('../src/models/roles');
const Agent = require('../src/models/agent');
const bcrypt = require('bcryptjs');

// Import associations to ensure relationships are defined
require('../src/models/associations/associations');

// Import test configuration
const TEST_USERS = require('./testConfig').USERS;

async function createTestUsers() {
    try {
        console.log('🚀 Starting test user creation process...\n');
        
        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.\n');

        // Get all existing roles
        const existingRoles = await Roles.findAll({ order: [['RoleId', 'ASC']] });
        console.log('📋 Available roles in database:');
        existingRoles.forEach(role => {
            console.log(`   RoleId: ${role.RoleId} | RoleName: ${role.RoleName}`);
        });
        console.log('');

        // Define role mappings for test users
        const roleMapping = {
            agent: 'Agent',
            importExport: 'Import/Export',
            headPharmacy: 'Head Pharmacy',
            inspector: 'Inspector',
            admin: 'Admin'
        };

        // Check if all required roles exist
        const missingRoles = [];
        for (const [testRole, dbRoleName] of Object.entries(roleMapping)) {
            const role = existingRoles.find(r => r.RoleName === dbRoleName);
            if (!role) {
                missingRoles.push(dbRoleName);
            }
        }

        if (missingRoles.length > 0) {
            console.log('❌ Missing required roles in database:');
            missingRoles.forEach(role => console.log(`   - ${role}`));
            console.log('\n💡 Please run the addImportationRoles.js script first to create missing roles.');
            return;
        }

        console.log('📝 Creating test users...\n');

        // Create test users
        const createdUsers = [];
        let skippedUsers = [];

        for (const [userType, userData] of Object.entries(TEST_USERS)) {
            try {
                console.log(`🔄 Processing ${userType} user: ${userData.username}`);

                // Check if user already exists
                const existingUser = await UserAccounts.findOne({ 
                    where: { Username: userData.username } 
                });

                if (existingUser) {
                    console.log(`   ⚠️  User ${userData.username} already exists, skipping...`);
                    skippedUsers.push(userData.username);
                    continue;
                }

                // Get role ID
                const dbRoleName = roleMapping[userType];
                const role = existingRoles.find(r => r.RoleName === dbRoleName);
                
                if (!role) {
                    console.log(`   ❌ Role ${dbRoleName} not found for ${userType}, skipping...`);
                    continue;
                }                // Hash password
                const hashedPassword = await bcrypt.hash(userData.password, 10);

                // Create additional data for agent users
                let additionalData = {};
                if (userType === 'agent') {
                    // Create agent record first
                    const agentRecord = await Agent.create({
                        AgentName: `Test Agent ${userData.username}`,
                        AgentType: 'Supplier',
                        ContactPerson: 'John Smith',
                        PhoneNumber: '+1234567890',
                        Email: `${userData.username}@testmail.com`,
                        Address: '123 Test Street',
                        City: 'Test City',
                        Country: 'Test Country',
                        PostalCode: '12345',
                        IsSupplier: true,
                        IsManufacturer: false,
                        IsActive: true,
                        CreatedDate: new Date(),
                        UpdatedDate: new Date(),
                        esignature: '' // Ensure esignature is always set
                    });
                    
                    additionalData.AgentId = agentRecord.AgentID;
                    console.log(`   📋 Created agent record: ${agentRecord.AgentID}`);
                }

                // Create user
                const newUser = await UserAccounts.create({
                    Username: userData.username,
                    PasswordHash: hashedPassword,
                    RoleId: role.RoleId,
                    Email: `${userData.username}@testmail.com`,
                    IsActive: true,
                    ...additionalData
                });

                console.log(`   ✅ Created user: ${userData.username} (Role: ${dbRoleName}, ID: ${newUser.UserId})`);
                createdUsers.push({
                    username: userData.username,
                    role: dbRoleName,
                    userId: newUser.UserId
                });

            } catch (error) {
                console.log(`   ❌ Error creating user ${userData.username}: ${error.message}`);
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 SUMMARY');
        console.log('='.repeat(60));

        if (createdUsers.length > 0) {
            console.log(`✅ Successfully created ${createdUsers.length} test users:`);
            createdUsers.forEach(user => {
                console.log(`   • ${user.username} (${user.role}) - ID: ${user.userId}`);
            });
        }

        if (skippedUsers.length > 0) {
            console.log(`\n⚠️  Skipped ${skippedUsers.length} existing users:`);
            skippedUsers.forEach(username => {
                console.log(`   • ${username}`);
            });
        }

        console.log('\n🔑 Default password for all test users: password123');
        console.log('\n📧 Test user details:');
        
        // Display all test users with their credentials
        for (const [userType, userData] of Object.entries(TEST_USERS)) {
            const dbRoleName = roleMapping[userType];
            console.log(`   ${userType.toUpperCase()}:`);
            console.log(`     Username: ${userData.username}`);
            console.log(`     Password: ${userData.password}`);
            console.log(`     Role: ${dbRoleName}`);
            console.log(`     Email: ${userData.username}@testmail.com`);
            console.log('');
        }

        console.log('🧪 These users can now be used for API testing!');
        console.log('💡 Use these credentials with the test scripts:');
        console.log('   • npm run test-apis (full test suite)');
        console.log('   • npm run test-quick (quick test)');
        console.log('   • Or run: node scripts/testAllAPIs.js');

    } catch (error) {
        console.error('❌ Error creating test users:', error);
        console.error('\nFull error details:', error.stack);
    } finally {
        await sequelize.close();
        console.log('\n🔌 Database connection closed.');
    }
}

// Function to delete all test users (useful for cleanup)
async function deleteTestUsers() {
    try {
        console.log('🧹 Starting test user cleanup...\n');
        
        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.\n');

        console.log('🗑️  Deleting test users...');        const deletedUsers = [];
        for (const [userType, userData] of Object.entries(TEST_USERS)) {
            try {
                const user = await UserAccounts.findOne({ 
                    where: { Username: userData.username } 
                });

                if (user) {
                    // If this is an agent user, also delete the agent record
                    if (userType === 'agent' && user.AgentId) {
                        try {
                            await Agent.destroy({ where: { AgentID: user.AgentId } });
                            console.log(`   🗑️  Deleted agent record: ${user.AgentId}`);
                        } catch (agentError) {
                            console.log(`   ⚠️  Could not delete agent record: ${agentError.message}`);
                        }
                    }
                    
                    await user.destroy();
                    console.log(`   ✅ Deleted user: ${userData.username}`);
                    deletedUsers.push(userData.username);
                } else {
                    console.log(`   ⚠️  User ${userData.username} not found, skipping...`);
                }
            } catch (error) {
                console.log(`   ❌ Error deleting user ${userData.username}: ${error.message}`);
            }
        }

        console.log(`\n📊 Successfully deleted ${deletedUsers.length} test users.`);

    } catch (error) {
        console.error('❌ Error deleting test users:', error);
    } finally {
        await sequelize.close();
        console.log('\n🔌 Database connection closed.');
    }
}

// Function to verify test users exist and can login
async function verifyTestUsers() {
    try {
        console.log('🔍 Verifying test users...\n');
        
        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.\n');

        const verificationResults = [];

        for (const [userType, userData] of Object.entries(TEST_USERS)) {
            try {
                console.log(`🔄 Checking ${userType} user: ${userData.username}`);                const user = await UserAccounts.findOne({ 
                    where: { Username: userData.username },
                    include: [{
                        model: Roles,
                        as: 'role',
                        attributes: ['RoleName']
                    }]
                });

                if (!user) {
                    console.log(`   ❌ User ${userData.username} not found`);
                    verificationResults.push({ username: userData.username, status: 'NOT_FOUND' });
                    continue;
                }

                // Verify password
                const isValidPassword = await bcrypt.compare(userData.password, user.PasswordHash);
                if (!isValidPassword) {
                    console.log(`   ❌ Password verification failed for ${userData.username}`);
                    verificationResults.push({ username: userData.username, status: 'INVALID_PASSWORD' });
                    continue;
                }

                console.log(`   ✅ User ${userData.username} verified successfully`);
                console.log(`      Role: ${user.role ? user.role.RoleName : 'No role'}`);                console.log(`      Active: ${user.IsActive ? 'Yes' : 'No'}`);
                console.log(`      Email: ${user.Email || 'Not set'}`);
                
                verificationResults.push({ 
                    username: userData.username, 
                    status: 'VERIFIED',
                    role: user.role ? user.role.RoleName : null,
                    isActive: user.IsActive
                });

            } catch (error) {
                console.log(`   ❌ Error verifying user ${userData.username}: ${error.message}`);
                verificationResults.push({ username: userData.username, status: 'ERROR', error: error.message });
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 VERIFICATION SUMMARY');
        console.log('='.repeat(60));

        const verified = verificationResults.filter(r => r.status === 'VERIFIED');
        const failed = verificationResults.filter(r => r.status !== 'VERIFIED');

        console.log(`✅ Verified users: ${verified.length}`);
        verified.forEach(result => {
            console.log(`   • ${result.username} (${result.role})`);
        });

        if (failed.length > 0) {
            console.log(`\n❌ Failed verification: ${failed.length}`);
            failed.forEach(result => {
                console.log(`   • ${result.username} - ${result.status}`);
            });
        }

        if (verified.length === Object.keys(TEST_USERS).length) {
            console.log('\n🎉 All test users are ready for testing!');
        } else {
            console.log('\n⚠️  Some test users need attention before testing.');
        }

    } catch (error) {
        console.error('❌ Error verifying test users:', error);
    } finally {
        await sequelize.close();
        console.log('\n🔌 Database connection closed.');
    }
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'create':
        createTestUsers();
        break;
    case 'delete':
        deleteTestUsers();
        break;
    case 'verify':
        verifyTestUsers();
        break;    case 'recreate':
        console.log('🔄 Recreating test users (delete + create)...\n');
        (async () => {
            await deleteTestUsers();
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            await createTestUsers();
        })();
        break;
    default:
        console.log('🛠️  Test User Management Script');
        console.log('Usage: node scripts/createTestUsers.js <command>');
        console.log('');
        console.log('Commands:');
        console.log('  create    - Create all test users');
        console.log('  delete    - Delete all test users');
        console.log('  verify    - Verify test users exist and can login');
        console.log('  recreate  - Delete and recreate all test users');
        console.log('');
        console.log('Examples:');
        console.log('  node scripts/createTestUsers.js create');
        console.log('  node scripts/createTestUsers.js verify');
        console.log('  node scripts/createTestUsers.js recreate');
        break;
}

module.exports = {
    createTestUsers,
    deleteTestUsers,
    verifyTestUsers
};
