// Simple API Test Configuration
// Edit these values to match your setup

module.exports = {
    // Server configuration
    BASE_URL: 'http://localhost:3000',
    
    // Test timeout in milliseconds
    TIMEOUT: 30000,
    
    // Test users (these should exist in your database)
    // If you don't have these users, create them first or modify to use existing users
    USERS: {
        agent: {
            username: 'agent_test',
            password: 'password123'
        },
        importExport: {
            username: 'import_export_test', 
            password: 'password123'
        },
        headPharmacy: {
            username: 'head_pharmacy_test',
            password: 'password123'
        },
        inspector: {
            username: 'inspector_test',
            password: 'password123'
        },
        admin: {
            username: 'admin_test',
            password: 'password123'
        }
    },
    
    // Test data
    TEST_DRUG: {
        drugName: 'Test Paracetamol API',
        brandName: 'Test Brand API',
        quantityRequested: 1000,
        unitPrice: 2.50,
        urgencyLevel: 'medium',
        description: 'API Test medication',
        indication: 'Testing purposes',
        dosageForm: 'tablet',
        strength: '500mg',
        packSize: 20,
        countryOfOrigin: 'Test Country',
        requestedDeliveryDate: '2025-07-15',
        notes: 'API Testing notes'
    },
    
    // Test announcement
    TEST_ANNOUNCEMENT: {
        title: 'API Test Announcement',
        content: 'This is a test announcement created by the API test suite.',
        type: 'general',
        priority: 'medium',
        targetRole: 'all'
    },
    
    // Test file settings
    TEST_FILE_SIZE: 1024, // bytes
    
    // Which tests to run (set to false to skip)
    RUN_TESTS: {
        authentication: true,
        importationRequests: true,
        rfdRequests: true,
        proformaRequests: true,
        swiftPayments: true,
        announcements: true,
        fileStorage: true,
        userManagement: true,
        systemEndpoints: true,
        permissions: true,
        cleanup: true
    },
    
    // Logging configuration
    LOG_LEVEL: 'INFO', // INFO, DEBUG, ERROR
    DETAILED_ERRORS: true
};
