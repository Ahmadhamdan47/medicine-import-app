/**
 * Agent Import Script - Create Agents and User Accounts from CSV
 * 
 * This script reads agent names from agent.csv and:
 * 1. Creates agent records in the 'agent' table
 * 2. Creates user accounts for each agent with 'Agent' role
 * 3. Sets up default password for testing purposes
 * 
 * Usage: node scripts/create-agents-from-csv.js
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/databasePharmacy');

// Import models
const Agent = require('../src/models/agent');
const UserAccounts = require('../src/models/userAccounts');
const Roles = require('../src/models/roles');

// Import associations to ensure relationships are loaded
require('../src/models/associations/associations');

// Configuration
const CSV_FILE_PATH = path.join(__dirname, '../src/data/agent.csv');
const DEFAULT_PASSWORD = 'agent123'; // Default password for all agent accounts
const SALT_ROUNDS = 10;

/**
 * Read and parse the CSV file
 * @returns {Array} Array of agent names
 */
function readAgentCSV() {
    try {
        const csvContent = fs.readFileSync(CSV_FILE_PATH, 'utf8');
        const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line);
        
        // Skip the header line if it exists (assuming first line is "Agent")
        const agentNames = lines[0].toLowerCase() === 'agent' ? lines.slice(1) : lines;
        
        console.log(`📄 Found ${agentNames.length} agent names in CSV file`);
        return agentNames;
    } catch (error) {
        throw new Error(`Failed to read CSV file: ${error.message}`);
    }
}

/**
 * Generate a unique username from agent name
 * @param {string} agentName - The agent name
 * @param {number} index - Index for uniqueness
 * @returns {string} Generated username
 */
function generateUsername(agentName, index) {
    // Clean the agent name: remove special characters, convert to lowercase
    let cleanName = agentName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .substring(0, 20); // Limit length
    
    // Add index to ensure uniqueness
    return `${cleanName}_${String(index + 1).padStart(3, '0')}`;
}

/**
 * Generate email from agent name and index
 * @param {string} agentName - The agent name
 * @param {number} index - Index for uniqueness
 * @returns {string} Generated email
 */
function generateEmail(agentName, index) {
    const cleanName = agentName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '.');
    
    return `${cleanName}.${String(index + 1).padStart(3, '0')}@agent-test.com`;
}

/**
 * Create or find the Agent role
 * @returns {Object} Agent role object
 */
async function ensureAgentRole() {
    try {
        let agentRole = await Roles.findOne({ where: { RoleName: 'Agent' } });
        
        if (!agentRole) {
            console.log('📝 Creating Agent role...');
            agentRole = await Roles.create({
                RoleName: 'Agent'
            });
            console.log('✅ Agent role created successfully');
        } else {
            console.log('✅ Agent role found');
        }
        
        return agentRole;
    } catch (error) {
        throw new Error(`Failed to ensure Agent role: ${error.message}`);
    }
}

/**
 * Create agent records and user accounts
 * @param {Array} agentNames - Array of agent names
 * @param {Object} agentRole - Agent role object
 */
