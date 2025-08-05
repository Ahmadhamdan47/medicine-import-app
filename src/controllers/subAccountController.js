const SubAccountService = require('../services/subAccountService');

class SubAccountController {
    /**
     * POST /users/donor-subaccounts
     * Create a new sub-account for the authenticated donor
     */
    async createDonorSubAccount(req, res) {
        try {
            const mainUserId = req.user.id;
            const subAccountData = req.body;

            // Validate required fields
            const { Username, Password, Email } = subAccountData;
            if (!Username || !Password || !Email) {
                return res.status(400).json({
                    error: 'Username, Password, and Email are required'
                });
            }

            // Validate permissions if provided
            const validPermissions = ['view_donations', 'add_donations', 'edit_donations'];
            if (subAccountData.Permissions) {
                const invalidPerms = subAccountData.Permissions.filter(p => !validPermissions.includes(p));
                if (invalidPerms.length > 0) {
                    return res.status(400).json({
                        error: `Invalid permissions: ${invalidPerms.join(', ')}`
                    });
                }
            }

            const subAccount = await SubAccountService.createDonorSubAccount(mainUserId, subAccountData);

            res.status(201).json({
                message: 'Sub-account created successfully',
                data: subAccount
            });
        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    }

    /**
     * GET /users/donor-subaccounts
     * Get all sub-accounts for the authenticated donor
     */
    async getDonorSubAccounts(req, res) {
        try {
            const mainUserId = req.user.id;
            
            const subAccounts = await SubAccountService.getDonorSubAccounts(mainUserId);

            res.status(200).json({
                message: 'Sub-accounts retrieved successfully',
                data: subAccounts
            });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }

    /**
     * GET /users/donor-subaccounts/:userId
     * Get specific sub-account details
     */
    async getSubAccountDetails(req, res) {
        try {
            const mainUserId = req.user.id;
            const subAccountId = req.params.userId;

            const subAccount = await SubAccountService.getSubAccountDetails(subAccountId, mainUserId);

            res.status(200).json({
                message: 'Sub-account details retrieved successfully',
                data: subAccount
            });
        } catch (error) {
            res.status(404).json({
                error: error.message
            });
        }
    }

    /**
     * PUT /users/donor-subaccounts/:userId
     * Update sub-account permissions
     */
    async updateSubAccountPermissions(req, res) {
        try {
            const mainUserId = req.user.id;
            const subAccountId = req.params.userId;
            const { permissions } = req.body;

            if (!permissions || !Array.isArray(permissions)) {
                return res.status(400).json({
                    error: 'Permissions array is required'
                });
            }

            // Validate permissions
            const validPermissions = ['view_donations', 'add_donations', 'edit_donations'];
            const invalidPerms = permissions.filter(p => !validPermissions.includes(p));
            if (invalidPerms.length > 0) {
                return res.status(400).json({
                    error: `Invalid permissions: ${invalidPerms.join(', ')}`
                });
            }

            const result = await SubAccountService.updateSubAccountPermissions(subAccountId, mainUserId, permissions);

            res.status(200).json({
                message: result.message,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    }

    /**
     * DELETE /users/donor-subaccounts/:userId
     * Deactivate a sub-account
     */
    async deactivateSubAccount(req, res) {
        try {
            const mainUserId = req.user.id;
            const subAccountId = req.params.userId;

            const result = await SubAccountService.deactivateSubAccount(subAccountId, mainUserId);

            res.status(200).json({
                message: result.message,
                data: result
            });
        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    }
}

module.exports = new SubAccountController();
