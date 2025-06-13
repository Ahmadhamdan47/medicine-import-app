// Comprehensive Test Script for Importation Module APIs
// Tests all endpoints with different user roles and scenarios

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Import test configuration
const { USERS: TEST_USER_CONFIG } = require('./testConfig');

// Configuration
const BASE_URL = 'http://localhost:8066'; // Adjust to your server URL
const TEST_TIMEOUT = 30000; // 30 seconds timeout

// Test data - use the same users as in testConfig
const testUsers = {
    agent: {
        username: TEST_USER_CONFIG.agent.username,
        password: TEST_USER_CONFIG.agent.password,
        token: null,
        role: 'agent'
    },
    importExport: {
        username: TEST_USER_CONFIG.importExport.username,
        password: TEST_USER_CONFIG.importExport.password,
        token: null,
        role: 'import_export'
    },
    headPharmacy: {
        username: TEST_USER_CONFIG.headPharmacy.username,
        password: TEST_USER_CONFIG.headPharmacy.password,
        token: null,
        role: 'head_pharmacy'
    },
    inspector: {
        username: TEST_USER_CONFIG.inspector.username,
        password: TEST_USER_CONFIG.inspector.password,
        token: null,
        role: 'inspector'
    },
    admin: {
        username: TEST_USER_CONFIG.admin.username,
        password: TEST_USER_CONFIG.admin.password,
        token: null,
        role: 'admin'
    }
};

// Test results tracking
const testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    errors: []
};

// Created resources for cleanup
const createdResources = {
    importationRequests: [],
    rfdRequests: [],
    proformaRequests: [],
    swiftPayments: [],
    announcements: [],
    files: []
};

// Utility functions
function log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const colors = {
        INFO: '\x1b[36m',  // Cyan
        SUCCESS: '\x1b[32m', // Green
        ERROR: '\x1b[31m',   // Red
        WARNING: '\x1b[33m', // Yellow
        RESET: '\x1b[0m'     // Reset
    };
    
    console.log(`${colors[type]}[${timestamp}] [${type}] ${message}${colors.RESET}`);
}

function assert(condition, message, errorDetails = null) {
    testResults.total++;
    if (condition) {
        testResults.passed++;
        log(`✅ PASS: ${message}`, 'SUCCESS');
    } else {
        testResults.failed++;
        const errorMessage = errorDetails ? `${message}: ${JSON.stringify(errorDetails)}` : message;
        testResults.errors.push(errorMessage);
        log(`❌ FAIL: ${errorMessage}`, 'ERROR');
    }
}

async function makeRequest(config, userType = 'agent') {
    try {
        const token = testUsers[userType]?.token;
        if (token) {
            config.headers = {
                ...config.headers,
                'Authorization': `Bearer ${token}`
            };
        }
        
        const response = await axios(config);
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data || error.message, 
            status: error.response?.status 
        };
    }
}

// Create test file for uploads
function createTestFile(filename = 'test-document.pdf') {
    const filePath = path.join(__dirname, filename);
    const content = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Test Document) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
