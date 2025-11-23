// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

/**
 * Middleware to verify JWT token and attach user to request
 */
const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'UNAUTHORIZED',
          message: 'No token provided'
        }
      });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        planType: true,
        isActive: true
      }
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not found'
        }
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'FORBIDDEN',
          message: 'Account is inactive'
        }
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid token'
        }
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token expired'
        }
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Authentication failed'
      }
    });
  }
};

module.exports = { authenticateUser };
