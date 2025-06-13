// Authentication service
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserAccounts = require('../models/userAccounts');
const Roles = require('../models/roles');
const { Op } = require('sequelize');

class AuthService {
    // Login user and issue tokens
    async login(email, password) {
        try {
            // Find user by email or username
            const user = await UserAccounts.findOne({
                where: {
                    [Op.or]: [
                        { Email: email },
                        { Username: email }
                    ]
                },
                include: [{
                    model: Roles,
                    as: 'role'
                }]
            });

            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.PasswordHash);
            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }

            // Generate tokens
            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);

            // Store refresh token (in production, you might want to store this in Redis or database)
            // For now, we'll include it in the response
            
            return {
                accessToken,
                refreshToken,
                user: {
                    id: user.UserId,
                    username: user.Username,
                    email: user.Email,
                    role: user.role ? user.role.RoleName : null,
                    agentId: user.AgentId,
                    donorId: user.DonorId,
                    recipientId: user.RecipientId
                }
            };
        } catch (error) {
            throw new Error(`Login failed: ${error.message}`);
        }
    }

    // Refresh access token
    async refreshToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
            
            const user = await UserAccounts.findByPk(decoded.id, {
                include: [{
                    model: Roles,
                    as: 'role'
                }]
            });

            if (!user) {
                throw new Error('Invalid refresh token');
            }

            // Generate new access token
            const accessToken = this.generateAccessToken(user);
            const newRefreshToken = this.generateRefreshToken(user);

            return {
                accessToken,
                refreshToken: newRefreshToken
            };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    // Logout (revoke refresh token)
    async logout(refreshToken) {
        try {
            // In a production environment, you would typically:
            // 1. Add the refresh token to a blacklist/revoked tokens table
            // 2. Or remove it from the stored refresh tokens
            // For now, we'll just return success
            return { message: 'Logout successful' };
        } catch (error) {
            throw new Error('Logout failed');
        }
    }

    // Generate access token (short-lived)
    generateAccessToken(user) {
        return jwt.sign(
            {
                id: user.UserId,
                email: user.Email,
                roleId: user.RoleId,
                agentId: user.AgentId
            },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '15m' } // 15 minutes
        );
    }

    // Generate refresh token (long-lived)
    generateRefreshToken(user) {
        return jwt.sign(
            {
                id: user.UserId,
                email: user.Email
            },
            process.env.JWT_REFRESH_SECRET || 'refresh_secret',
            { expiresIn: '7d' } // 7 days
        );
    }
}

module.exports = new AuthService();
