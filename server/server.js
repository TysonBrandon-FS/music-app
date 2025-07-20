require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const spotifyController = require('./controllers/spotifyController');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/artists', spotifyController.getArtists);
app.get('/api/songs', spotifyController.getSongs);
app.get('/api/albums', spotifyController.getAlbums);
app.get('/api/artists/:id', spotifyController.getArtistById);
app.get('/api/albums/:id', spotifyController.getAlbumById);
app.get('/api/songs/:id', spotifyController.getSongById);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Spotify Auth: http://localhost:${PORT}/api/auth/login`);
    console.log(`Callback: http://localhost:${PORT}/api/auth/callback`);
}); 