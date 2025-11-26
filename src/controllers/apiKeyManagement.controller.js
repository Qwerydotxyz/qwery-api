// src/controllers/apiKeyManagement.controller.js
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../utils/prisma');
const { hashApiKey } = require('../middleware/apiKey.middleware');

/**
 * Generate a random API key with qwery_ prefix
 */
const generateApiKey = () => {
  const prefix = 'qwery_';
  const randomPart = crypto.randomBytes(26).toString('hex').substring(0, 26);
  return `${prefix}${randomPart}`;
};

/**
 * Get rate limit based on plan type (requests per hour)
 */
const getRateLimitForPlan = (planType) => {
  const limits = {
    free: 10000,      // 10k requests/hour
    pro: 100000,      // 100k requests/hour
    enterprise: 1000000 // 1M requests/hour
  };
  return limits[planType] || 10000;
};

/**
 * Create new API key
 * POST /api/v1/dashboard/api-keys
 */
const createApiKey = async (req, res) => {
  try {
    const { name, walletAddress } = req.body;
    
    // Get user ID - prefer wallet address lookup, then auth, then guest
    let userId = req.user?.id || 'guest-user-id';
    let planType = req.user?.planType || 'free';
    
    // If wallet address provided, find the user by wallet
    if (walletAddress) {
      const user = await prisma.user.findUnique({
        where: { walletAddress },
        select: { id: true, planType: true }
      });
      
      if (user) {
        userId = user.id;
        planType = user.planType;
        console.log('✅ Found user by wallet:', walletAddress, '-> userId:', userId);
      } else {
        console.warn('⚠️ User not found for wallet:', walletAddress);
      }
    }

    // Check how many active keys user has
    const activeKeysCount = await prisma.apiKey.count({
      where: {
        userId,
        isActive: true
      }
    });

    // Limit based on plan (free: 100, pro: 500, enterprise: unlimited)
    const keyLimits = {
      free: 100,
      pro: 500,
      enterprise: 9999
    };

    const limit = keyLimits[planType] || 10;

    if (activeKeysCount >= limit) {
      return res.status(403).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'KEY_LIMIT_REACHED',
          message: `Maximum API keys limit reached for ${planType} plan (${limit} keys)`
        }
      });
    }

    // Generate API key with qwery_ prefix
    const apiKey = generateApiKey();
    const keyHash = hashApiKey(apiKey);
    const keyPrefix = apiKey.substring(0, 13) + '...'; // qwery_abc...

    // Get rate limit for user's plan
    const rateLimit = getRateLimitForPlan(planType);

    // Create API key in database
    const newApiKey = await prisma.apiKey.create({
      data: {
        userId,
        keyHash,
        keyPrefix,
        name: name || 'My API Key',
        rateLimit,
        isActive: true
      },
      select: {
        id: true,
        keyPrefix: true,
        name: true,
        isActive: true,
        rateLimit: true,
        createdAt: true,
        expiresAt: true,
        lastUsedAt: true
      }
    });

    res.status(201).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        ...newApiKey,
        apiKey: apiKey, // Only shown once!
        message: 'Save this API key securely. It will not be shown again.'
      }
    });
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create API key',
        details: error.message
      }
    });
  }
};

/**
 * Get all API keys for current user
 * GET /api/v1/dashboard/api-keys
 */
const getApiKeys = async (req, res) => {
  try {
    const userId = req.user?.id || 'guest-user-id';
    
    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId
      },
      select: {
        id: true,
        keyPrefix: true,
        name: true,
        isActive: true,
        rateLimit: true,
        createdAt: true,
        expiresAt: true,
        lastUsedAt: true,
        _count: {
          select: {
            usageLogs: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: apiKeys
    });
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch API keys'
      }
    });
  }
};

/**
 * Update API key
 * PATCH /api/v1/dashboard/api-keys/:id
 */
const updateApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;
    const userId = req.user?.id || 'guest-user-id';

    // Check if API key belongs to user
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: String(id),
        userId
      }
    });

    if (!apiKey) {
      return res.status(404).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'NOT_FOUND',
          message: 'API key not found'
        }
      });
    }

    // Update API key
    const updatedKey = await prisma.apiKey.update({
      where: { id: String(id) },
      data: {
        ...(name && { name }),
        ...(typeof isActive === 'boolean' && { isActive })
      },
      select: {
        id: true,
        keyPrefix: true,
        name: true,
        isActive: true,
        rateLimit: true,
        createdAt: true,
        expiresAt: true,
        lastUsedAt: true
      }
    });

    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: updatedKey
    });
  } catch (error) {
    console.error('Update API key error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update API key',
        details: error.message
      }
    });
  }
};

/**
 * Delete API key
 * DELETE /api/v1/dashboard/api-keys/:id
 */
const deleteApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const { walletAddress } = req.query;
    
    let userId = req.user?.id || 'guest-user-id';
    
    // If wallet address provided, find the user by wallet
    if (walletAddress) {
      const user = await prisma.user.findUnique({
        where: { walletAddress },
        select: { id: true }
      });
      
      if (user) {
        userId = user.id;
        console.log('✅ Delete: Found user by wallet:', walletAddress, '-> userId:', userId);
      }
    }

    // Check if API key belongs to user
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: String(id), // Ensure id is a string (UUIDs are strings in the schema)
        userId
      }
    });

    if (!apiKey) {
      return res.status(404).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'NOT_FOUND',
          message: 'API key not found'
        }
      });
    }

    // Delete API key
    await prisma.apiKey.delete({
      where: { id: String(id) }
    });

    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        message: 'API key deleted successfully'
      }
    });
  } catch (error) {
    console.error('Delete API key error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete API key',
        details: error.message
      }
    });
  }
};

/**
 * Get API key usage statistics
 * GET /api/v1/dashboard/api-keys/:id/usage
 */
const getApiKeyUsage = async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 7 } = req.query;

    // Check if API key belongs to user
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: String(id),
        userId: req.user.id
      }
    });

    if (!apiKey) {
      return res.status(404).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'NOT_FOUND',
          message: 'API key not found'
        }
      });
    }

    const daysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get usage statistics
    const usageLogs = await prisma.usageLog.groupBy({
      by: ['endpoint'],
      where: {
        apiKeyId: String(id),
        timestamp: {
          gte: daysAgo
        }
      },
      _count: {
        id: true
      },
      _avg: {
        responseTime: true
      }
    });

    // Get total requests
    const totalRequests = await prisma.usageLog.count({
      where: {
        apiKeyId: id,
        timestamp: {
          gte: daysAgo
        }
      }
    });

    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        totalRequests,
        rateLimit: apiKey.rateLimit,
        usageByEndpoint: usageLogs,
        period: `Last ${days} days`
      }
    });
  } catch (error) {
    console.error('Get API key usage error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch usage statistics'
      }
    });
  }
};

module.exports = {
  createApiKey,
  getApiKeys,
  updateApiKey,
  deleteApiKey,
  getApiKeyUsage
};
