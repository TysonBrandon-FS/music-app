const spotifyService = require('../services/spotifyService');

async function getArtists(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    
    const data = await spotifyService.spotifyRequest(`/search?q=${encodeURIComponent(q)}&type=artist&limit=20`);
    res.json(data.artists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
}

async function getSongs(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    
    const data = await spotifyService.spotifyRequest(`/search?q=${encodeURIComponent(q)}&type=track&limit=20`);
    res.json(data.tracks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
}

async function getAlbums(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    
    const data = await spotifyService.spotifyRequest(`/search?q=${encodeURIComponent(q)}&type=album&limit=20`);
    res.json(data.albums);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
}

async function getArtistById(req, res) {
  try {
    const { id } = req.params;
    const data = await spotifyService.spotifyRequest(`/artists/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch artist details' });
  }
}

async function getAlbumById(req, res) {
  try {
    const { id } = req.params;
    const data = await spotifyService.spotifyRequest(`/albums/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch album details' });
  }
}

async function getSongById(req, res) {
  try {
    const { id } = req.params;
    const data = await spotifyService.spotifyRequest(`/tracks/${id}`);
    res.json(data);
  } catch (error) {
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