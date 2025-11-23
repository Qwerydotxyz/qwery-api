const express = require('express');
const router = express.Router();
const { authenticateWallet, getUserProfile } = require('../controllers/walletAuth.controller');

// POST /api/v1/auth/wallet - Authenticate or create user with wallet
router.post('/wallet', authenticateWallet);

// GET /api/v1/auth/profile/:walletAddress - Get user profile
router.get('/profile/:walletAddress', getUserProfile);

module.exports = router;
