const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Authenticate or create user with Solana wallet
 * @route POST /api/v1/auth/wallet
 */
const authenticateWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        status: 'error',
        error: {
          code: 'WALLET_ADDRESS_REQUIRED',
          message: 'Wallet address is required',
        },
      });
    }

    // Check if user exists with this wallet address
    let user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        apiKeys: {
          where: { isActive: true },
          select: {
            id: true,
            keyPrefix: true,
            name: true,
            createdAt: true,
            lastUsedAt: true,
            _count: {
              select: { usageLogs: true },
            },
          },
        },
      },
    });

    // Create new user if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress,
          name: `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`,
          planType: 'free',
          isActive: true,
        },
        include: {
          apiKeys: {
            where: { isActive: true },
            select: {
              id: true,
              keyPrefix: true,
              name: true,
              createdAt: true,
              lastUsedAt: true,
              _count: {
                select: { usageLogs: true },
              },
            },
          },
        },
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          name: user.name,
          planType: user.planType,
        },
        apiKeys: user.apiKeys.map((key) => ({
          id: key.id,
          keyPrefix: key.keyPrefix,
          name: key.name,
          createdAt: key.createdAt,
          lastUsedAt: key.lastUsedAt,
          requestCount: key._count.usageLogs,
        })),
      },
    });
  } catch (error) {
    console.error('Wallet authentication error:', error);
    return res.status(500).json({
      status: 'error',
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to authenticate wallet',
      },
    });
  }
};

/**
 * Get user profile by wallet address
 * @route GET /api/v1/auth/profile/:walletAddress
 */
const getUserProfile = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      select: {
        id: true,
        walletAddress: true,
        name: true,
        planType: true,
        createdAt: true,
        _count: {
          select: {
            apiKeys: true,
            usageLogs: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          name: user.name,
          planType: user.planType,
          createdAt: user.createdAt,
          apiKeyCount: user._count.apiKeys,
          totalRequests: user._count.usageLogs,
        },
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      status: 'error',
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get user profile',
      },
    });
  }
};

module.exports = {
  authenticateWallet,
  getUserProfile,
};
