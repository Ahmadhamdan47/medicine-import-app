const RoleService = require('../services/roleService');

class RoleController {
    // Create a new role
    async createRole(req, res) {
        try {
            const role = await RoleService.createRole(req.body);
            res.status(201).json(role);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get all roles
    async getAllRoles(req, res) {
        try {
            const roles = await RoleService.getAllRoles();
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get a role by ID
    async getRoleById(req, res) {
        try {
            const role = await RoleService.getRoleById(req.params.id);
            res.status(200).json(role);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    // Get role by name
    async getRoleByName(req, res) {
        try {
            const role = await RoleService.getRoleByName(req.params.name);
            res.status(200).json(role);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    // Get categorized roles
    async getCategorizedRoles(req, res) {
        try {
            const categorizedRoles = await RoleService.getRolesByCategory();
            res.status(200).json(categorizedRoles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update a role
    async updateRole(req, res) {
        try {
            const updatedRole = await RoleService.updateRole(req.params.id, req.body);
            res.status(200).json(updatedRole);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete a role
    async deleteRole(req, res) {
        try {
            await RoleService.deleteRole(req.params.id);
            res.status(200).json({ message: 'Role deleted successfully' });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new RoleController();
