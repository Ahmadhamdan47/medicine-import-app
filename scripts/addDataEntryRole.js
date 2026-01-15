// Script to add data-entry role to the database
const sequelize = require('../config/databasePharmacy');
const Role = require('../src/models/roles');

async function addDataEntryRole() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check if data-entry role already exists
    const existingRole = await Role.findOne({
      where: { RoleName: 'data-entry' }
    });

    if (existingRole) {
      console.log('✓ data-entry role already exists with RoleId:', existingRole.RoleId);
      return;
    }

    // Create the data-entry role
    const newRole = await Role.create({
      RoleName: 'data-entry'
    });

    console.log('✓ Successfully created data-entry role with RoleId:', newRole.RoleId);
    console.log('\nYou can now assign this role to users who need approval for drug edits.');
    
  } catch (error) {
    console.error('✗ Error adding data-entry role:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the script
addDataEntryRole()
  .then(() => {
    console.log('\n✓ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Script failed:', error);
    process.exit(1);
  });
