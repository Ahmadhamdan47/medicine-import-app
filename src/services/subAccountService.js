const UserAccounts = require('../models/userAccounts');
const bcrypt = require('bcryptjs');

class SubAccountService {
    /**
     * Create a sub-account for a donor
     * @param {number} mainUserId - The main donor account user ID
     * @param {object} subAccountData - Sub-account data
     * @returns {object} Created sub-account
     */
    static async createDonorSubAccount(mainUserId, subAccountData) {
        try {
            // Get main user's donor info
            const mainUser = await UserAccounts.findByPk(mainUserId);
            if (!mainUser || !mainUser.DonorId) {
                throw new Error('Main donor account not found');
            }

            // Check if username already exists
            const existingUser = await UserAccounts.findOne({
                where: { Username: subAccountData.Username }
            });
            if (existingUser) {
                throw new Error('Username already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(subAccountData.Password, 10);

            // Create sub-account
            const subAccount = await UserAccounts.create({
                Username: subAccountData.Username,
                PasswordHash: hashedPassword,
                Email: subAccountData.Email,
                DonorId: mainUser.DonorId, // Same donor
                RoleId: mainUser.RoleId, // Same role
                IsActive: true,
                IsMainAccount: false,
                ParentUserId: mainUserId,
                Permissions: subAccountData.Permissions || ['view_donations'],
                CreatedBy: mainUserId
            });

            // Remove sensitive data from response
            const responseData = {
                UserId: subAccount.UserId,
                Username: subAccount.Username,
                Email: subAccount.Email,
                Permissions: subAccount.Permissions,
                IsActive: subAccount.IsActive,
                DonorId: subAccount.DonorId
            };

            return responseData;
        } catch (error) {
            throw new Error(`Error creating sub-account: ${error.message}`);
        }
    }

    /**
     * Get all sub-accounts for a main donor account
     * @param {number} mainUserId - The main donor account user ID
     * @returns {array} List of sub-accounts
     */
    static async getDonorSubAccounts(mainUserId) {
        try {
            const subAccounts = await UserAccounts.findAll({
                where: { 
                    ParentUserId: mainUserId,
                    IsActive: true 
                },
                attributes: ['UserId', 'Username', 'Email', 'Permissions', 'IsActive', 'DonorId']
            });
            return subAccounts;
        } catch (error) {
            throw new Error(`Error fetching sub-accounts: ${error.message}`);
        }
    }

    /**
     * Update sub-account permissions
     * @param {number} subAccountId - Sub-account ID
     * @param {number} mainUserId - Main account ID (for ownership verification)
     * @param {array} permissions - New permissions array
     * @returns {object} Success response
     */
    static async updateSubAccountPermissions(subAccountId, mainUserId, permissions) {
        try {
            // Verify ownership
            const subAccount = await UserAccounts.findOne({
                where: { 
                    UserId: subAccountId,
                    ParentUserId: mainUserId 
                }
            });

            if (!subAccount) {
                throw new Error('Sub-account not found or access denied');
            }

            await UserAccounts.update(
                { Permissions: permissions },
                { where: { UserId: subAccountId } }
            );

            return { success: true, message: 'Permissions updated successfully' };
        } catch (error) {
            throw new Error(`Error updating permissions: ${error.message}`);
        }
    }

    /**
     * Deactivate a sub-account
     * @param {number} subAccountId - Sub-account ID
     * @param {number} mainUserId - Main account ID (for ownership verification)
     * @returns {object} Success response
     */
    static async deactivateSubAccount(subAccountId, mainUserId) {
        try {
            // Verify ownership
            const subAccount = await UserAccounts.findOne({
                where: { 
                    UserId: subAccountId,
                    ParentUserId: mainUserId 
                }
            });

            if (!subAccount) {
                throw new Error('Sub-account not found or access denied');
            }

            await UserAccounts.update(
                { IsActive: false },
                { where: { UserId: subAccountId } }
            );

            return { success: true, message: 'Sub-account deactivated successfully' };
        } catch (error) {
            throw new Error(`Error deactivating sub-account: ${error.message}`);
        }
    }

    /**
     * Get sub-account details
     * @param {number} subAccountId - Sub-account ID
     * @param {number} mainUserId - Main account ID (for ownership verification)
     * @returns {object} Sub-account details
     */
    static async getSubAccountDetails(subAccountId, mainUserId) {
        try {
            const subAccount = await UserAccounts.findOne({
                where: { 
                    UserId: subAccountId,
                    ParentUserId: mainUserId 
                },
                attributes: ['UserId', 'Username', 'Email', 'Permissions', 'IsActive', 'DonorId']
            });

            if (!subAccount) {
                throw new Error('Sub-account not found or access denied');
            }

            return subAccount;
        } catch (error) {
            throw new Error(`Error fetching sub-account details: ${error.message}`);
        }
    }

    /**
     * Verify if user has permission for an action
     * @param {number} userId - User ID
     * @param {string} permission - Permission to check
     * @returns {boolean} Has permission
     */
    static async hasPermission(userId, permission) {
        try {
            const user = await UserAccounts.findByPk(userId);
            if (!user) {
                return false;
            }

            // Main accounts have all permissions
            if (user.IsMainAccount) {
                return true;
            }

            // Check if sub-account has the specific permission
            const permissions = user.Permissions || [];
            return permissions.includes(permission);
        } catch (error) {
            return false;
        }
    }
}

module.exports = SubAccountService;
