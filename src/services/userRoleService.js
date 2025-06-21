const UserAccounts = require('../models/userAccounts');
const Role = require('../models/roles');

class UserRoleService {
    
    // Get user workflow role
    static async getUserWorkflowRole(userId) {
        try {
            const user = await UserAccounts.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            
            // Return the WorkflowRole if it exists, otherwise default to 'agent'
            return user.WorkflowRole || 'agent';
        } catch (error) {
            throw new Error(`Failed to get user workflow role: ${error.message}`);
        }
    }

    // Set user workflow role
    static async setUserWorkflowRole(userId, workflowRole) {
        try {
            const validRoles = ['agent', 'import_export', 'quality_committee', 'pricing_committee', 'admin'];
            
            if (!validRoles.includes(workflowRole)) {
                throw new Error(`Invalid workflow role: ${workflowRole}`);
            }

            const user = await UserAccounts.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }

            await user.update({ WorkflowRole: workflowRole });
            return user;
        } catch (error) {
            throw new Error(`Failed to set user workflow role: ${error.message}`);
        }
    }

    // Get user with workflow role
    static async getUserWithWorkflowRole(userId) {
        try {
            const user = await UserAccounts.findByPk(userId, {
                include: [
                    {
                        model: Role,
                        as: 'role' // Assuming there's an association
                    }
                ]
            });

            if (!user) {
                throw new Error('User not found');
            }

            return {
                userId: user.UserId,
                username: user.Username,
                workflowRole: user.WorkflowRole || 'agent',
                isActive: user.IsActive,
                role: user.role
            };
        } catch (error) {
            throw new Error(`Failed to get user with workflow role: ${error.message}`);
        }
    }

    // Get all users by workflow role
    static async getUsersByWorkflowRole(workflowRole) {
        try {
            const users = await UserAccounts.findAll({
                where: {
                    WorkflowRole: workflowRole,
                    IsActive: true
                },
                attributes: ['UserId', 'Username', 'WorkflowRole']
            });

            return users;
        } catch (error) {
            throw new Error(`Failed to get users by workflow role: ${error.message}`);
        }
    }

    // Check if user has permission for workflow action
    static async checkWorkflowPermission(userId, action, drugId = null) {
        try {
            const workflowRole = await this.getUserWorkflowRole(userId);
            
            // Define permission matrix
            const permissions = {
                'agent': ['create_drug', 'edit_own_steps_1_5', 'view_own_drugs', 'complete_step'],
                'import_export': ['view_pending_import_export', 'edit_steps_6_8', 'approve_step_5', 'reject_step'],
                'quality_committee': ['view_all_steps', 'approve_quality', 'reject_quality'],
                'pricing_committee': ['view_all_steps', 'approve_pricing', 'reject_pricing'],
                'admin': ['*'] // Admin has all permissions
            };

            const userPermissions = permissions[workflowRole] || [];
            
            // Admin has all permissions
            if (userPermissions.includes('*')) {
                return true;
            }

            // Check specific permission
            return userPermissions.includes(action);
        } catch (error) {
            console.error('Error checking workflow permission:', error);
            return false;
        }
    }

    // Get workflow role hierarchy (for escalation purposes)
    static getWorkflowRoleHierarchy() {
        return {
            'agent': 1,
            'import_export': 2,
            'quality_committee': 3,
            'pricing_committee': 3,
            'admin': 4
        };
    }

    // Check if user can escalate to another role
    static async canEscalate(fromUserId, toRole) {
        try {
            const fromRole = await this.getUserWorkflowRole(fromUserId);
            const hierarchy = this.getWorkflowRoleHierarchy();
            
            return hierarchy[fromRole] < hierarchy[toRole];
        } catch (error) {
            return false;
        }
    }
}

module.exports = UserRoleService;
