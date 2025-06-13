// Enhanced User Controller for profile management
const UserService = require('../services/userService');

class UserProfileController {
    // GET /users/me - Get current user profile
    async getCurrentUserProfile(req, res) {
        try {
            const userId = req.user.id;
            const userProfile = await UserService.getUserProfile(userId);
            
            res.status(200).json({
                message: 'User profile retrieved successfully',
                data: userProfile
            });        } catch (error) {
            res.status(404).json({ 
                error: error.message 
            });
        }
    }

    // PATCH /users/me - Update current user profile
    async updateCurrentUserProfile(req, res) {
        try {
            const userId = req.user.id;
            const updateData = req.body;

            // Remove sensitive fields that shouldn't be updated via this endpoint
            delete updateData.id;
            delete updateData.UserId;
            delete updateData.RoleId;
            delete updateData.PasswordHash;

            const updatedProfile = await UserService.updateUserProfile(userId, updateData);
            
            res.status(200).json({
                message: 'User profile updated successfully',
                data: updatedProfile
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // POST /users/me/change-password - Change user password
    async changePassword(req, res) {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({ 
                    error: 'Current password and new password are required' 
                });
            }

            await UserService.changePassword(userId, currentPassword, newPassword);
            
            res.status(200).json({
                message: 'Password changed successfully'
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // Admin endpoints for user management

    // GET /users - Get all users (admin only)
    async getAllUsers(req, res) {
        try {
            const filters = {
                role: req.query.role,
                isActive: req.query.isActive
            };

            const pagination = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10
            };

            const result = await UserService.getAllUsers(filters, pagination);
            
            res.status(200).json({
                message: 'Users retrieved successfully',
                ...result
            });
        } catch (error) {
            res.status(500).json({ 
                error: error.message 
            });
        }
    }

    // GET /users/:id - Get user by ID (admin only)
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserProfile(id);
            
            res.status(200).json({
                message: 'User retrieved successfully',
                data: user
            });
        } catch (error) {
            res.status(404).json({ 
                error: error.message 
            });
        }
    }

    // POST /users - Create new user (admin only)
    async createUser(req, res) {
        try {
            const userData = req.body;
            const createdBy = req.user.id;

            const newUser = await UserService.createUser(userData, createdBy);
            
            res.status(201).json({
                message: 'User created successfully',
                data: newUser
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // PATCH /users/:id - Update user (admin only)
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedBy = req.user.id;

            const updatedUser = await UserService.updateUser(id, updateData, updatedBy);
            
            res.status(200).json({
                message: 'User updated successfully',
                data: updatedUser
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // DELETE /users/:id - Delete user (admin only)
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            
            if (parseInt(id) === req.user.id) {
                return res.status(400).json({ 
                    error: 'Cannot delete your own account' 
                });
            }

            const result = await UserService.deleteUser(id);
            
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // POST /users/:id/reset-password - Reset user password (admin only)
    async resetUserPassword(req, res) {
        try {
            const { id } = req.params;
            const { newPassword } = req.body;

            if (!newPassword) {
                return res.status(400).json({ 
                    error: 'New password is required' 
                });
            }

            await UserService.resetUserPassword(id, newPassword);
            
            res.status(200).json({
                message: 'Password reset successfully'
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }
}

module.exports = new UserProfileController();
