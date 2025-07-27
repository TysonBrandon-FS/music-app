import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginScreen.css';

const LoginScreen = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const handleCallback = useCallback(async (code) => {
    try {
      // Use the backend callback endpoint directly
      const response = await fetch(`http://localhost:3001/api/auth/callback?code=${code}`);
      const data = await response.json();
      
      if (data.token) {
        onLoginSuccess(data.token, data.user);
        // Clean up URL and redirect to home
        window.history.replaceState({}, document.title, '/');
        navigate('/', { replace: true });
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  }, [onLoginSuccess, navigate]);

  useEffect(() => {
    // Handle OAuth callback if we're returning from Spotify
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    const displayName = urlParams.get('displayName');
    const error = urlParams.get('error');
    
    if (error === 'auth_failed') {
      alert('Authentication failed. Please try again.');
      // Clean up URL
      window.history.replaceState({}, document.title, '/login');
      return;
    }
    
    if (token && userId) {
      // Handle redirect from server with token
      const user = {
        id: userId,
        displayName: displayName ? decodeURIComponent(displayName) : 'User'
      };
      onLoginSuccess(token, user);
      // Clean up URL and redirect to home
      window.history.replaceState({}, document.title, '/');
      navigate('/', { replace: true });
      return;
    }
    
    if (code) {
      handleCallback(code);
    }
  }, [handleCallback, onLoginSuccess, navigate]);

  const initiateSpotifyLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login');
      const data = await response.json();
      
      // Redirect to Spotify OAuth
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Failed to get login URL:', error);
      alert('Failed to initiate login. Please try again.');
    }
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="spotify-logo-large">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </div>
        <h1 className="login-title">Please Sign In</h1>
        <p className="login-subtitle">
          In order to search for artists, tracks, or songs you must login to your Spotify account
        </p>
        <button className="login-button" onClick={initiateSpotifyLogin}>
          Sign In
        </button>
      </div>
    </div>
  );
};

export default LoginScreen; 