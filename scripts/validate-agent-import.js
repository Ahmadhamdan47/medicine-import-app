/**
 * Agent Import Validation Script
 * 
 * This script validates the agents and accounts created by create-agents-from-csv.js
 * It checks that:
 * 1. Agent records were created properly
 * 2. User accounts are linked correctly
 * 3. Login credentials work
 * 4. Role assignments are correct
 * 
 * Usage: node scripts/validate-agent-import.js
 */

const bcrypt = require('bcryptjs');
const sequelize = require('../config/databasePharmacy');

// Import models
const Agent = require('../src/models/agent');
const UserAccounts = require('../src/models/userAccounts');
const Roles = require('../src/models/roles');

// Import associations
require('../src/models/associations/associations');

// Test credentials
const DEFAULT_PASSWORD = 'agent123';

/**
 * Get basic statistics about imported agents
 */
async function getImportStatistics() {
    try {
        const agentCount = await Agent.count();
        const userCount = await UserAccounts.count({
            where: { AgentId: { [require('sequelize').Op.not]: null } }
        });
        
        const agentRole = await Roles.findOne({ where: { RoleName: 'Agent' } });
        const agentUserCount = agentRole ? await UserAccounts.count({
            where: { RoleId: agentRole.RoleId }
        }) : 0;
        
        return {
            totalAgents: agentCount,
            totalAgentUsers: userCount,
            agentRoleUsers: agentUserCount,
            agentRoleId: agentRole ? agentRole.RoleId : null
        };
    } catch (error) {
        throw new Error(`Failed to get statistics: ${error.message}`);
    }
}

/**
 * Test a sample of user logins
 */
async function testSampleLogins(sampleSize = 5) {
    try {
        const agentRole = await Roles.findOne({ where: { RoleName: 'Agent' } });
        if (!agentRole) {
            throw new Error('Agent role not found');
        }
        
        const sampleUsers = await UserAccounts.findAll({
            where: { RoleId: agentRole.RoleId },
            include: [{
                model: Agent,
                as: 'agent',
                required: true
            }],
            limit: sampleSize,
            order: [['UserId', 'ASC']]
        });
        
        const testResults = [];
        
        for (const user of sampleUsers) {
            try {
                // Test password verification
                const isPasswordValid = await bcrypt.compare(DEFAULT_PASSWORD, user.PasswordHash);
                
                testResults.push({
                    userId: user.UserId,
                    username: user.Username,
                    email: user.Email,
                    agentName: user.agent ? user.agent.AgentName : 'No Agent',
                    agentId: user.AgentId,
                    passwordValid: isPasswordValid,
                    status: 'SUCCESS'
                });
            } catch (error) {
                testResults.push({
                    userId: user.UserId,
                    username: user.Username,
                    status: 'ERROR',
                    error: error.message
                });
            }
        }
        
        return testResults;
    } catch (error) {
        throw new Error(`Failed to test logins: ${error.message}`);
    }
}

/**
 * Check for orphaned records
 */
async function checkDataIntegrity() {
    try {
        // Check for users without agents
        const usersWithoutAgents = await UserAccounts.count({
            where: {
                AgentId: { [require('sequelize').Op.not]: null }
            },
            include: [{
                model: Agent,
                as: 'agent',
                required: false
            }]
        });
        
        // Check for agents without users
        const agentsWithoutUsers = await Agent.findAll({
            include: [{
                model: UserAccounts,
                as: 'UserAccounts',
                required: false
            }]
        });
        
        const orphanedAgents = agentsWithoutUsers.filter(agent => 
            !agent.UserAccounts || agent.UserAccounts.length === 0
        );
        
        return {
            usersWithoutAgents,
            orphanedAgents: orphanedAgents.length,
            orphanedAgentsList: orphanedAgents.map(a => ({
                id: a.AgentID,
                name: a.AgentName
            }))
        };
    } catch (error) {
        throw new Error(`Failed to check integrity: ${error.message}`);
    }
}

/**
 * Get recent imports (created in last 24 hours)
 */
async function getRecentImports() {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const recentAgents = await Agent.findAll({
            where: {
                CreatedDate: {
                    [require('sequelize').Op.gte]: yesterday
                }
            },
            include: [{
                model: UserAccounts,
                as: 'UserAccounts',
                required: false
            }]
        });
        
        return recentAgents.map(agent => ({
            agentId: agent.AgentID,
            agentName: agent.AgentName,
            createdDate: agent.CreatedDate,
            hasUser: agent.UserAccounts && agent.UserAccounts.length > 0,
            userCount: agent.UserAccounts ? agent.UserAccounts.length : 0,
            usernames: agent.UserAccounts ? agent.UserAccounts.map(u => u.Username) : []
        }));
    } catch (error) {
        throw new Error(`Failed to get recent imports: ${error.message}`);
    }
}

/**
 * Print validation report
 */
