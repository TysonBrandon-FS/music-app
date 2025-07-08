require('dotenv').config();
const express = require('express');
const cors = require('cors');
const spotifyController = require('./controllers/spotifyController');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


app.get('/api/artists', spotifyController.getArtists);
app.get('/api/songs', spotifyController.getSongs);
app.get('/api/albums', spotifyController.getAlbums);
app.get('/api/artists/:id', spotifyController.getArtistById);
app.get('/api/albums/:id', spotifyController.getAlbumById);
app.get('/api/songs/:id', spotifyController.getSongById);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 