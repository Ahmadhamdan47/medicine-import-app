// Quick API Test Runner for Importation Module
// This script tests the most important endpoints with minimal setup

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Simple configuration - edit these values
const CONFIG = {
    BASE_URL: 'http://localhost:3000',
    
    // Use existing users from your database
    // Replace with actual usernames/passwords that exist
    TEST_USER: {
        username: 'admin', // Replace with existing username
        password: 'admin123' // Replace with actual password
    }
};

let authToken = null;
let testRequestId = null;

// Utility functions
function log(message, type = 'INFO') {
    const colors = {
        INFO: '\x1b[36m',
        SUCCESS: '\x1b[32m',
        ERROR: '\x1b[31m',
        WARNING: '\x1b[33m',
        RESET: '\x1b[0m'
    };
    console.log(`${colors[type]}[${type}] ${message}${colors.RESET}`);
}

async function makeRequest(method, endpoint, data = null, isFormData = false) {
    try {
        const config = {
            method,
            url: `${CONFIG.BASE_URL}${endpoint}`,
            headers: {}
        };
        
        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        if (data) {
            if (isFormData) {
                config.data = data;
                Object.assign(config.headers, data.getHeaders());
            } else {
                config.data = data;
                config.headers['Content-Type'] = 'application/json';
            }
        }
        
        const response = await axios(config);
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || error.message,
            status: error.response?.status || 500
        };
    }
}

function createTestFile() {
    const content = Buffer.from('Test file content for API testing');
    const filePath = path.join(__dirname, 'test-file.txt');
    fs.writeFileSync(filePath, content);
    return filePath;
}

// Test functions
async function testLogin() {
    log('Testing authentication...', 'INFO');
    
    const result = await makeRequest('POST', '/users/login', {
        username: CONFIG.TEST_USER.username,
        password: CONFIG.TEST_USER.password
    });
    
    if (result.success && result.data.token) {
        authToken = result.data.token;
        log('✅ Authentication successful', 'SUCCESS');
        return true;
    } else {
        log(`❌ Authentication failed: ${result.error}`, 'ERROR');
        return false;
    }
}

async function testImportationRequests() {
    log('Testing importation requests...', 'INFO');
    
    // Create request
    const createResult = await makeRequest('POST', '/importation-requests', {
        drugName: 'Test API Drug',
        brandName: 'Test API Brand',
        quantityRequested: 100,
        urgencyLevel: 'medium',
        description: 'API test drug'
    });
    
    if (createResult.success) {
        testRequestId = createResult.data.data.id;
        log('✅ Created importation request', 'SUCCESS');
        
        // Get all requests
        const getAllResult = await makeRequest('GET', '/importation-requests');
        if (getAllResult.success) {
            log('✅ Retrieved importation requests', 'SUCCESS');
        } else {
            log('❌ Failed to get importation requests', 'ERROR');
        }
        
        // Update request
        const updateResult = await makeRequest('PUT', `/importation-requests/${testRequestId}`, {
            quantityRequested: 200
        });
        if (updateResult.success) {
            log('✅ Updated importation request', 'SUCCESS');
        } else {
            log('❌ Failed to update importation request', 'ERROR');
        }
        
        return true;
    } else {
        log(`❌ Failed to create importation request: ${createResult.error}`, 'ERROR');
        return false;
    }
}

async function testFileUpload() {
    log('Testing file upload...', 'INFO');
    
    if (!testRequestId) {
        log('⚠️ Skipping file upload - no request ID', 'WARNING');
        return false;
    }
    
    const testFilePath = createTestFile();
    
    try {
        // Test RFD upload
        const formData = new FormData();
        formData.append('importationRequestId', testRequestId);
        formData.append('file', fs.createReadStream(testFilePath));
        
        const uploadResult = await makeRequest('POST', '/rfd-requests', formData, true);
        
        if (uploadResult.success) {
            log('✅ File upload successful', 'SUCCESS');
            return true;
        } else {
            log(`❌ File upload failed: ${uploadResult.error}`, 'ERROR');
            return false;
        }
    } finally {
        // Cleanup
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    }
}

