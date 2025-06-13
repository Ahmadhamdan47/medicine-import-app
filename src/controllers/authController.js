// Authentication controller
const AuthService = require('../services/authService');

class AuthController {
    // POST /auth/login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ 
                    error: 'Email/username and password are required' 
                });
            }

            const result = await AuthService.login(email, password);
            
            res.status(200).json({
                message: 'Login successful',
                ...result
            });
        } catch (error) {
            res.status(401).json({ 
                error: error.message 
            });
        }
    }

    // POST /auth/refresh
    async refreshToken(req, res) {
        try {
            const { refresh_token } = req.body;

            if (!refresh_token) {
                return res.status(400).json({ 
                    error: 'Refresh token is required' 
                });
            }

            const result = await AuthService.refreshToken(refresh_token);
            
            res.status(200).json({
                message: 'Token refreshed successfully',
                ...result
            });
        } catch (error) {
            res.status(401).json({ 
                error: error.message 
            });
        }
    }

    // POST /auth/logout
    async logout(req, res) {
        try {
            const { refresh_token } = req.body;
            
            const result = await AuthService.logout(refresh_token);
            
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }
}

module.exports = new AuthController();
