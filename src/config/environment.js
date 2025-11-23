// src/config/environment.js
require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL,
  
  // BitQuery Configuration
  bitquery: {
    apiKeys: [
      process.env.BITQUERY_API_KEY_1,
      process.env.BITQUERY_API_KEY_2,
      process.env.BITQUERY_API_KEY_3,
      process.env.BITQUERY_API_KEY_4,
      process.env.BITQUERY_API_KEY, // Also support single key for backward compatibility
    ].filter(Boolean), // Remove undefined values
    endpoint: process.env.BITQUERY_ENDPOINT || 'https://streaming.bitquery.io/graphql',
    timeout: parseInt(process.env.BITQUERY_TIMEOUT || '30000', 10),
  },
  
  // API Configuration
  api: {
    corsOrigins: process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
      : ['http://localhost:3001', 'http://localhost:3000', 'https://qwery-api.vercel.app'],
    prefix: '/api/v1',
  },
  
  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW || '15', 10) * 60 * 1000, // Convert minutes to milliseconds
    maxRequests: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS (legacy - keeping for backward compatibility)
  corsOrigins: process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3001', 'http://localhost:3000'],
};

// Validate required environment variables
function validateConfig() {
  const required = [
    'DATABASE_URL',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  // Check if at least one BitQuery key exists
  if (config.bitquery.apiKeys.length === 0) {
    missing.push('BITQUERY_API_KEY (or BITQUERY_API_KEY_1, _2, _3, _4)');
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateConfig();

module.exports = config;