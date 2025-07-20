const axios = require('axios');

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

function getAuthUrl() {
    const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        response_type: 'code',
        redirect_uri: process.env.REDIRECT_URI || 'http://localhost:3001/callback',
    });

    return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

async function exchangeCodeForTokens(code) {
    try {
        const response = await axios.post(SPOTIFY_TOKEN_URL, 
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.REDIRECT_URI || 'http://localhost:3001/callback'
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')}`
                }
            }
        );

        return {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiresIn: response.data.expires_in
        };
    } catch (error) {
        console.error('Error exchanging code for tokens:', error.message);
        throw error;
    }
}

async function refreshAccessToken(refreshToken) {
    try {
        const response = await axios.post(SPOTIFY_TOKEN_URL,
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')}`
                }
            }
        );

        return {
            accessToken: response.data.access_token,
            expiresIn: response.data.expires_in,
            refreshToken: response.data.refresh_token || refreshToken
        };
    } catch (error) {
        console.error('Error refreshing token:', error.message);
        throw error;
    }
}

async function getUserProfile(accessToken) {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting user profile:', error.message);
        throw error;
    }
}

module.exports = {
    getAuthUrl,
    exchangeCodeForTokens,
    refreshAccessToken,
    getUserProfile
}; 