function printValidationReport(stats, loginTests, integrity, recentImports) {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 AGENT IMPORT VALIDATION REPORT');
    console.log('='.repeat(60));
    
    // Basic Statistics
    console.log('\n📊 IMPORT STATISTICS:');
    console.log('-'.repeat(30));
    console.log(`Total Agents: ${stats.totalAgents}`);
    console.log(`Total Agent Users: ${stats.totalAgentUsers}`);
    console.log(`Agent Role Users: ${stats.agentRoleUsers}`);
    console.log(`Agent Role ID: ${stats.agentRoleId}`);
    
    // Recent Imports
    console.log('\n🕒 RECENT IMPORTS (Last 24 hours):');
    console.log('-'.repeat(30));
    if (recentImports.length === 0) {
        console.log('No recent imports found');
    } else {
        console.log(`Found ${recentImports.length} recent imports:`);
        recentImports.slice(0, 10).forEach((item, index) => {
            console.log(`${index + 1}. ${item.agentName}`);
            console.log(`   Created: ${item.createdDate}`);
            console.log(`   Has User: ${item.hasUser ? '✅' : '❌'}`);
            if (item.hasUser) {
                console.log(`   Username(s): ${item.usernames.join(', ')}`);
            }
            console.log('');
        });
        
        if (recentImports.length > 10) {
            console.log(`... and ${recentImports.length - 10} more`);
        }
    }
    
    // Login Tests
    console.log('\n🔐 LOGIN VALIDATION TESTS:');
    console.log('-'.repeat(30));
    const successfulLogins = loginTests.filter(test => test.status === 'SUCCESS' && test.passwordValid);
    const failedLogins = loginTests.filter(test => test.status !== 'SUCCESS' || !test.passwordValid);
    
    console.log(`✅ Successful: ${successfulLogins.length}/${loginTests.length}`);
    console.log(`❌ Failed: ${failedLogins.length}/${loginTests.length}`);
    
    if (successfulLogins.length > 0) {
        console.log('\nSample Working Accounts:');
        successfulLogins.forEach((test, index) => {
            console.log(`${index + 1}. ${test.username} (${test.agentName})`);
            console.log(`   Email: ${test.email}`);
            console.log(`   Password: ${DEFAULT_PASSWORD} ✅`);
        });
    }
    
    if (failedLogins.length > 0) {
        console.log('\nFailed Login Tests:');
        failedLogins.forEach((test, index) => {
            console.log(`${index + 1}. ${test.username}`);
            console.log(`   Issue: ${test.error || 'Invalid password'}`);
        });
    }
    
    // Data Integrity
    console.log('\n🔗 DATA INTEGRITY CHECK:');
    console.log('-'.repeat(30));
    console.log(`Users without Agents: ${integrity.usersWithoutAgents}`);
    console.log(`Agents without Users: ${integrity.orphanedAgents}`);
    
    if (integrity.orphanedAgents > 0) {
        console.log('\nOrphaned Agents:');
        integrity.orphanedAgentsList.forEach((agent, index) => {
            console.log(`${index + 1}. ${agent.name} (ID: ${agent.id})`);
        });
    }
    
    // Overall Status
    console.log('\n🎯 OVERALL STATUS:');
    console.log('-'.repeat(30));
    
    const issues = [];
    if (failedLogins.length > 0) issues.push(`${failedLogins.length} login failures`);
    if (integrity.orphanedAgents > 0) issues.push(`${integrity.orphanedAgents} orphaned agents`);
    if (integrity.usersWithoutAgents > 0) issues.push(`${integrity.usersWithoutAgents} orphaned users`);
    
    if (issues.length === 0) {
        console.log('✅ ALL CHECKS PASSED - Import appears successful!');
    } else {
        console.log('⚠️  ISSUES FOUND:');
        issues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    console.log('\n💡 NEXT STEPS:');
    console.log('-'.repeat(30));
    console.log('1. Test login with sample credentials');
    console.log('2. Verify API endpoints work with agent accounts');
    console.log('3. Check agent-specific functionality');
    console.log('4. Update passwords for production use');
    
    console.log('\n🔑 TEST CREDENTIALS:');
    console.log('-'.repeat(30));
    console.log(`Password for all accounts: ${DEFAULT_PASSWORD}`);
    console.log('Email pattern: {name}.{index}@agent-test.com');
    console.log('Username pattern: {name}_{index}');
    
    console.log('\n' + '='.repeat(60));
}

/**
 * Main validation function
 */
async function main() {
    try {
        console.log('🔍 Starting Agent Import Validation...\n');
        
        // Connect to database
        console.log('🔌 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Database connection established');
        
        // Get statistics
        console.log('📊 Gathering import statistics...');
        const stats = await getImportStatistics();
        
        // Test sample logins
        console.log('🔐 Testing sample logins...');
        const loginTests = await testSampleLogins(5);
        
        // Check data integrity
        console.log('🔗 Checking data integrity...');
        const integrity = await checkDataIntegrity();
        
        // Get recent imports
        console.log('🕒 Finding recent imports...');
        const recentImports = await getRecentImports();
        
        // Print report
        printValidationReport(stats, loginTests, integrity, recentImports);
        
    } catch (error) {
        console.error('💥 Validation Error:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    } finally {
        await sequelize.close();
        console.log('\n🔌 Database connection closed');
    }
}

// Execute if called directly
if (require.main === module) {
    main();
}

module.exports = {
    getImportStatistics,
    testSampleLogins,
    checkDataIntegrity,
    getRecentImports,
    main
};
