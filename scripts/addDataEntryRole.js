// Script to add data-entry role to the database
// Node 14 compatible version using mysql2 directly
const mysql = require('mysql2/promise');

async function addDataEntryRole() {
  let connection;
  
  try {
    // Create connection using the same config as your app
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'ommal_ahmad',
      password: process.env.DB_PASSWORD || 'fISfGr^8q!_gUPMY',
      database: process.env.DB_NAME || 'ommal_medapiv2'
    });

    console.log('Database connection established successfully.');

    // Check if data-entry role already exists
    const [existingRole] = await connection.execute(
      'SELECT RoleId, RoleName FROM roles WHERE RoleName = ?',
      ['data-entry']
    );

    if (existingRole.length > 0) {
      console.log('✓ data-entry role already exists with RoleId:', existingRole[0].RoleId);
      return;
    }

    // Get the next available RoleId
    const [maxRole] = await connection.execute(
      'SELECT MAX(RoleId) as maxId FROM roles'
    );
    const nextRoleId = (maxRole[0].maxId || 0) + 1;

    // Create the data-entry role
    const [result] = await connection.execute(
      'INSERT INTO roles (RoleId, RoleName) VALUES (?, ?)',
      [nextRoleId, 'data-entry']
    );

    console.log('✓ Successfully created data-entry role with RoleId:', nextRoleId);
    console.log('\nYou can now assign this role to users who need approval for drug edits.');
    
  } catch (error) {
    console.error('✗ Error adding data-entry role:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
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
