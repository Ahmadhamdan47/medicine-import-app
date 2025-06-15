const bcrypt = require('bcryptjs');
const UserAccounts = require('../src/models/userAccounts');
const Role = require('../src/models/roles');
const sequelize = require('../config/databasePharmacy');

const createTestAccounts = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database');

    const password = 'password123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Find or create roles (assuming they exist)
    const qualityRole = await Role.findOne({ where: { RoleName: 'quality_committee' } });
    const pricingRole = await Role.findOne({ where: { RoleName: 'pricing_committee' } });

    const testAccounts = [
      {
        Username: 'quality_committee_test',
        Email: 'quality.test@company.com',
        PasswordHash: hashedPassword,
        RoleId: qualityRole ? qualityRole.RoleId : null,
        IsActive: true
      },
      {
        Username: 'pricing_committee_test',
        Email: 'pricing.test@company.com',
        PasswordHash: hashedPassword,
        RoleId: pricingRole ? pricingRole.RoleId : null,
        IsActive: true
      }
    ];

    for (const account of testAccounts) {
      // Check if user already exists
      const existingUser = await UserAccounts.findOne({ 
        where: { Username: account.Username } 
      });
      
      if (existingUser) {
        console.log(`User ${account.Username} already exists, skipping...`);
        continue;
      }

      // Create new user
      const user = await UserAccounts.create(account);
      console.log(`Created test account: ${account.Username} with ID: ${user.UserId}`);
    }

    console.log('Test accounts creation completed');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test accounts:', error);
    process.exit(1);
  }
};

// Run the script
createTestAccounts();
