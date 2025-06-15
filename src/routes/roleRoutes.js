const express = require('express');
const RoleController = require('../controllers/roleController');

const router = express.Router();

// Create a new role
router.post('/roles', RoleController.createRole);

// Get all roles
router.get('/roles', RoleController.getAllRoles);

// Get a role by ID
router.get('/roles/:id', RoleController.getRoleById);

// Update a role
router.put('/roles/:id', RoleController.updateRole);

// Delete a role
router.delete('/roles/:id', RoleController.deleteRole);

// Get a role by name
router.get('/roles/name/:name', RoleController.getRoleByName);

// Get categorized roles
router.get('/roles/categorized', RoleController.getCategorizedRoles);

module.exports = router;
