const sequelize = require('../config/database');
const BankDonation = require('../src/models/bankDonation');

async function createBankDonationTable() {
    try {
        console.log('Creating bank_donations table...');
        
        // Sync the model to create the table
        await BankDonation.sync({ force: false }); // Use force: true to recreate table if needed
        
        console.log('✅ Bank donations table created successfully!');
        
        // Optional: Insert sample data
        const sampleData = [
            {
                donor_type: 'personal',
                account_holder: 'John Doe',
                mobile_number: '+961-70-123456',
                email_address: 'john.doe@example.com',
                amount: 100.00,
                currency: 'USD',
                notes: 'Sample personal donation'
            },
            {
                donor_type: 'entity',
                account_holder: 'ABC Company Ltd',
                contact_person: 'Jane Smith',
                mobile_number: '+961-71-789012',
                email_address: 'jane.smith@abccompany.com',
                amount: 500.00,
                currency: 'USD',
                notes: 'Corporate donation for medical supplies'
            }
        ];

        console.log('Inserting sample data...');
        await BankDonation.bulkCreate(sampleData, { ignoreDuplicates: true });
        console.log('✅ Sample data inserted successfully!');
        
    } catch (error) {
        console.error('❌ Error creating bank donations table:', error);
    } finally {
        await sequelize.close();
    }
}

// Run the script
createBankDonationTable();
