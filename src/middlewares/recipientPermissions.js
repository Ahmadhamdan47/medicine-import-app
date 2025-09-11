const UserAccounts = require('../models/userAccounts');

/**
 * Middleware to ensure user has recipient access
 * @returns {Function} Express middleware function
 */
const requireRecipientAccess = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const user = await UserAccounts.findByPk(userId);
        if (!user || !user.RecipientId) {
            return res.status(403).json({ 
                error: 'Access denied: Not a recipient account' 
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ 
            error: error.message 
        });
    }
};

/**
 * Middleware to check if user can access specific recipient data
 * Only allows access if user is the recipient or has admin privileges
 * @returns {Function} Express middleware function
 */
const checkRecipientOwnership = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const requestedRecipientId = req.params.recipientId;
        
        const user = await UserAccounts.findByPk(userId);
        if (!user) {
            return res.status(403).json({ 
                error: 'Access denied: User not found' 
            });
        }

        // Allow admin access
        if (req.user.role === 'admin') {
            return next();
        }

        // Check if user is the recipient they're trying to access
        if (!user.RecipientId || user.RecipientId.toString() !== requestedRecipientId) {
            return res.status(403).json({ 
                error: 'Access denied: Can only access your own recipient data' 
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ 
            error: error.message 
        });
    }
};

module.exports = { 
    requireRecipientAccess,
    checkRecipientOwnership
};