async function testAnnouncements() {
    log('Testing announcements...', 'INFO');
    
    // Create announcement
    const createResult = await makeRequest('POST', '/importation-announcements', {
        title: 'API Test Announcement',
        content: 'This is a test announcement from the API test suite.',
        type: 'general',
        priority: 'medium'
    });
    
    if (createResult.success) {
        log('✅ Created announcement', 'SUCCESS');
        
        // Get announcements
        const getResult = await makeRequest('GET', '/importation-announcements');
        if (getResult.success) {
            log('✅ Retrieved announcements', 'SUCCESS');
        } else {
            log('❌ Failed to get announcements', 'ERROR');
        }
        
        return true;
    } else {
        log(`❌ Failed to create announcement: ${createResult.error}`, 'ERROR');
        return false;
    }
}

async function testUserProfile() {
    log('Testing user profile...', 'INFO');
    
    const result = await makeRequest('GET', '/users/profile');
    
    if (result.success) {
        log('✅ Retrieved user profile', 'SUCCESS');
        return true;
    } else {
        log(`❌ Failed to get user profile: ${result.error}`, 'ERROR');
        return false;
    }
}

async function testHealthCheck() {
    log('Testing system health...', 'INFO');
    
    const result = await makeRequest('GET', '/health');
    
    if (result.success) {
        log('✅ Health check passed', 'SUCCESS');
        return true;
    } else {
        log(`❌ Health check failed: ${result.error}`, 'ERROR');
        return false;
    }
}

// Main test runner
async function runQuickTests() {
    log('🚀 Starting Quick API Tests for Importation Module', 'INFO');
    log(`Server: ${CONFIG.BASE_URL}`, 'INFO');
    log('=' .repeat(50), 'INFO');
    
    const results = {
        total: 0,
        passed: 0,
        failed: 0
    };
    
    // Track results
    function recordResult(success, testName) {
        results.total++;
        if (success) {
            results.passed++;
        } else {
            results.failed++;
            log(`Test failed: ${testName}`, 'ERROR');
        }
    }
    
    try {
        // Test authentication first
        const authSuccess = await testLogin();
        recordResult(authSuccess, 'Authentication');
        
        if (!authSuccess) {
            log('❌ Cannot continue without authentication', 'ERROR');
            return;
        }
        
        // Run core tests
        recordResult(await testHealthCheck(), 'Health Check');
        recordResult(await testUserProfile(), 'User Profile');
        recordResult(await testImportationRequests(), 'Importation Requests');
        recordResult(await testFileUpload(), 'File Upload');
        recordResult(await testAnnouncements(), 'Announcements');
        
        // Additional endpoint tests
        log('Testing additional endpoints...', 'INFO');
        
        // Test getting various resources
        const endpoints = [
            '/importation-requests',
            '/rfd-requests',
            '/proforma-requests', 
            '/swift-payments',
            '/importation-announcements'
        ];
        
        for (const endpoint of endpoints) {
            const result = await makeRequest('GET', endpoint);
            recordResult(result.success, `GET ${endpoint}`);
        }
        
    } catch (error) {
        log(`Unexpected error: ${error.message}`, 'ERROR');
        results.failed++;
    }
    
    // Print summary
    log('=' .repeat(50), 'INFO');
    log('📊 TEST SUMMARY', 'INFO');
    log(`Total: ${results.total}`, 'INFO');
    log(`Passed: ${results.passed}`, 'SUCCESS');
    log(`Failed: ${results.failed}`, results.failed > 0 ? 'ERROR' : 'SUCCESS');
    
    const successRate = ((results.passed / results.total) * 100).toFixed(1);
    log(`Success Rate: ${successRate}%`, successRate >= 80 ? 'SUCCESS' : 'WARNING');
    
    if (results.failed === 0) {
        log('🎉 All tests passed!', 'SUCCESS');
    } else {
        log(`⚠️ ${results.failed} test(s) failed`, 'WARNING');
        log('Check server logs and ensure endpoints are implemented', 'INFO');
    }
}

// Error handling
process.on('unhandledRejection', (error) => {
    log(`Unhandled error: ${error.message}`, 'ERROR');
    process.exit(1);
});

// Run tests
if (require.main === module) {
    runQuickTests().then(() => {
        log('Tests completed', 'INFO');
        process.exit(0);
    }).catch((error) => {
        log(`Test runner error: ${error.message}`, 'ERROR');
        process.exit(1);
    });
}

module.exports = { runQuickTests, CONFIG };
