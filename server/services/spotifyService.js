const axios = require('axios');
const config = require('../config');

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Get access token from Spotify
async function getAccessToken() {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(config.CLIENT_ID + ':' + config.CLIENT_SECRET).toString('base64')}`
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.message);
    throw error;
  }
}

//
async function spotifyRequest(endpoint) {
  try {
    const token = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Spotify API error:', error.message);
    throw error;
  }
}

module.exports = {
  getAccessToken,
  spotifyRequest
}; 