const express = require('express');
const router = express.Router();
const spotifyAuthController = require('../controllers/spotifyAuthController');

router.get('/login', spotifyAuthController.getLoginUrl);
router.get('/callback', spotifyAuthController.handleCallback);
router.post('/refresh', spotifyAuthController.refreshToken);
router.post('/status', spotifyAuthController.checkAuthStatus);

module.exports = router; 