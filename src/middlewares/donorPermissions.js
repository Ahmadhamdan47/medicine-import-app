const UserAccounts = require('../models/userAccounts');

/**
 * Middleware to check if user has specific donor permission
 * @param {string} requiredPermission - The permission to check for
 * @returns {Function} Express middleware function
 */
const checkDonorPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            
            const user = await UserAccounts.findByPk(userId);
            if (!user || !user.DonorId) {
                return res.status(403).json({ 
                    error: 'Access denied: Not a donor account' 
                });
            }

            // Main accounts have all permissions
            if (user.IsMainAccount) {
                return next();
            }

            // Check if sub-account has required permission
            const permissions = user.Permissions || [];
            if (permissions.includes(requiredPermission)) {
                return next();
            } else {
                return res.status(403).json({ 
                    error: `Permission denied: ${requiredPermission} required` 
                });
            }
        } catch (error) {
            return res.status(500).json({ 
                error: error.message 
            });
        }
    };
};

/**
 * Middleware to ensure only main donor accounts can access sub-account management
 * @returns {Function} Express middleware function
 */
const requireMainDonorAccount = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const user = await UserAccounts.findByPk(userId);
        if (!user || !user.DonorId) {
            return res.status(403).json({ 
                error: 'Access denied: Not a donor account' 
            });
        }

        if (!user.IsMainAccount) {
            return res.status(403).json({ 
                error: 'Access denied: Only main donor accounts can manage sub-accounts' 
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
 * Middleware to ensure user has donor access (main or sub-account)
 * @returns {Function} Express middleware function
 */
const requireDonorAccess = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const user = await UserAccounts.findByPk(userId);
        if (!user || !user.DonorId) {
            return res.status(403).json({ 
                error: 'Access denied: Not a donor account' 
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
    checkDonorPermission, 
    requireMainDonorAccount, 
    requireDonorAccess 
};
