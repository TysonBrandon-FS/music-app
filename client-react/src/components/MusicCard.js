import React from 'react';
import '../styles/MusicCard.css';

const MusicCard = ({ track }) => {
  return (
    <div className="music-card">
      <div className="music-card-header">
        <img 
          src={track.albumArt} 
          alt={track.name} 
          className="album-art"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/60x60/666666/ffffff?text=No+Image';
          }}
        />
        <div className="music-info">
          <div className="song-name">{track.name}</div>
          <div className="artist-name">{track.artist}</div>
          <div className="album-name">{track.album}</div>
        </div>
      </div>
      <div className="music-details">
        <div className="release-year">{track.releaseYear}</div>
        <div className="duration">{track.duration}</div>
      </div>
    </div>
  );
};

export default MusicCard; 