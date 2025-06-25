/**
 * List All Agents Script
 * 
 * This script lists all agents and their associated user accounts
 * in a simple format without complex associations.
 * 
 * Usage: node scripts/list-all-agents.js
 */

const sequelize = require('../config/databasePharmacy');

// Import models
const Agent = require('../src/models/agent');
const UserAccounts = require('../src/models/userAccounts');
const Roles = require('../src/models/roles');

/**
 * Get all agents with their user accounts
 */
async function getAllAgentsWithUsers() {
    try {
        // Get Agent role
        const agentRole = await Roles.findOne({ where: { RoleName: 'Agent' } });
        if (!agentRole) {
            throw new Error('Agent role not found');
        }

        // Get all agents
        const agents = await Agent.findAll({
            order: [['AgentID', 'ASC']]
        });

        // Get all users with Agent role
        const agentUsers = await UserAccounts.findAll({
            where: { RoleId: agentRole.RoleId },
            order: [['UserId', 'ASC']]
        });

        // Match agents with their users
        const agentsWithUsers = agents.map(agent => {
            const user = agentUsers.find(u => u.AgentId === agent.AgentID);
            return {
                agentId: agent.AgentID,
                agentName: agent.AgentName,
                agentType: agent.AgentType,
                isActive: agent.IsActive,
                createdDate: agent.CreatedDate,
                user: user ? {
                    userId: user.UserId,
                    username: user.Username,
                    email: user.Email,
                    isActive: user.IsActive
                } : null
            };
        });

        return agentsWithUsers;
    } catch (error) {
        throw new Error(`Failed to get agents: ${error.message}`);
    }
}

/**
 * Print formatted list of all agents
 */
function printAgentsList(agents) {
    console.log('\n' + '='.repeat(80));
    console.log('📋 COMPLETE LIST OF PHARMACEUTICAL AGENTS');
    console.log('='.repeat(80));
    
    const csvAgents = agents.filter(agent => 
        agent.createdDate && 
        new Date(agent.createdDate) > new Date('2025-06-25') &&
        agent.agentType === 'Distributor'
    );
    
    const existingAgents = agents.filter(agent => 
        !csvAgents.includes(agent)
    );

    console.log(`\n🆕 AGENTS CREATED FROM CSV (${csvAgents.length}):`);
    console.log('-'.repeat(80));
    
    csvAgents.forEach((agent, index) => {
        console.log(`${String(index + 1).padStart(3, ' ')}. ${agent.agentName}`);
        if (agent.user) {
            console.log(`     👤 Username: ${agent.user.username}`);
            console.log(`     📧 Email: ${agent.user.email}`);
            console.log(`     🔢 Agent ID: ${agent.agentId}, User ID: ${agent.user.userId}`);
        } else {
            console.log(`     ⚠️  No user account found`);
        }
        console.log('');
    });

    if (existingAgents.length > 0) {
        console.log(`\n📋 PRE-EXISTING AGENTS (${existingAgents.length}):`);
        console.log('-'.repeat(80));
        
        existingAgents.forEach((agent, index) => {
            console.log(`${String(index + 1).padStart(3, ' ')}. ${agent.agentName || 'Unnamed Agent'}`);
            console.log(`     🔢 Agent ID: ${agent.agentId}`);
            if (agent.user) {
                console.log(`     👤 Username: ${agent.user.username}`);
                console.log(`     📧 Email: ${agent.user.email}`);
            } else {
                console.log(`     ⚠️  No user account`);
            }
            console.log('');
        });
    }

    console.log('\n📊 SUMMARY:');
    console.log('-'.repeat(40));
    console.log(`Total Agents: ${agents.length}`);
    console.log(`From CSV Import: ${csvAgents.length}`);
    console.log(`Pre-existing: ${existingAgents.length}`);
    console.log(`With User Accounts: ${agents.filter(a => a.user).length}`);
    console.log(`Without User Accounts: ${agents.filter(a => !a.user).length}`);
    
    console.log('\n🔑 LOGIN CREDENTIALS (CSV Agents):');
    console.log('-'.repeat(40));
    console.log('Password: agent123');
    console.log('Username format: {agent_name}_{index}');
    console.log('Email format: {agent.name}.{index}@agent-test.com');
    
    console.log('\n' + '='.repeat(80));
}

/**
 * Export list to JSON file
 */
async function exportToJSON(agents) {
    const fs = require('fs');
    const path = require('path');
    
    const exportData = {
        exportDate: new Date().toISOString(),
        totalAgents: agents.length,
        csvImportedAgents: agents.filter(agent => 
            agent.createdDate && 
            new Date(agent.createdDate) > new Date('2025-06-25') &&
            agent.agentType === 'Distributor'
        ).length,
        agents: agents
    };
    
    const filePath = path.join(__dirname, '../docs/agents-complete-list.json');
    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
    
    console.log(`\n💾 Agent list exported to: ${filePath}`);
}

/**
 * Main execution function
 */
async function main() {
    try {
        console.log('📋 Fetching all pharmaceutical agents...\n');
        
        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Database connection established');
        
        // Get all agents with users
        const agents = await getAllAgentsWithUsers();
        
        // Print formatted list
        printAgentsList(agents);
        
        // Export to JSON
        await exportToJSON(agents);
        
    } catch (error) {
        console.error('💥 Error:', error.message);
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
    getAllAgentsWithUsers,
    printAgentsList,
    exportToJSON,
    main
};
