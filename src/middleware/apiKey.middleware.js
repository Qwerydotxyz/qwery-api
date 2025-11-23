// src/middleware/apiKey.middleware.js
const crypto = require('crypto');
const prisma = require('../utils/prisma');

/**
 * Hash API key for comparison
 */
const hashApiKey = (apiKey) => {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
};

/**
 * Middleware to validate API key for Solana API endpoints
 */
const validateApiKey = async (req, res, next) => {
  try {
    // Get API key from header
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'API_KEY_REQUIRED',
          message: 'API key is required. Get your API key from the dashboard.'
        }
      });
    }

    // Hash the provided API key
    const keyHash = hashApiKey(apiKey);

    // Find API key in database
    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { keyHash },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            planType: true,
            isActive: true
          }
        }
      }
    });

    if (!apiKeyRecord) {
      return res.status(401).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'INVALID_API_KEY',
          message: 'Invalid API key'
        }
      });
    }

    // Check if API key is active
    if (!apiKeyRecord.isActive) {
      return res.status(403).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'API_KEY_INACTIVE',
          message: 'API key has been deactivated'
        }
      });
    }

    // Check if API key is expired
    if (apiKeyRecord.expiresAt && new Date() > apiKeyRecord.expiresAt) {
      return res.status(403).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'API_KEY_EXPIRED',
          message: 'API key has expired'
        }
      });
    }

    // Check if user account is active
    if (!apiKeyRecord.user.isActive) {
      return res.status(403).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'User account is inactive'
        }
      });
    }

    // Check rate limit (simple hourly check)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const usageCount = await prisma.usageLog.count({
      where: {
        apiKeyId: apiKeyRecord.id,
        timestamp: {
          gte: oneHourAgo
        }
      }
    });

    if (usageCount >= apiKeyRecord.rateLimit) {
      return res.status(429).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Rate limit exceeded. Limit: ${apiKeyRecord.rateLimit} requests per hour`
        }
      });
    }

    // Attach API key and user info to request
    req.apiKey = apiKeyRecord;
    req.apiUser = apiKeyRecord.user;

    // Update last used timestamp (async, don't wait)
    prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() }
    }).catch(err => console.error('Error updating lastUsedAt:', err));

    next();
  } catch (error) {
    console.error('API key validation error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        code: 'INTERNAL_ERROR',
        message: 'API key validation failed'
      }
    });
  }
};

/**
 * Middleware to log API usage
 */
const logApiUsage = async (req, res, next) => {
  const startTime = Date.now();

  // Override res.json to capture response
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    const responseTime = Date.now() - startTime;

    // Log usage asynchronously
    if (req.apiKey && req.apiUser) {
      prisma.usageLog.create({
        data: {
          userId: req.apiUser.id,
          apiKeyId: req.apiKey.id,
          endpoint: req.path,
          method: req.method,
          statusCode: res.statusCode,
          responseTime,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('user-agent')
        }
      }).catch(err => console.error('Error logging usage:', err));
    }

    return originalJson(body);
  };

  next();
};

module.exports = {
  validateApiKey,
  logApiUsage,
  hashApiKey
};
