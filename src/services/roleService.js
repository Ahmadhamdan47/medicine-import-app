const Role = require('../models/roles');

class RoleService {
    // Create a new role
    async createRole(roleData) {
        try {
            const role = await Role.create(roleData);
            return role;
        } catch (error) {
            throw new Error(`Could not create role: ${error.message}`);
        }
    }

    // Get all roles
    async getAllRoles() {
        try {
            const roles = await Role.findAll();
            return roles;
        } catch (error) {
            throw new Error(`Could not retrieve roles: ${error.message}`);
        }
    }

    // Get a role by ID
    async getRoleById(roleId) {
        try {
            const role = await Role.findByPk(roleId);
            if (!role) {
                throw new Error('Role not found');
            }
            return role;
        } catch (error) {
            throw new Error(`Could not retrieve role: ${error.message}`);
        }
    }

    // Update a role
    async updateRole(roleId, updatedData) {
        try {
            const role = await Role.findByPk(roleId);
            if (!role) {
                throw new Error('Role not found');
            }
            const updatedRole = await role.update(updatedData);
            return updatedRole;
        } catch (error) {
            throw new Error(`Could not update role: ${error.message}`);
        }
    }

    // Delete a role
    async deleteRole(roleId) {
        try {
            const role = await Role.findByPk(roleId);
            if (!role) {
                throw new Error('Role not found');
            }
            await role.destroy();
            return { message: 'Role deleted successfully' };
        } catch (error) {
            throw new Error(`Could not delete role: ${error.message}`);
        }
    }

    // Get role by name (helper method for new roles)
    async getRoleByName(roleName) {
        try {
            const role = await Role.findOne({ where: { RoleName: roleName } });
            if (!role) {
                throw new Error(`Role '${roleName}' not found`);
            }
            return role;
        } catch (error) {
            throw new Error(`Could not retrieve role: ${error.message}`);
        }
    }

    // Get roles by category (helper for grouping)
    async getRolesByCategory() {
        try {
            const roles = await Role.findAll({ order: [['RoleId', 'ASC']] });
            
            const categorized = {
                core: roles.filter(r => ['Agent', 'Import/Export', 'Head Pharmacy', 'Inspector', 'Admin', 'Pharmacy Service'].includes(r.RoleName)),
                committees: roles.filter(r => ['Quality Study Committee', 'Pricing Committee'].includes(r.RoleName)),
                others: roles.filter(r => ['Donor', 'Recipient'].includes(r.RoleName))
            };
            
            return categorized;
        } catch (error) {
            throw new Error(`Could not categorize roles: ${error.message}`);
        }
    }
}

module.exports = new RoleService();
