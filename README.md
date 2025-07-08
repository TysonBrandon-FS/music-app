# Spotify Music App 

A App that connects to the Spotify API to fetch artists, songs, and albums.

## Setup

1. Install dependencies:

Node.js | v20.0.0
Express | v4.18.2
CORS | v2.8.5
Axios | v1.6.0
Dotenv | v16.3.1

```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

The server will start on port 3001.

## API Endpoints

### Search Endpoints
- `GET /api/artists?q=query` - Search for artists
- `GET /api/songs?q=query` - Search for songs/tracks
- `GET /api/albums?q=query` - Search for albums

### Detail Endpoints
- `GET /api/artists/:id` - Get artist details by ID
- `GET /api/albums/:id` - Get album details by ID
- `GET /api/songs/:id` - Get track details by ID

## Configuration

The Spotify Client ID is stored in `config.js`. Make sure your Spotify app is properly configured in the Spotify Developer Dashboard. 