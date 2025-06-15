// Script to add new roles for quality study committee and pricing committee
const sequelize = require('../config/databasePharmacy');
const Roles = require('../src/models/roles');

async function addNewRoles() {
    try {
        // Connect to database
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Check existing roles
        const existingRoles = await Roles.findAll({ order: [['RoleId', 'ASC']] });
        console.log('Current roles:');
        existingRoles.forEach(role => {
            console.log(`- RoleId: ${role.RoleId}, RoleName: ${role.RoleName}`);
        });

        // New roles to add
        const newRoles = [
            'Quality Study Committee',
            'Pricing Committee'
        ];

        // Add new roles
        for (const roleName of newRoles) {
            const existingRole = await Roles.findOne({ 
                where: { RoleName: roleName } 
            });

            if (!existingRole) {
                // Get next available RoleId
                const maxRole = await Roles.findOne({
                    order: [['RoleId', 'DESC']]
                });
                const nextRoleId = maxRole ? maxRole.RoleId + 1 : 8;

                await Roles.create({
                    RoleId: nextRoleId,
                    RoleName: roleName
                });
                console.log(`✅ Created role: ${roleName} with RoleId: ${nextRoleId}`);
            } else {
                console.log(`✅ Role already exists: ${roleName} (ID: ${existingRole.RoleId})`);
            }
        }

        // Display final roles
        console.log('\n=== Final Roles in Database ===');
        const finalRoles = await Roles.findAll({ order: [['RoleId', 'ASC']] });
        finalRoles.forEach(role => {
            console.log(`RoleId: ${role.RoleId} | RoleName: ${role.RoleName}`);
        });

        console.log('\n🎉 New roles added successfully!');
        
    } catch (error) {
        console.error('❌ Error adding new roles:', error);
    } finally {
        await sequelize.close();
    }
}

// Run the script
addNewRoles();
