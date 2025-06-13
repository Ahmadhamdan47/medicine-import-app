// Script to add missing roles for importation system
const sequelize = require('../config/databasePharmacy');
const Roles = require('../src/models/roles');

async function addImportationRoles() {
    try {
        // Connect to database
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Check existing roles
        const existingRoles = await Roles.findAll();
        console.log('Existing roles:');
        existingRoles.forEach(role => {
            console.log(`- RoleId: ${role.RoleId}, RoleName: ${role.RoleName}`);
        });

        // Roles needed for importation system
        const requiredRoles = [
            'Import/Export',    // For import/export staff
            'Head Pharmacy',    // For head of pharmacy
            'Inspector'         // For inspectors
        ];

        // Add missing roles
        for (const roleName of requiredRoles) {
            const existingRole = await Roles.findOne({ 
                where: { RoleName: roleName } 
            });

            if (!existingRole) {
                // Use explicit RoleId to avoid auto-increment issues
                const maxRole = await Roles.findOne({
                    order: [['RoleId', 'DESC']]
                });
                const nextRoleId = maxRole ? maxRole.RoleId + 1 : 4;

                await Roles.create({
                    RoleId: nextRoleId,
                    RoleName: roleName
                });
                console.log(`✅ Created role: ${roleName} with RoleId: ${nextRoleId}`);
            } else {
                console.log(`✅ Role already exists: ${roleName}`);
            }
        }

        // Display final roles
        console.log('\n=== Final Roles in Database ===');
        const finalRoles = await Roles.findAll({ order: [['RoleId', 'ASC']] });
        finalRoles.forEach(role => {
            console.log(`RoleId: ${role.RoleId} | RoleName: ${role.RoleName}`);
        });

        console.log('\n🎉 Importation roles setup completed successfully!');
        
    } catch (error) {
        console.error('❌ Error setting up roles:', error);
    } finally {
        await sequelize.close();
    }
}

// Run the script
addImportationRoles();