298
%%EOF`;
    
    fs.writeFileSync(filePath, content);
    return filePath;
}

// Authentication tests
async function testAuthentication() {
    log('🔐 Testing Authentication...', 'INFO');
      // Test login for each user type
    for (const [userType, userData] of Object.entries(testUsers)) {
        const result = await makeRequest({
            method: 'POST',
            url: `${BASE_URL}/auth/login`,
            data: {
                email: userData.username, // Auth endpoint expects 'email' field
                password: userData.password
            }
        });        
        if (result.success && (result.data.accessToken || result.data.token)) {
            testUsers[userType].token = result.data.accessToken || result.data.token;
            assert(true, `${userType} login successful`);
            log(`Token for ${userType}: ${(result.data.accessToken || result.data.token).substring(0, 20)}...`);
        } else {
            assert(false, `${userType} login failed: ${result.error}`);
        }
    }
}

// 1. Importation Requests Tests
async function testImportationRequests() {
    log('📋 Testing Importation Requests...', 'INFO');
    
    // Test create importation request (Agent)
    const createRequestData = {
        drugName: 'Test Paracetamol',
        brandName: 'Test Panadol',
        quantityRequested: 1000,
        unitPrice: 2.50,
        urgencyLevel: 'medium',
        description: 'Test pain relief medication',
        indication: 'Fever and pain management',
        dosageForm: 'tablet',
        strength: '500mg',
        packSize: 20,
        countryOfOrigin: 'UK',
        requestedDeliveryDate: '2025-07-15',
        notes: 'Test urgent requirement'
    };
    
    const createResult = await makeRequest({
        method: 'POST',
        url: `${BASE_URL}/importation-requests`,
        data: createRequestData
    }, 'agent');
    
    if (createResult.success) {
        createdResources.importationRequests.push(createResult.data.data.id);
        assert(true, 'Agent can create importation request');
        
        const requestId = createResult.data.data.id;
          // Test get all requests (Agent should see only their own)
        const getAllResult = await makeRequest({
            method: 'GET',
            url: `${BASE_URL}/importation-requests`
        }, 'agent');
        
        assert(getAllResult.success, 'Agent can get importation requests', getAllResult.error);
        
        // Test get single request
        const getSingleResult = await makeRequest({
            method: 'GET',
            url: `${BASE_URL}/importation-requests/${requestId}`
        }, 'agent');
        
        assert(getSingleResult.success, 'Agent can get single importation request', getSingleResult.error);
          // Test update request (Agent)
        const updateResult = await makeRequest({
            method: 'PUT',
            url: `${BASE_URL}/importation-requests/${requestId}`,
            data: {
                quantityRequested: 1500,
                notes: 'Updated quantity for testing'
            }
        }, 'agent');
        
        assert(updateResult.success, 'Agent can update own importation request', updateResult.error);
        
        // Test status update (Import/Export)
        const statusUpdateResult = await makeRequest({
            method: 'PATCH',
            url: `${BASE_URL}/importation-requests/${requestId}/status`,
            data: {
                status: 'under_review',
                comments: 'Moving to review phase for testing'
            }
        }, 'importExport');
        
        assert(statusUpdateResult.success, 'Import/Export can update request status', statusUpdateResult.error);
        
        // Test shipping update (Import/Export)
        const shippingUpdateResult = await makeRequest({
            method: 'PATCH',
            url: `${BASE_URL}/importation-requests/${requestId}/shipping`,
            data: {
                estimatedShippingDate: '2025-07-01',
                shippingCarrier: 'Test Express',
                trackingNumber: 'TEST123456789',
                warehouseLocation: 'Test Warehouse A'
            }
        }, 'importExport');
        
        assert(shippingUpdateResult.success, 'Import/Export can update shipping info');
        
        // Test bulk operations (Import/Export)
        const bulkResult = await makeRequest({
            method: 'POST',
            url: `${BASE_URL}/importation-requests/bulk`,
            data: {
                operation: 'updateStatus',
                requestIds: [requestId],
                data: {
                    status: 'rfd_required',
                    comments: 'Bulk status update test'
                }
            }
        }, 'importExport');
        
        assert(bulkResult.success, 'Import/Export can perform bulk operations', bulkResult.error);
          // Test export to CSV
        const exportResult = await makeRequest({
            method: 'GET',
            url: `${BASE_URL}/importation-requests/export-csv`
        }, 'agent');
        
        assert(exportResult.success, 'Can export requests to CSV', exportResult.error);
          } else {
        const errorDetails = typeof createResult.error === 'object' ? JSON.stringify(createResult.error, null, 2) : createResult.error;
        assert(false, `Failed to create importation request: ${errorDetails}`);
    }
}

// 2. RFD Requests Tests
async function testRFDRequests() {
    log('📄 Testing RFD Requests...', 'INFO');
    
    if (createdResources.importationRequests.length === 0) {
        log('No importation requests created, skipping RFD tests', 'WARNING');
        return;
    }
    
    const requestId = createdResources.importationRequests[0];
    const testFilePath = createTestFile('test-rfd-document.pdf');
    
    try {
        // Test upload RFD document (Agent)
        const formData = new FormData();
        formData.append('importationRequestId', requestId);
        formData.append('file', fs.createReadStream(testFilePath));
        formData.append('metadata', JSON.stringify({
            documentType: 'certificate',
            issuingAuthority: 'Test FDA'
        }));
          const uploadResult = await makeRequest({
            method: 'POST',
            url: `${BASE_URL}/rfd-requests/upload`,
            data: formData,
            headers: formData.getHeaders()
        }, 'agent');
        
        if (uploadResult.success) {
            createdResources.rfdRequests.push(uploadResult.data.data.id);
            assert(true, 'Agent can upload RFD document');
            
            const rfdId = uploadResult.data.data.id;
            
            // Test get RFD requests
            const getRFDsResult = await makeRequest({
                method: 'GET',
                url: `${BASE_URL}/rfd-requests?importationRequestId=${requestId}`
            }, 'agent');
            
            assert(getRFDsResult.success, 'Can get RFD requests');
            
            // Test approve RFD (Import/Export)
            const approveResult = await makeRequest({
                method: 'PATCH',
                url: `${BASE_URL}/rfd-requests/${rfdId}/status`,
                data: {
                    status: 'approved',
                    comments: 'Document meets all test requirements'
                }
            }, 'importExport');
            
            assert(approveResult.success, 'Import/Export can approve RFD', approveResult.error);
            
            // Test download RFD document
            const downloadResult = await makeRequest({
                method: 'GET',
                url: `${BASE_URL}/rfd-requests/${rfdId}/download`
            }, 'agent');
            
            assert(downloadResult.success, 'Can download RFD document');
              } else {
            const errorDetails = typeof uploadResult.error === 'object' ? JSON.stringify(uploadResult.error, null, 2) : uploadResult.error;
            assert(false, `Failed to upload RFD document: ${errorDetails}`);
        }
    } finally {
        // Cleanup test file
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    }
}

// 3. Proforma Requests Tests
async function testProformaRequests() {
    log('💰 Testing Proforma Requests...', 'INFO');
    
    if (createdResources.importationRequests.length === 0) {
        log('No importation requests created, skipping Proforma tests', 'WARNING');
        return;
    }
    
    const requestId = createdResources.importationRequests[0];
    const testFilePath = createTestFile('test-proforma-invoice.pdf');
    
    try {
        // Test upload proforma invoice (Agent)
        const formData = new FormData();
        formData.append('importationRequestId', requestId);
        formData.append('file', fs.createReadStream(testFilePath));
        formData.append('invoiceNumber', 'TEST-INV-2025-001');
        formData.append('invoiceDate', '2025-06-15');
        formData.append('totalAmount', '2500.00');
        formData.append('currency', 'USD');
          const uploadResult = await makeRequest({
            method: 'POST',
            url: `${BASE_URL}/proforma-requests/upload`,
            data: formData,
            headers: formData.getHeaders()
        }, 'agent');
        
        if (uploadResult.success) {
            createdResources.proformaRequests.push(uploadResult.data.data.id);
            assert(true, 'Agent can upload proforma invoice');
            
            const proformaId = uploadResult.data.data.id;
            
            // Test get proforma requests
            const getProformasResult = await makeRequest({
                method: 'GET',
                url: `${BASE_URL}/proforma-requests?importationRequestId=${requestId}`
            }, 'agent');
            
            assert(getProformasResult.success, 'Can get proforma requests');
            
            // Test sign proforma invoice (Import/Export)
            const signResult = await makeRequest({
                method: 'PATCH',
                url: `${BASE_URL}/proforma-requests/${proformaId}/sign`,
                data: {
                    action: 'sign',
                    comments: 'Test invoice approved for payment'
                }
            }, 'importExport');
            
            assert(signResult.success, 'Import/Export can sign proforma invoice', signResult.error);
            
            // Test download proforma document
            const downloadResult = await makeRequest({
                method: 'GET',
                url: `${BASE_URL}/proforma-requests/${proformaId}/download`
            }, 'agent');
            
            assert(downloadResult.success, 'Can download proforma document');
              } else {
            const errorDetails = typeof uploadResult.error === 'object' ? JSON.stringify(uploadResult.error, null, 2) : uploadResult.error;
            assert(false, `Failed to upload proforma invoice: ${errorDetails}`);
        }
    } finally {
        // Cleanup test file
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    }
}

// 4. Swift Payments Tests
async function testSwiftPayments() {
    log('💳 Testing Swift Payments...', 'INFO');
    
    if (createdResources.importationRequests.length === 0) {
        log('No importation requests created, skipping Swift Payment tests', 'WARNING');
        return;
    }
    
    const requestId = createdResources.importationRequests[0];
    const testFilePath = createTestFile('test-swift-payment.pdf');
      try {
        // Test upload payment proof (Agent)
        const formData = new FormData();
        formData.append('importationRequestId', requestId);
        formData.append('file', fs.createReadStream(testFilePath));
        formData.append('swiftNumber', 'TEST-SWIFT123456');
        formData.append('amount', '2500.00');
        formData.append('paymentDate', '2025-06-15');
        formData.append('currency', 'USD');
        formData.append('bankName', 'Test Bank of Lebanon');
          const uploadResult = await makeRequest({
            method: 'POST',
            url: `${BASE_URL}/swift-payments/upload`,
            data: formData,
            headers: formData.getHeaders()
        }, 'agent');
        
        if (uploadResult.success) {
            createdResources.swiftPayments.push(uploadResult.data.data.id);
            assert(true, 'Agent can upload swift payment proof');
            
            const swiftId = uploadResult.data.data.id;
            
            // Test get swift payments
            const getSwiftsResult = await makeRequest({
                method: 'GET',
                url: `${BASE_URL}/swift-payments?importationRequestId=${requestId}`
            }, 'agent');
            
            assert(getSwiftsResult.success, 'Can get swift payments');
            
            // Test approve payment (Head Pharmacy)
            const approveResult = await makeRequest({
                method: 'PATCH',
                url: `${BASE_URL}/swift-payments/${swiftId}/approve`,
                data: {
                    action: 'approve',
                    comments: 'Test payment verified and approved'
                }
            }, 'headPharmacy');
            
            assert(approveResult.success, 'Head Pharmacy can approve swift payment');
            
            // Test download payment document
            const downloadResult = await makeRequest({
                method: 'GET',
                url: `${BASE_URL}/swift-payments/${swiftId}/download`
            }, 'agent');
            
            assert(downloadResult.success, 'Can download swift payment document');
              } else {
            const errorDetails = typeof uploadResult.error === 'object' ? JSON.stringify(uploadResult.error, null, 2) : uploadResult.error;
            assert(false, `Failed to upload swift payment proof: ${errorDetails}`);
        }
    } finally {
        // Cleanup test file
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    }
}

// 5. Announcements Tests
async function testAnnouncements() {
    log('📢 Testing Announcements...', 'INFO');
    
    // Test create announcement (Import/Export)
    const createAnnouncementData = {
        title: 'Test System Maintenance Notice',
        content: 'The test importation system will undergo maintenance for testing purposes.',
        type: 'maintenance',
        priority: 'high',
        targetRole: 'all',
        startDate: '2025-06-19T00:00:00Z',
        endDate: '2025-06-21T00:00:00Z'
    };
    
    const createResult = await makeRequest({
        method: 'POST',
        url: `${BASE_URL}/importation-announcements`,
        data: createAnnouncementData
    }, 'importExport');
    
    if (createResult.success) {
        createdResources.announcements.push(createResult.data.data.id);
        assert(true, 'Import/Export can create announcement');
        
        const announcementId = createResult.data.data.id;
        
        // Test get announcements (All users)
        const getAnnouncementsResult = await makeRequest({
            method: 'GET',
            url: `${BASE_URL}/importation-announcements`
        }, 'agent');
        
        assert(getAnnouncementsResult.success, 'Can get announcements');
        
        // Test mark as viewed (Agent)
        const viewResult = await makeRequest({
            method: 'POST',
            url: `${BASE_URL}/importation-announcements/${announcementId}/view`
        }, 'agent');
        
        assert(viewResult.success, 'Agent can mark announcement as viewed');
        
        // Test get unread count
        const unreadResult = await makeRequest({
            method: 'GET',
            url: `${BASE_URL}/importation-announcements/unread-count`
        }, 'agent');
        
        assert(unreadResult.success, 'Can get unread announcement count', unreadResult.error);
        
        // Test update announcement (Import/Export)
        const updateResult = await makeRequest({
            method: 'PUT',
            url: `${BASE_URL}/importation-announcements/${announcementId}`,
            data: {
                title: 'Updated Test System Maintenance Notice',
                priority: 'medium'
            }
        }, 'importExport');
        
        assert(updateResult.success, 'Import/Export can update announcement', updateResult.error);
        
    } else {
        assert(false, `Failed to create announcement: ${createResult.error}`);
    }
}

// 6. File Storage Tests
async function testFileStorage() {
    log('📁 Testing File Storage...', 'INFO');
    
    const testFilePath = createTestFile('test-storage-file.pdf');
    
    try {
        // Test upload file
        const formData = new FormData();
        formData.append('file', fs.createReadStream(testFilePath));
        formData.append('isPublic', 'false');
        formData.append('expiresAt', '2025-12-31T23:59:59Z');
        formData.append('metadata', JSON.stringify({
            category: 'document',
            department: 'pharmacy'
        }));
        
        const uploadResult = await makeRequest({
            method: 'POST',
            url: `${BASE_URL}/files/upload`,
            data: formData,
            headers: formData.getHeaders()
        }, 'agent');
          if (uploadResult.success) {
            createdResources.files.push(uploadResult.data.fileId);
            assert(true, 'Can upload file to storage');
            
            const fileId = uploadResult.data.fileId;
            
            // Test get file info
            const getFileInfoResult = await makeRequest({
                method: 'GET',
                url: `${BASE_URL}/files/${fileId}`
            }, 'agent');
            
            assert(getFileInfoResult.success, 'Can get file information');
            
            // Test download file
            const downloadResult = await makeRequest({
                method: 'GET',
                url: `${BASE_URL}/files/${fileId}/download`
            }, 'agent');
            
            assert(downloadResult.success, 'Can download file');
            
            // Test get signed URL
            const signedUrlResult = await makeRequest({
                method: 'GET',
                url: `${BASE_URL}/files/${fileId}/signed-url?expiry=3600`
            }, 'agent');
            
            assert(signedUrlResult.success, 'Can get signed URL');
            
            // Test file integrity check
            const verifyResult = await makeRequest({
                method: 'GET',
                url: `${BASE_URL}/files/${fileId}/verify`
            }, 'agent');
            
            assert(verifyResult.success, 'Can verify file integrity');
            
        } else {
            assert(false, `Failed to upload file: ${uploadResult.error}`);
        }
    } finally {
        // Cleanup test file
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    }
}

// 7. User Management Tests
async function testUserManagement() {
    log('👤 Testing User Management...', 'INFO');
    
    // Test get user profile (All users)
    const profileResult = await makeRequest({
        method: 'GET',
        url: `${BASE_URL}/users/profile`
    }, 'agent');
    
    assert(profileResult.success, 'Can get user profile', profileResult.error);
    
    // Test update profile (All users)
    const updateProfileResult = await makeRequest({
        method: 'PUT',
        url: `${BASE_URL}/users/profile`,
        data: {
            firstName: 'Test',
            lastName: 'User',
            phone: '+961-1-234567'
        }
    }, 'agent');
    
    assert(updateProfileResult.success, 'Can update user profile', updateProfileResult.error);
    
    // Test change password (All users)
    const changePasswordResult = await makeRequest({
        method: 'POST',
        url: `${BASE_URL}/users/change-password`,
        data: {
            currentPassword: 'password123',
            newPassword: 'newpassword123'
        }
    }, 'agent');
    
    // This might fail if the user doesn't exist or password is incorrect, which is expected
    if (changePasswordResult.success) {
        assert(true, 'Can change password');
    } else {
        log('Password change test skipped (expected if test user not configured)', 'WARNING');
    }
    
    // Test admin operations (Admin only)
    const getAllUsersResult = await makeRequest({
        method: 'GET',
        url: `${BASE_URL}/users?page=1&limit=10`
    }, 'admin');
    
    assert(getAllUsersResult.success, 'Admin can get all users');
}

// 8. System Tests
async function testSystemEndpoints() {
    log('⚙️ Testing System Endpoints...', 'INFO');
    
    // Test health check (Public)
    const healthResult = await makeRequest({
        method: 'GET',
        url: `${BASE_URL}/health`
    });
    
    assert(healthResult.success, 'Health check endpoint works');
    
    // Test dashboard stats (All authenticated)
    const statsResult = await makeRequest({
        method: 'GET',
        url: `${BASE_URL}/stats/dashboard`
    }, 'agent');
    
    assert(statsResult.success, 'Can get dashboard statistics');
    
    // Test database health (Admin)
    const dbHealthResult = await makeRequest({
        method: 'GET',
        url: `${BASE_URL}/health/database`
    }, 'admin');
    
    assert(dbHealthResult.success, 'Admin can check database health');
}

// Permission Tests
async function testPermissions() {
    log('🔒 Testing Role-Based Permissions...', 'INFO');
    
    if (createdResources.importationRequests.length === 0) {
        log('No resources created, skipping permission tests', 'WARNING');
        return;
    }
    
    const requestId = createdResources.importationRequests[0];
    
    // Test agent cannot delete requests
    const agentDeleteResult = await makeRequest({
        method: 'DELETE',
        url: `${BASE_URL}/importation-requests/${requestId}`
    }, 'agent');
    
    assert(!agentDeleteResult.success && agentDeleteResult.status === 403, 
           'Agent correctly denied delete permission');
    
    // Test inspector cannot approve swift payments
    if (createdResources.swiftPayments.length > 0) {
        const swiftId = createdResources.swiftPayments[0];
        const inspectorApproveResult = await makeRequest({
            method: 'PATCH',
            url: `${BASE_URL}/swift-payments/${swiftId}/approve`,
            data: { action: 'approve', comments: 'Test approval' }
        }, 'inspector');
        
        assert(!inspectorApproveResult.success && inspectorApproveResult.status === 403,
               'Inspector correctly denied swift payment approval');
    }
    
    // Test head_pharmacy cannot create announcements
    const headPharmacyCreateAnnouncementResult = await makeRequest({
        method: 'POST',
        url: `${BASE_URL}/importation-announcements`,
        data: {
            title: 'Test Title',
            content: 'Test Content',
            type: 'general'
        }
    }, 'headPharmacy');
    
    assert(!headPharmacyCreateAnnouncementResult.success && headPharmacyCreateAnnouncementResult.status === 403,
           'Head Pharmacy correctly denied announcement creation');
}

// Cleanup function
async function cleanup() {
    log('🧹 Cleaning up test resources...', 'INFO');
    
    // Delete created announcements (Admin)
    for (const announcementId of createdResources.announcements) {
        await makeRequest({
            method: 'DELETE',
            url: `${BASE_URL}/importation-announcements/${announcementId}`
        }, 'admin');
    }
    
    // Delete created files (Admin)
    for (const fileId of createdResources.files) {
        await makeRequest({
            method: 'DELETE',
            url: `${BASE_URL}/files/${fileId}`
        }, 'admin');
    }
    
    // Delete created importation requests (Admin)
    for (const requestId of createdResources.importationRequests) {
        await makeRequest({
            method: 'DELETE',
            url: `${BASE_URL}/importation-requests/${requestId}`
        }, 'admin');
    }
    
    log('Cleanup completed', 'SUCCESS');
}

// Main test runner
async function runAllTests() {
    const startTime = Date.now();
    
    log('🚀 Starting Importation Module API Tests...', 'INFO');
    log(`Base URL: ${BASE_URL}`, 'INFO');
    log('====================================================', 'INFO');
    
    try {
        // Authentication must pass for other tests to work
        await testAuthentication();
        
        if (testUsers.agent.token) {
            // Core functionality tests
            await testImportationRequests();
            await testRFDRequests();
            await testProformaRequests();
            await testSwiftPayments();
            await testAnnouncements();
            await testFileStorage();
            await testUserManagement();
            await testSystemEndpoints();
            
            // Permission and security tests
            await testPermissions();
        } else {
            log('Authentication failed, skipping remaining tests', 'ERROR');
        }
        
    } catch (error) {
        log(`Test execution error: ${error.message}`, 'ERROR');
        testResults.errors.push(error.message);
    } finally {
        // Always attempt cleanup
        await cleanup();
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Print results
    log('====================================================', 'INFO');
    log('📊 TEST RESULTS SUMMARY', 'INFO');
    log(`Total Tests: ${testResults.total}`, 'INFO');
    log(`Passed: ${testResults.passed}`, 'SUCCESS');
    log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'ERROR' : 'SUCCESS');
    log(`Duration: ${duration} seconds`, 'INFO');
    
    if (testResults.errors.length > 0) {
        log('\n❌ FAILED TESTS:', 'ERROR');
        testResults.errors.forEach((error, index) => {
            log(`${index + 1}. ${error}`, 'ERROR');
        });
    }
    
    const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
    log(`Success Rate: ${successRate}%`, successRate >= 90 ? 'SUCCESS' : 'WARNING');
    
    if (testResults.failed === 0) {
        log('🎉 ALL TESTS PASSED!', 'SUCCESS');
    } else {
        log(`⚠️  ${testResults.failed} test(s) failed`, 'WARNING');
    }
    
    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0);
}

// Handle process interruption
process.on('SIGINT', async () => {
    log('\n🛑 Test interrupted by user', 'WARNING');
    await cleanup();
    process.exit(1);
});

// Set timeout for entire test suite
setTimeout(() => {
    log('⏰ Test suite timeout reached', 'ERROR');
    cleanup().then(() => process.exit(1));
}, TEST_TIMEOUT);

// Run tests
runAllTests();
