// Test script for Bank Donation API
const axios = require('axios');

const BASE_URL = 'http://localhost:8066';

async function testBankDonationAPI() {
    console.log('🧪 Testing Bank Donation API...\n');

    try {
        // Test 1: Create a new bank donation (Personal)
        console.log('1️⃣ Testing: Create Personal Bank Donation');
        const personalDonation = {
            donor_type: 'personal',
            account_holder: 'Ahmad Hamdan',
            mobile_number: '+961-70-123456',
            email_address: 'ahmadhamdan47@gmail.com',
            amount: 150.50,
            currency: 'USD',
            notes: 'Test personal donation for medicine import'
        };

        const personalResponse = await axios.post(`${BASE_URL}/api/bank-donations`, personalDonation);
        console.log('✅ Personal donation created:', personalResponse.data);
        const personalDonationId = personalResponse.data.data.id;

        // Test 2: Create a new bank donation (Entity)
        console.log('\n2️⃣ Testing: Create Entity Bank Donation');
        const entityDonation = {
            donor_type: 'entity',
            account_holder: 'Tech Solutions LLC',
            contact_person: 'Nizar Akleh',
            mobile_number: '+961-71-987654',
            email_address: 'nizarakleh@gmail.com',
            amount: 1000.00,
            currency: 'USD',
            notes: 'Corporate donation for medical supplies'
        };

        const entityResponse = await axios.post(`${BASE_URL}/api/bank-donations`, entityDonation);
        console.log('✅ Entity donation created:', entityResponse.data);
        const entityDonationId = entityResponse.data.data.id;

        // Test 3: Get all donations
        console.log('\n3️⃣ Testing: Get All Bank Donations');
        const allDonationsResponse = await axios.get(`${BASE_URL}/api/bank-donations`);
        console.log('✅ All donations retrieved:', allDonationsResponse.data);

        // Test 4: Get donation by ID
        console.log('\n4️⃣ Testing: Get Donation by ID');
        const donationByIdResponse = await axios.get(`${BASE_URL}/api/bank-donations/${personalDonationId}`);
        console.log('✅ Donation by ID retrieved:', donationByIdResponse.data);

        // Test 5: Update donation status
        console.log('\n5️⃣ Testing: Update Donation Status');
        const statusUpdate = {
            status: 'confirmed',
            bank_reference_number: 'BNK-2025-001'
        };
        const statusUpdateResponse = await axios.put(`${BASE_URL}/api/bank-donations/${personalDonationId}/status`, statusUpdate);
        console.log('✅ Donation status updated:', statusUpdateResponse.data);

        // Test 6: Get donation statistics
        console.log('\n6️⃣ Testing: Get Donation Statistics');
        const statisticsResponse = await axios.get(`${BASE_URL}/api/bank-donations/statistics`);
        console.log('✅ Donation statistics:', statisticsResponse.data);

        // Test 7: Search donations
        console.log('\n7️⃣ Testing: Search Donations');
        const searchResponse = await axios.get(`${BASE_URL}/api/bank-donations/search?q=Ahmad`);
        console.log('✅ Search results:', searchResponse.data);

        // Test 8: Get donations with filters
        console.log('\n8️⃣ Testing: Get Donations with Filters');
        const filteredResponse = await axios.get(`${BASE_URL}/api/bank-donations?donor_type=personal&status=confirmed`);
        console.log('✅ Filtered donations:', filteredResponse.data);

        // Test 9: Resend bank notification
        console.log('\n9️⃣ Testing: Resend Bank Notification');
        const resendResponse = await axios.post(`${BASE_URL}/api/bank-donations/${entityDonationId}/resend-notification`);
        console.log('✅ Bank notification resent:', resendResponse.data);

        console.log('\n🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.response ? error.response.data : error.message);
    }
}

// Test validation errors
async function testValidationErrors() {
    console.log('\n🧪 Testing Validation Errors...\n');

    try {
        // Test invalid donor type
        console.log('1️⃣ Testing: Invalid Donor Type');
        const invalidDonation = {
            donor_type: 'invalid_type',
            account_holder: 'Test User',
            mobile_number: '+961-70-123456',
            email_address: 'test@example.com',
            amount: 100.00
        };

        await axios.post(`${BASE_URL}/api/bank-donations`, invalidDonation);
    } catch (error) {
        console.log('✅ Validation error caught correctly:', error.response.data);
    }

    try {
        // Test invalid email
        console.log('\n2️⃣ Testing: Invalid Email');
        const invalidEmailDonation = {
            donor_type: 'personal',
            account_holder: 'Test User',
            mobile_number: '+961-70-123456',
            email_address: 'invalid-email',
            amount: 100.00
        };

        await axios.post(`${BASE_URL}/api/bank-donations`, invalidEmailDonation);
    } catch (error) {
        console.log('✅ Email validation error caught correctly:', error.response.data);
    }

    try {
        // Test negative amount
        console.log('\n3️⃣ Testing: Negative Amount');
        const negativeAmountDonation = {
            donor_type: 'personal',
            account_holder: 'Test User',
            mobile_number: '+961-70-123456',
            email_address: 'test@example.com',
            amount: -50.00
        };

        await axios.post(`${BASE_URL}/api/bank-donations`, negativeAmountDonation);
    } catch (error) {
        console.log('✅ Amount validation error caught correctly:', error.response.data);
    }
}

// Run tests
async function runAllTests() {
    console.log('🚀 Starting Bank Donation API Tests\n');
    console.log('Make sure your server is running on http://localhost:8066\n');
    
    await testBankDonationAPI();
    await testValidationErrors();
    
    console.log('\n🏁 All tests completed!');
}

// Run the tests
runAllTests();
