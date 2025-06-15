// Script to initialize roles in the database for the importation system
const sequelize = require('../config/databasePharmacy');
const Role = require('../src/models/roles');

async function initializeRoles() {
    try {
        // Connect to database
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Sync the Role model to ensure table exists
        await Role.sync();
        console.log('Role table synchronized.');

        // Define the roles needed for the importation system
        const rolesToCreate = [
            { RoleName: 'Agent' },
            { RoleName: 'Import/Export' },
            { RoleName: 'Head Pharmacy' },
            { RoleName: 'Inspector' },
            { RoleName: 'Admin' },
            { RoleName: 'Donor' },
            { RoleName: 'Recipient' },
            { RoleName: 'Quality Study Committee' },
            { RoleName: 'Pricing Committee' }
        ];

        // Create roles if they don't exist
        for (const roleData of rolesToCreate) {
            const [role, created] = await Role.findOrCreate({
                where: { RoleName: roleData.RoleName },
                defaults: roleData
            });

            if (created) {
                console.log(`✅ Created role: ${role.RoleName} (ID: ${role.RoleId})`);
            } else {
                console.log(`ℹ️  Role already exists: ${role.RoleName} (ID: ${role.RoleId})`);
            }
        }

        console.log('\n🎉 Role initialization completed successfully!');
        
        // Display all roles
        const allRoles = await Role.findAll();
        console.log('\n📋 Current roles in database:');
        allRoles.forEach(role => {
            console.log(`   - ${role.RoleName} (ID: ${role.RoleId})`);
        });

    } catch (error) {
        console.error('❌ Error initializing roles:', error);
    } finally {
        await sequelize.close();
        console.log('\n🔐 Database connection closed.');
    }
}

// Run the initialization
if (require.main === module) {
    initializeRoles();
}

module.exports = { initializeRoles };
