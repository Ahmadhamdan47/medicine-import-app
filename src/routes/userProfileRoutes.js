// Enhanced User routes for profile management
const express = require('express');
const router = express.Router();
const UserProfileController = require('../controllers/userProfileController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         agentId:
 *           type: integer
 *         donorId:
 *           type: integer
 *         recipientId:
 *           type: integer
 *         createdDate:
 *           type: string
 *           format: date-time
 *         lastLogin:
 *           type: string
 *           format: date-time
 *     UpdateProfile:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         username:
 *           type: string
 *     ChangePassword:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *         newPassword:
 *           type: string
 *     CreateUser:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - roleId
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         roleId:
 *           type: integer
 *         agentId:
 *           type: integer
 *         donorId:
 *           type: integer
 *         recipientId:
 *           type: integer
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     description: Get the profile of the currently authenticated user
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       404:
 *         description: User not found
 *   patch:
 *     summary: Update current user profile
 *     description: Update the profile of the currently authenticated user
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Bad request
 */
router.get('/me', authenticateToken, UserProfileController.getCurrentUserProfile);
router.patch('/me', authenticateToken, UserProfileController.updateCurrentUserProfile);

/**
 * @swagger
 * /users/me/change-password:
 *   post:
 *     summary: Change user password
 *     description: Change the password of the currently authenticated user
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - invalid current password or missing fields
 */
router.post('/me/change-password', authenticateToken, UserProfileController.changePassword);

// Admin routes for user management

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Get all users with filtering and pagination (admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserProfile'
 *                 totalCount:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       403:
 *         description: Access denied
 *   post:
 *     summary: Create new user
 *     description: Create a new user account (admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 */
router.get('/', authenticateToken, authorizeRoles('admin'), UserProfileController.getAllUsers);
router.post('/', authenticateToken, authorizeRoles('admin'), UserProfileController.createUser);

// Add alias routes for backward compatibility with tests (must come before /:id routes)
router.get('/profile', authenticateToken, UserProfileController.getCurrentUserProfile);
router.put('/profile', authenticateToken, UserProfileController.updateCurrentUserProfile);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Get user profile by ID (admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 *   patch:
 *     summary: Update user
 *     description: Update user profile (admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 *   delete:
 *     summary: Delete user
 *     description: Delete a user account (admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Bad request - cannot delete own account
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticateToken, authorizeRoles('admin'), UserProfileController.getUserById);
router.patch('/:id', authenticateToken, authorizeRoles('admin'), UserProfileController.updateUser);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), UserProfileController.deleteUser);

/**
 * @swagger
 * /users/{id}/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Reset password for a specific user (admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */
router.post('/:id/reset-password', authenticateToken, authorizeRoles('admin'), UserProfileController.resetUserPassword);

module.exports = router;
