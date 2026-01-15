const bcrypt = require('bcryptjs');
const sequelize = require('./config/databasePharmacy');

async function verifyPassword() {
  try {
    const password = 'Ommal1234';
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✓ Database connected\n');
    
    // Get users 268 and 269
    const [users] = await sequelize.query(
      `SELECT UserId, Username, Email, PasswordHash, RoleId, IsActive FROM useraccounts WHERE UserId IN (268, 269)`
    );
    
    if (users.length === 0) {
      console.log('✗ No users found with IDs 268 or 269\n');
      return;
    }
    
    console.log(`Found ${users.length} user(s):\n`);
    
    for (const user of users) {
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`UserId: ${user.UserId}`);
      console.log(`Username: ${user.Username}`);
      console.log(`Email: ${user.Email}`);
      console.log(`RoleId: ${user.RoleId}`);
      console.log(`IsActive: ${user.IsActive}`);
      console.log(`Current Hash: ${user.PasswordHash}`);
      
      // Test if password matches
      const isMatch = await bcrypt.compare(password, user.PasswordHash);
      console.log(`Password "Ommal1234" matches: ${isMatch ? '✓ YES' : '✗ NO'}`);
      
      // Test the exact login flow
      console.log('\nTesting login with:');
      console.log(`  - Username: "${user.Username}"`);
      const loginTestUsername = await bcrypt.compare(password, user.PasswordHash);
      console.log(`    Result: ${loginTestUsername ? '✓ Should work' : '✗ Will fail'}`);
      
      console.log(`  - Email: "${user.Email}"`);
      const loginTestEmail = await bcrypt.compare(password, user.PasswordHash);
      console.log(`    Result: ${loginTestEmail ? '✓ Should work' : '✗ Will fail'}`);
      console.log();
    }
    
    // Also generate a fresh hash for comparison
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Fresh hash of "Ommal1234":');
    const newHash = await bcrypt.hash(password, 10);
    console.log(newHash);
    console.log();
    
    const testMatch = await bcrypt.compare(password, newHash);
    console.log(`Test verification: ${testMatch ? '✓ Works' : '✗ Failed'}`);
    
  } catch (error) {
    console.error('✗ Error:', error.message);
  } finally {
    await sequelize.close();
    console.log('\n✓ Database connection closed');
  }
}

verifyPassword();
