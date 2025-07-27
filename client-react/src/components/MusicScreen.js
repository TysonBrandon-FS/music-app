import React, { useState, useEffect } from 'react';
import MusicCard from './MusicCard';
import '../styles/MusicScreen.css';

const MusicScreen = ({ userData }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Listen for search events from the header
    const handleSearch = (event) => {
      performSearch(event.detail.query);
    };

    window.addEventListener('performSearch', handleSearch);
    return () => window.removeEventListener('performSearch', handleSearch);
  }, []);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(`http://localhost:3001/api/songs?q=${encodeURIComponent(query)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userData.userId })
      });
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        setSearchResults(data.items);
      } else {
        setSearchResults([]);
        setError('No results found. Try a different search term.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const createTrackData = (track) => {
    return {
      id: track.id,
      name: track.name,
      artist: track.artists?.[0]?.name || 'Unknown Artist',
      album: track.album?.name || 'Solo Song',
      releaseYear: track.album?.release_date 
        ? new Date(track.album.release_date).getFullYear() 
        : 'Unknown',
      duration: formatDuration(track.duration_ms),
      albumArt: track.album?.images?.[0]?.url || 'https://via.placeholder.com/60x60/666666/ffffff?text=No+Image'
    };
  };

  return (
    <div className="music-screen">
      <div className="welcome-message">
        <h2>Searched music displayed here</h2>
      </div>
      
      {isLoading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <div>Searching...</div>
        </div>
      )}
      
      {error && !isLoading && (
        <div className="error-message">{error}</div>
      )}
      
      {!isLoading && !error && hasSearched && searchResults.length === 0 && (
        <div className="error-message">No results found. Try a different search term.</div>
      )}
      
      {!isLoading && !error && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map(track => (
            <MusicCard 
              key={track.id} 
              track={createTrackData(track)} 
            />
          ))}
        </div>
      )}
      
      {!hasSearched && !isLoading && (
        <div className="initial-message">
          <p>Type in the search bar above to find your favorite music!</p>
        </div>
      )}
    </div>
  );
};

export default MusicScreen; 