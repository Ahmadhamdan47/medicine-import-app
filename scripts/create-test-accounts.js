const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

const createTestAccounts = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    const password = 'password123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const testAccounts = [
      {
        username: 'quality_committee_test',
        email: 'quality.test@company.com',
        password: hashedPassword,
        role: 'quality_committee',
        firstName: 'Quality',
        lastName: 'Committee Test'
      },
      {
        username: 'pricing_committee_test',
        email: 'pricing.test@company.com',
        password: hashedPassword,
        role: 'pricing_committee',
        firstName: 'Pricing',
        lastName: 'Committee Test'
      }
    ];

    for (const account of testAccounts) {
      // Check if user already exists
      const existingUser = await User.findOne({ username: account.username });
      
      if (existingUser) {
        console.log(`User ${account.username} already exists, skipping...`);
        continue;
      }

      // Create new user
      const user = new User(account);
      await user.save();
      console.log(`Created test account: ${account.username}`);
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
