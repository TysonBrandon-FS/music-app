const jwt = require('jsonwebtoken');
const spotifyAuthService = require('../services/spotifyAuthService');
const User = require('../models/User');

function generateJWT(userId) {
    return jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
}

async function getLoginUrl(req, res) {
    try {
        const authUrl = spotifyAuthService.getAuthUrl();
        res.json({ authUrl });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate auth URL' });
    }
}

async function handleCallback(req, res) {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.status(400).json({ error: 'Authorization code required' });
        }

        const tokens = await spotifyAuthService.exchangeCodeForTokens(code);
        const spotifyProfile = await spotifyAuthService.getUserProfile(tokens.accessToken);
        
        const tokenExpiresAt = new Date(Date.now() + tokens.expiresIn * 1000);
        
        const userData = {
            spotifyId: spotifyProfile.id,
            displayName: spotifyProfile.display_name,
            email: spotifyProfile.email,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            tokenExpiresAt: tokenExpiresAt
        };

        const user = await User.findOneAndUpdate(
            { spotifyId: spotifyProfile.id },
            userData,
            { new: true, upsert: true }
        );

        const jwtToken = generateJWT(user._id);
        
        res.json({ 
            message: 'Spotify authentication successful',
            token: jwtToken,
            user: {
                id: user._id,
                spotifyId: user.spotifyId,
                displayName: user.displayName,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('Callback error:', error.message);
        res.status(500).json({ error: 'Authentication failed' });
    }
}

async function refreshToken(req, res) {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isTokenExpired() || user.isTokenExpiringSoon()) {
            const newTokens = await spotifyAuthService.refreshAccessToken(user.refreshToken);
            const tokenExpiresAt = new Date(Date.now() + newTokens.expiresIn * 1000);

            user.accessToken = newTokens.accessToken;
            user.refreshToken = newTokens.refreshToken;
            user.tokenExpiresAt = tokenExpiresAt;
            await user.save();
        }

        const newJWT = generateJWT(user._id);
        
        res.json({ 
            token: newJWT,
            message: 'Token refreshed successfully' 
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to refresh token' });
    }
}

async function checkAuthStatus(req, res) {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.json({ 
                isAuthenticated: false,
                needsLogin: true 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ 
                isAuthenticated: false,
                needsLogin: true 
            });
        }

        if (user.isTokenExpired()) {
            return res.json({ 
                isAuthenticated: false,
                needsLogin: true 
            });
        }

        return res.json({
            isAuthenticated: true,
            needsLogin: false
        });
        
    } catch (error) {
        res.json({
            isAuthenticated: false,
            needsLogin: true
        });
    }
}

module.exports = {
    getLoginUrl,
    handleCallback,
    refreshToken,
    checkAuthStatus
}; 