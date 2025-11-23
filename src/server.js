// src/server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config/environment');
const { errorMiddleware, notFoundHandler } = require('./utils/errorHandler');
const apiRoutes = require('./routes/api.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const authRoutes = require('./routes/auth.routes');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.api.corsOrigins,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    status: 'error',
    timestamp: new Date().toISOString(),
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    data: {
      service: 'Solana API',
      version: '1.0.0',
      uptime: process.uptime(),
      environment: config.nodeEnv
    }
  });
});

// API routes
app.use(config.api.prefix, apiRoutes);

// Dashboard routes
app.use('/api/v1/dashboard', dashboardRoutes);

// Auth routes (wallet authentication)
app.use('/api/v1/auth', authRoutes);

// Note: Frontend is now served separately via Next.js on port 3001
// Old Svelte dashboard has been removed - see dashboard-nextjs folder

// 404 handler (for API routes that don't exist)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║         🚀 Solana API Server Running                 ║
║                                                       ║
║         Port: ${PORT}                                    ║
║         Environment: ${config.nodeEnv}                        ║
║         API Prefix: ${config.api.prefix}                    ║
║                                                       ║
║         📊 Dashboard Endpoints:                       ║
║         - POST /api/v1/dashboard/auth/register       ║
║         - POST /api/v1/dashboard/auth/login          ║
║         - GET  /api/v1/dashboard/auth/me             ║
║         - POST /api/v1/dashboard/api-keys            ║
║         - GET  /api/v1/dashboard/api-keys            ║
║         - GET  /api/v1/dashboard/usage/stats         ║
║                                                       ║
║         🔌 Solana Endpoints:                          ║
║         - POST /api/v1/token-price                   ║
║         - POST /api/v1/wallet-trades                 ║
║         - POST /api/v1/balance-updates               ║
║         - POST /api/v1/token-metadata                ║
║         - POST /api/v1/top-holders                   ║
║         - POST /api/v1/latest-trades                 ║
║         - POST /api/v1/trades-by-wallet              ║
║         - POST /api/v1/bonding-curve                 ║
║         - POST /api/v1/top-pumpfun-tokens            ║
║         - POST /api/v1/letsbonk-bonding-curve        ║
║         - POST /api/v1/letsbonk-above-95             ║
║         - POST /api/v1/letsbonk-top-graduating       ║
║         - POST /api/v1/raydium-bonding-curve         ║
║         - POST /api/v1/raydium-above-95              ║
║         - POST /api/v1/raydium-top-graduating        ║
║         - POST /api/v1/raydium-graduated             ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;