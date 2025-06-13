// Authentication routes
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User email or username
 *         password:
 *           type: string
 *           description: User password
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refresh_token
 *       properties:
 *         refresh_token:
 *           type: string
 *     RefreshTokenResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and issue access and refresh tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad request - missing credentials
 *       401:
 *         description: Unauthorized - invalid credentials
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Generate new access token using refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *       400:
 *         description: Bad request - missing refresh token
 *       401:
 *         description: Unauthorized - invalid refresh token
 */
router.post('/refresh', AuthController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Revoke refresh token and logout user
 *     tags: [Authentication]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 */
router.post('/logout', AuthController.logout);

module.exports = router;
