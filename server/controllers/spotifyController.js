const axios = require('axios');
const User = require('../models/User');

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

async function getUserAccessToken(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        if (user.isTokenExpired()) {
            throw new Error('Token expired');
        }
        
        return user.accessToken;
    } catch (error) {
        console.error('Error getting user access token:', error.message);
        throw error;
    }
}

async function spotifyRequestWithUserToken(endpoint, userId) {
    try {
        const accessToken = await getUserAccessToken(userId);
        const response = await axios.get(`${SPOTIFY_API_BASE}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Spotify API error:', error.message);
        throw error;
    }
}

async function getArtists(req, res) {
    try {
        const { q } = req.query;
        const { userId } = req.body;
        
        if (!q) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }
        
        if (!userId) {
            return res.status(401).json({ error: 'User ID required' });
        }
        
        const data = await spotifyRequestWithUserToken(`/search?q=${encodeURIComponent(q)}&type=artist&limit=20`, userId);
        res.json(data.artists);
    } catch (error) {
        console.error('Error fetching artists:', error.message);
        res.status(500).json({ error: 'Failed to fetch artists' });
    }
}

async function getSongs(req, res) {
    try {
        const { q } = req.query;
        const { userId } = req.body;
        
        if (!q) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }
        
        if (!userId) {
            return res.status(401).json({ error: 'User ID required' });
        }
        
        const data = await spotifyRequestWithUserToken(`/search?q=${encodeURIComponent(q)}&type=track&limit=20`, userId);
        res.json(data.tracks);
    } catch (error) {
        console.error('Error fetching songs:', error.message);
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
}

async function getAlbums(req, res) {
    try {
        const { q } = req.query;
        const { userId } = req.body;
        
        if (!q) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }
        
        if (!userId) {
            return res.status(401).json({ error: 'User ID required' });
        }
        
        const data = await spotifyRequestWithUserToken(`/search?q=${encodeURIComponent(q)}&type=album&limit=20`, userId);
        res.json(data.albums);
    } catch (error) {
        console.error('Error fetching albums:', error.message);
        res.status(500).json({ error: 'Failed to fetch albums' });
    }
}

async function getArtistById(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(401).json({ error: 'User ID required' });
        }
        
        const data = await spotifyRequestWithUserToken(`/artists/${id}`, userId);
        res.json(data);
    } catch (error) {
        console.error('Error fetching artist details:', error.message);
        res.status(500).json({ error: 'Failed to fetch artist details' });
    }
}

async function getAlbumById(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(401).json({ error: 'User ID required' });
        }
        
        const data = await spotifyRequestWithUserToken(`/albums/${id}`, userId);
        res.json(data);
    } catch (error) {
        console.error('Error fetching album details:', error.message);
        res.status(500).json({ error: 'Failed to fetch album details' });
    }
}

async function getSongById(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(401).json({ error: 'User ID required' });
        }
        
        const data = await spotifyRequestWithUserToken(`/tracks/${id}`, userId);
        res.json(data);
    } catch (error) {
        console.error('Error fetching track details:', error.message);
        res.status(500).json({ error: 'Failed to fetch track details' });
    }
}

module.exports = {
    getArtists,
    getSongs,
    getAlbums,
    getArtistById,
    getAlbumById,
    getSongById
}; 