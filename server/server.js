const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('./users');
require('dotenv').config();

const spotifyController = require('./controllers/spotifyController');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Token required' });
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'your-secret-key', (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ error: 'Invalid password' });
    }
    
    const token = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET
    );
    
    res.json({ accessToken: token });
});

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello ${req.user.username}, you accessed a protected route!` });
});

app.get('/api/artists', spotifyController.getArtists);
app.get('/api/songs', spotifyController.getSongs);
app.get('/api/albums', spotifyController.getAlbums);
app.get('/api/artists/:id', spotifyController.getArtistById);
app.get('/api/albums/:id', spotifyController.getAlbumById);
app.get('/api/songs/:id', spotifyController.getSongById);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 