async function createAgentsAndAccounts(agentNames, agentRole) {
    const results = {
        created: [],
        skipped: [],
        errors: []
    };
    
    // Hash the default password once
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
    
    console.log('\n🚀 Starting agent and account creation...\n');
    
    for (let i = 0; i < agentNames.length; i++) {
        const agentName = agentNames[i];
        const username = generateUsername(agentName, i);
        const email = generateEmail(agentName, i);
        
        try {
            console.log(`📝 Processing: ${agentName}`);
            
            // Check if agent already exists
            const existingAgent = await Agent.findOne({ 
                where: { AgentName: agentName } 
            });
            
            if (existingAgent) {
                console.log(`   ⚠️  Agent already exists: ${agentName}`);
                results.skipped.push({
                    agentName,
                    reason: 'Agent already exists'
                });
                continue;
            }
            
            // Check if username already exists
            const existingUser = await UserAccounts.findOne({
                where: { Username: username }
            });
            
            if (existingUser) {
                console.log(`   ⚠️  Username already exists: ${username}`);
                results.skipped.push({
                    agentName,
                    reason: `Username ${username} already exists`
                });
                continue;
            }
            
            // Create agent record
            const agentRecord = await Agent.create({
                AgentName: agentName,
                AgentType: 'Distributor', // Default type
                IsSupplier: true,
                IsManufacturer: false,
                IsActive: true,
                CreatedDate: new Date(),
                UpdatedDate: new Date(),
                esignature: ''
            });
            
            console.log(`   📋 Created agent record (ID: ${agentRecord.AgentID})`);
            
            // Create user account
            const userAccount = await UserAccounts.create({
                Username: username,
                Email: email,
                PasswordHash: hashedPassword,
                RoleId: agentRole.RoleId,
                AgentId: agentRecord.AgentID,
                IsActive: true
            });
            
            console.log(`   👤 Created user account (ID: ${userAccount.UserId})`);
            console.log(`   🔑 Username: ${username}`);
            console.log(`   📧 Email: ${email}`);
            console.log(`   ✅ Success!\n`);
            
            results.created.push({
                agentName,
                agentId: agentRecord.AgentID,
                userId: userAccount.UserId,
                username,
                email
            });
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}\n`);
            results.errors.push({
                agentName,
                error: error.message
            });
        }
    }
    
    return results;
}

/**
 * Print summary report
 * @param {Object} results - Results from creation process
 */
function printSummary(results) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 AGENT IMPORT SUMMARY');
    console.log('='.repeat(60));
    
    console.log(`✅ Successfully created: ${results.created.length}`);
    console.log(`⚠️  Skipped: ${results.skipped.length}`);
    console.log(`❌ Errors: ${results.errors.length}`);
    
    if (results.created.length > 0) {
        console.log('\n📋 SUCCESSFULLY CREATED:');
        console.log('-'.repeat(40));
        results.created.forEach((item, index) => {
            console.log(`${index + 1}. ${item.agentName}`);
            console.log(`   Username: ${item.username}`);
            console.log(`   Email: ${item.email}`);
            console.log(`   Agent ID: ${item.agentId}, User ID: ${item.userId}\n`);
        });
    }
    
    if (results.skipped.length > 0) {
        console.log('⚠️  SKIPPED:');
        console.log('-'.repeat(40));
        results.skipped.forEach((item, index) => {
            console.log(`${index + 1}. ${item.agentName} - ${item.reason}`);
        });
        console.log('');
    }
    
    if (results.errors.length > 0) {
        console.log('❌ ERRORS:');
        console.log('-'.repeat(40));
        results.errors.forEach((item, index) => {
            console.log(`${index + 1}. ${item.agentName} - ${item.error}`);
        });
        console.log('');
    }
    
    console.log('🔑 DEFAULT PASSWORD FOR ALL ACCOUNTS: ' + DEFAULT_PASSWORD);
    console.log('\n⚠️  SECURITY NOTE: These accounts are for testing purposes only!');
    console.log('   Change passwords before production deployment.');
    console.log('\n✨ Agent import process completed!');
    console.log('='.repeat(60));
}

/**
 * Main execution function
 */
async function main() {
    try {
        console.log('🚀 Starting Agent Import Process...\n');
        
        // Connect to database
        console.log('🔌 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Database connection established\n');
        
        // Read agent names from CSV
        const agentNames = readAgentCSV();
        
        // Ensure Agent role exists
        const agentRole = await ensureAgentRole();
        
        // Create agents and accounts
        const results = await createAgentsAndAccounts(agentNames, agentRole);
        
        // Print summary
        printSummary(results);
        
    } catch (error) {
        console.error('💥 Fatal Error:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    } finally {
        // Close database connection
        await sequelize.close();
        console.log('\n🔌 Database connection closed');
    }
}

// Execute if called directly
if (require.main === module) {
    main();
}

module.exports = {
    readAgentCSV,
    generateUsername,
    generateEmail,
    ensureAgentRole,
    createAgentsAndAccounts,
    main
};
