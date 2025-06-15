// Authentication middleware for protecting importation routes
const jwt = require('jsonwebtoken');
const UserAccounts = require('../models/userAccounts');
const Roles = require('../models/roles');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        // Use the same JWT secret as your existing login system
        const decoded = jwt.verify(token, 'secret');        // Fetch user details to ensure the user still exists and is active
        const user = await UserAccounts.findByPk(decoded.id, {
            include: [{
                model: Roles,
                as: 'role',
                attributes: ['RoleName']
            }]
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Map role names to match the requirements document roles
        let roleName = null;
        if (user.role) {
            const roleMapping = {
                'Agent': 'agent',
                'Import/Export': 'import_export', 
                'Head Pharmacy': 'head_pharmacy',
                'Inspector': 'inspector',
                'Admin': 'admin',
                'Quality Study Committee': 'quality_study_committee',
                'Pricing Committee': 'pricing_committee'
            };
            roleName = roleMapping[user.role.RoleName] || user.role.RoleName.toLowerCase();
        }

        req.user = {
            id: user.UserId,
            username: user.Username,
            email: user.Email,
            roleId: user.RoleId,
            role: roleName,
            agentId: user.AgentId,
            donorId: user.DonorId,
            recipientId: user.RecipientId
        };

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions' });
        }

        next();
    };
};

// Check if user owns the resource or has admin privileges
const authorizeOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const isAdmin = req.user.role === 'admin';
    const isImportExport = req.user.role === 'import_export';
    const resourceAgentId = req.params.agentId || req.body.agentId;
    const isOwner = req.user.agentId && req.user.agentId.toString() === resourceAgentId;

    if (!isAdmin && !isImportExport && !isOwner) {
        return res.status(403).json({ error: 'Access denied. You can only access your own resources' });
    }

    next();
};

module.exports = {
    authenticateToken,
    authorizeRoles,
    authorizeOwnerOrAdmin
};
