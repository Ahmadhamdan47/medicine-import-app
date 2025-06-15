const bcrypt = require('bcryptjs');
const UserAccounts = require('../src/models/userAccounts');
const Role = require('../src/models/roles');
const sequelize = require('../config/databasePharmacy');

const createPharmacyServiceAccount = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database');

    const password = 'password123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Find or create pharmacy_service role
    let pharmacyRole = await Role.findOne({ where: { RoleName: 'pharmacy_service' } });
    
    if (!pharmacyRole) {
      pharmacyRole = await Role.create({
        RoleName: 'pharmacy_service',
        Description: 'Pharmacy service operations role'
      });
      console.log('Created pharmacy_service role');
    }

    const testAccount = {
      Username: 'pharmacy_test_user',
      Email: 'pharmacy.test@company.com',
      PasswordHash: hashedPassword,
      RoleId: pharmacyRole.RoleId,
      IsActive: true
    };

    // Check if user already exists
    const existingUser = await UserAccounts.findOne({ 
      where: { Username: testAccount.Username } 
    });
    
    if (existingUser) {
      console.log(`User ${testAccount.Username} already exists, skipping...`);
    } else {
      // Create new user
      const user = await UserAccounts.create(testAccount);
      console.log(`Created test account: ${testAccount.Username} with ID: ${user.UserId}`);
    }

    console.log('Pharmacy service account creation completed');
    console.log('Username: pharmacy_test_user');
    console.log('Password: password123');
    console.log('Role: pharmacy_service');
    process.exit(0);
  } catch (error) {
    console.error('Error creating pharmacy service account:', error);
    process.exit(1);
  }
};

// Run the script
createPharmacyServiceAccount();
