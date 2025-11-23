// src/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');
const apiKeyController = require('../controllers/apiKeyManagement.controller');
const usageController = require('../controllers/usage.controller');

// ===== Authentication Routes (Public) =====
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// ===== Protected Routes (Require JWT) =====
// Auth
router.get('/auth/me', authenticateUser, authController.getProfile);

// API Key Management (No auth required for demo)
router.post('/api-keys', apiKeyController.createApiKey);
router.get('/api-keys', apiKeyController.getApiKeys);
router.patch('/api-keys/:id', apiKeyController.updateApiKey);
router.delete('/api-keys/:id', apiKeyController.deleteApiKey);
router.get('/api-keys/:id/usage', apiKeyController.getApiKeyUsage);

// Usage Analytics
router.get('/usage/stats', authenticateUser, usageController.getUsageStats);
router.get('/usage/recent', authenticateUser, usageController.getRecentRequests);
router.get('/usage/rate-limits', authenticateUser, usageController.getRateLimitStatus);

module.exports = router;
