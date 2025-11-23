// src/config/environment.js
require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Bitquery Configuration (kept private)
  bitquery: {
    // Primary key from env, plus fallbacks provided
    apiKeys: [
      process.env.BITQUERY_API_KEY,
      'ory_at_lOVqx_pZ5gRRH_pRdxHiyaASakBERKCxnjxmE9nmvIE.mOI084SbLYFaBmwgFASPO0sggBTZI063fDfOTGYm0qU',
      'ory_at_ZxirfqGZJw2yRWTsaNcwOlEHFwYGdsatSy2QPgJoqWU.QRw45WPyEZZITOpFYPx7trnejkIc4Ds9xrco0YgUGmE',
      'ory_at_eAr-OzxUy8QHNMvvcJ0QeExSB7HehXgkl0WwBU8KfJg.JW11SFPrnW49GZ4z3vIqU31R52z-fSgImZMoOqAZB6I'
    ].filter(Boolean),
    endpoint: process.env.BITQUERY_ENDPOINT || 'https://streaming.bitquery.io/graphql',
    timeout: 30000, // 30 seconds
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: (process.env.API_RATE_LIMIT_WINDOW || 15) * 60 * 1000, // minutes to ms
    maxRequests: process.env.API_RATE_LIMIT_MAX_REQUESTS || 100,
  },
  
  // API Configuration
  api: {
    prefix: '/api/v1',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:5173'],
  },
};

// Validate required environment variables
const validateConfig = () => {
  const required = ['BITQUERY_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

validateConfig();

module.exports = config;