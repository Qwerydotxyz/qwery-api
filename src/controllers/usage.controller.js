// src/controllers/usage.controller.js
const prisma = require('../utils/prisma');

/**
 * Get overall usage statistics for user
 * GET /api/v1/dashboard/usage/stats
 */
const getUsageStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;
    const daysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get total requests
    const totalRequests = await prisma.usageLog.count({
      where: {
        userId,
        timestamp: {
          gte: daysAgo
        }
      }
    });

    // Get requests by status code
    const requestsByStatus = await prisma.usageLog.groupBy({
      by: ['statusCode'],
      where: {
        userId,
        timestamp: {
          gte: daysAgo
        }
      },
      _count: {
        id: true
      }
    });

    // Get requests by endpoint
    const requestsByEndpoint = await prisma.usageLog.groupBy({
      by: ['endpoint'],
      where: {
        userId,
        timestamp: {
          gte: daysAgo
        }
      },
      _count: {
        id: true
      },
      _avg: {
        responseTime: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    });

    // Get average response time
    const avgResponseTime = await prisma.usageLog.aggregate({
      where: {
        userId,
        timestamp: {
          gte: daysAgo
        }
      },
      _avg: {
        responseTime: true
      }
    });

    // Get daily usage
    const dailyUsage = await prisma.$queryRaw`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*)::int as requests,
        AVG("responseTime")::float as avg_response_time
      FROM usage_logs
      WHERE "userId" = ${userId}
        AND timestamp >= ${daysAgo}
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `;

    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        period: `Last ${days} days`,
        totalRequests,
        averageResponseTime: avgResponseTime._avg.responseTime || 0,
        requestsByStatus,
        topEndpoints: requestsByEndpoint,
        dailyUsage
      }
    });
  } catch (error) {
    console.error('Get usage stats error:', error);
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

/**
 * Get recent API requests
 * GET /api/v1/dashboard/usage/recent
 */
const getRecentRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50 } = req.query;

    const recentRequests = await prisma.usageLog.findMany({
      where: {
        userId
      },
      include: {
        apiKey: {
          select: {
            name: true,
            keyPrefix: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: parseInt(limit)
    });

    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: recentRequests
    });
  } catch (error) {
    console.error('Get recent requests error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch recent requests'
      }
    });
  }
};

/**
 * Get rate limit status for all user's API keys
 * GET /api/v1/dashboard/usage/rate-limits
 */
const getRateLimitStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Get all active API keys
    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        rateLimit: true
      }
    });

    // Get usage in last hour for each key
    const rateLimitStatus = await Promise.all(
      apiKeys.map(async (key) => {
        const requestsInLastHour = await prisma.usageLog.count({
          where: {
            apiKeyId: key.id,
            timestamp: {
              gte: oneHourAgo
            }
          }
        });

        const percentageUsed = (requestsInLastHour / key.rateLimit) * 100;

        return {
          keyId: key.id,
          keyName: key.name,
          keyPrefix: key.keyPrefix,
          rateLimit: key.rateLimit,
          requestsInLastHour,
          remaining: Math.max(0, key.rateLimit - requestsInLastHour),
          percentageUsed: Math.min(100, percentageUsed.toFixed(2)),
          resetTime: new Date(oneHourAgo.getTime() + 60 * 60 * 1000).toISOString()
        };
      })
    );

    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: rateLimitStatus
    });
  } catch (error) {
    console.error('Get rate limit status error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch rate limit status'
      }
    });
  }
};

module.exports = {
  getUsageStats,
  getRecentRequests,
  getRateLimitStatus
};
