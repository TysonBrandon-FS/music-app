import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import MusicScreen from './components/MusicScreen';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const userId = localStorage.getItem('userId');

      if (!jwtToken || !userId) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/auth/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      
      if (data.isAuthenticated) {
        setIsAuthenticated(true);
        setUserData({ userId, jwtToken });
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userId');
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      setIsAuthenticated(false);
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userId');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (token, user) => {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userId', user.id);
    setUserData({ userId: user.id, jwtToken: token });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserData(null);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? (
                  <LoginScreen onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <MusicScreen userData={userData} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 