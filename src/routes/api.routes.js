// src/routes/api.routes.js
const express = require('express');
const { validate } = require('../utils/validator');

// Import controllers
const { getTokenPrice } = require('../controllers/tokenPrice.controller');
const { getWalletTrades } = require('../controllers/walletTrades.controller');
const { getBalanceUpdates } = require('../controllers/balanceUpdates.controller');
const { getTokenMetadata } = require('../controllers/tokenMetadata.controller');
const { getTopHolders } = require('../controllers/topHolders.controller');
const { getLatestTrades } = require('../controllers/latestTrades.controller');
const { getTradesByWallet } = require('../controllers/tradesByWallet.controller');
const { getBondingCurveProgress } = require('../controllers/bondingCurve.controller');
const { getTopPumpfunTokens } = require('../controllers/topPumpfunTokens.controller');
const { getLetsBonkBondingCurveProgress } = require('../controllers/letsbonkBondingCurve.controller');
const { getLetsBonkAbove95 } = require('../controllers/letsbonkAbove95.controller');
const { getLetsBonkTopGraduating } = require('../controllers/letsbonkTopGraduating.controller');
const { getRaydiumBondingCurveProgress } = require('../controllers/raydiumBondingCurve.controller');
const { getRaydiumAbove95 } = require('../controllers/raydiumAbove95.controller');
const { getRaydiumTopGraduating } = require('../controllers/raydiumTopGraduating.controller');
const { getRaydiumGraduated } = require('../controllers/raydiumGraduated.controller');

const router = express.Router();

// Validation schemas
const tokenPriceSchema = {
  tokenAddresses: {
    required: true,
    type: 'solanaAddressArray'
  }
};

const walletTradesSchema = {
  walletAddress: {
    required: true,
    type: 'solanaAddress'
  },
  limit: {
    required: false,
    type: 'limit'
  },
  fromDate: {
    required: false,
    type: 'date'
  }
};

const balanceUpdatesSchema = {
  address: {
    required: true,
    type: 'solanaAddress'
  },
  fromDate: {
    required: false,
    type: 'date'
  },
  toDate: {
    required: false,
    type: 'date'
  },
  limit: {
    required: false,
    type: 'limit'
  }
};

const tokenMetadataSchema = {
  tokenAddress: {
    required: true,
    type: 'solanaAddress'
  }
};

const topHoldersSchema = {
  tokenAddress: {
    required: true,
    type: 'solanaAddress'
  },
  limit: {
    required: false,
    type: 'limit'
  }
};

const latestTradesSchema = {
  tokenAddress: {
    required: true,
    type: 'solanaAddress'
  },
  limit: {
    required: false,
    type: 'limit'
  }
};

const tradesByWalletSchema = {
  walletAddresses: {
    required: true,
    type: 'solanaAddressArray'
  }
};

const bondingCurveSchema = {
  tokenAddress: {
    required: true,
    type: 'solanaAddress'
  }
};

const topPumpfunTokensSchema = {
  limit: {
    required: false,
    type: 'limit'
  },
  sinceTime: {
    required: false,
    type: 'date'
  }
};

const letsbonkBondingCurveSchema = {
  tokenAddress: {
    required: true,
    type: 'solanaAddress'
  }
};

const letsbonkAbove95Schema = {
  limit: {
    required: false,
    type: 'limit'
  }
};

const letsbonkTopGraduatingSchema = {
  limit: {
    required: false,
    type: 'limit'
  },
  minutesAgo: {
    required: false,
    type: 'number'
  }
};

const raydiumBondingCurveSchema = {
  tokenAddress: {
    required: true,
    type: 'solanaAddress'
  }
};

const raydiumAbove95Schema = {
  limit: {
    required: false,
    type: 'limit'
  }
};

const raydiumTopGraduatingSchema = {
  limit: {
    required: false,
    type: 'limit'
  },
  minutesAgo: {
    required: false,
    type: 'number'
  }
};

const raydiumGraduatedSchema = {
  limit: {
    required: false,
    type: 'limit'
  }
};

// ============================================
// Endpoint 1: Get Token Prices on Solana
// ============================================
/**
 * @route   POST /api/v1/token-price
 * @desc    Get current prices for specified tokens
 * @body    { tokenAddresses: ["address1", "address2"] }
 */
router.post('/token-price', validate(tokenPriceSchema), getTokenPrice);

// ============================================
// Endpoint 2: Get Trades by Wallet Address
// ============================================
/**
 * @route   POST /api/v1/wallet-trades
 * @desc    Get trading history for a specific wallet
 * @body    { walletAddress: "address", limit: 50, fromDate: "2024-01-01T00:00:00Z" }
 */
router.post('/wallet-trades', validate(walletTradesSchema), getWalletTrades);

// ============================================
// Endpoint 3: Solana Balance Updates
// ============================================
/**
 * @route   POST /api/v1/balance-updates
 * @desc    Get balance change history for an address
 * @body    { address: "address", fromDate: "2024-01-01T00:00:00Z", toDate: "2024-12-31T23:59:59Z", limit: 100 }
 */
router.post('/balance-updates', validate(balanceUpdatesSchema), getBalanceUpdates);

// ============================================
// Endpoint 4: Get Token Metadata
// ============================================
/**
 * @route   POST /api/v1/token-metadata
 * @desc    Get metadata for a specific token
 * @body    { tokenAddress: "address" }
 */
router.post('/token-metadata', validate(tokenMetadataSchema), getTokenMetadata);

// ============================================
// Endpoint 5: Get Top Token Holders
// ============================================
/**
 * @route   POST /api/v1/top-holders
 * @desc    Get list of largest token holders
 * @body    { tokenAddress: "address", limit: 100 }
 */
router.post('/top-holders', validate(topHoldersSchema), getTopHolders);

// ============================================
// Endpoint 6: Get Latest Trades for a Token
// ============================================
/**
 * @route   POST /api/v1/latest-trades
 * @desc    Get the most recent trades for a specific token
 * @body    { tokenAddress: "address", limit: 50 }
 */
router.post('/latest-trades', validate(latestTradesSchema), getLatestTrades);

// ============================================
// Endpoint 7: Get Trades by Wallet Addresses
// ============================================
/**
 * @route   POST /api/v1/trades-by-wallet
 * @desc    Get trades for specific wallet addresses
 * @body    { walletAddresses: ["address1", "address2"] }
 */
router.post('/trades-by-wallet', validate(tradesByWalletSchema), getTradesByWallet);

// ============================================
// Endpoint 8: Get PumpFun Bonding Curve Progress
// ============================================
/**
 * @route   POST /api/v1/bonding-curve
 * @desc    Get bonding curve progress percentage for a PumpFun token
 * @body    { tokenAddress: "address" }
 */
router.post('/bonding-curve', validate(bondingCurveSchema), getBondingCurveProgress);

// ============================================
// Endpoint 9: Get Top PumpFun Tokens by Market Cap
// ============================================
/**
 * @route   POST /api/v1/top-pumpfun-tokens
 * @desc    Get top PumpFun tokens by market cap
 * @body    { limit: 10, sinceTime: "2024-01-01T00:00:00Z" }
 */
router.post('/top-pumpfun-tokens', validate(topPumpfunTokensSchema), getTopPumpfunTokens);

// ============================================
// Endpoint 10: Get LetsBonk.fun Bonding Curve Progress
// ============================================
/**
 * @route   POST /api/v1/letsbonk-bonding-curve
 * @desc    Get bonding curve progress percentage for a LetsBonk.fun token
 * @body    { tokenAddress: "address" }
 */
router.post('/letsbonk-bonding-curve', validate(letsbonkBondingCurveSchema), getLetsBonkBondingCurveProgress);

// ============================================
// Endpoint 11: Track LetsBonk.fun Tokens Above 95%
// ============================================
/**
 * @route   POST /api/v1/letsbonk-above-95
 * @desc    Get LetsBonk.fun tokens above 95% bonding curve progress
 * @body    { limit: 50 }
 */
router.post('/letsbonk-above-95', validate(letsbonkAbove95Schema), getLetsBonkAbove95);

// ============================================
// Endpoint 12: Top 100 About to Graduate LetsBonk.fun Tokens
// ============================================
/**
 * @route   POST /api/v1/letsbonk-top-graduating
 * @desc    Get top 100 about to graduate LetsBonk.fun tokens
 * @body    { limit: 100, minutesAgo: 5 }
 */
router.post('/letsbonk-top-graduating', validate(letsbonkTopGraduatingSchema), getLetsBonkTopGraduating);

// ============================================
// Endpoint 13: Get Raydium Launchpad Bonding Curve Progress
// ============================================
/**
 * @route   POST /api/v1/raydium-bonding-curve
 * @desc    Get bonding curve progress percentage for a Raydium Launchpad token
 * @body    { tokenAddress: "address" }
 */
router.post('/raydium-bonding-curve', validate(raydiumBondingCurveSchema), getRaydiumBondingCurveProgress);

// ============================================
// Endpoint 14: Track Raydium Launchpad Tokens Above 95%
// ============================================
/**
 * @route   POST /api/v1/raydium-above-95
 * @desc    Get Raydium Launchpad tokens above 95% bonding curve progress
 * @body    { limit: 50 }
 */
router.post('/raydium-above-95', validate(raydiumAbove95Schema), getRaydiumAbove95);

// ============================================
// Endpoint 15: Top 100 About to Graduate Raydium Launchpad Tokens
// ============================================
/**
 * @route   POST /api/v1/raydium-top-graduating
 * @desc    Get top 100 about to graduate Raydium Launchpad tokens
 * @body    { limit: 100, minutesAgo: 5 }
 */
router.post('/raydium-top-graduating', validate(raydiumTopGraduatingSchema), getRaydiumTopGraduating);

// ============================================
// Endpoint 16: Raydium Launchpad Graduated Tokens
// ============================================
/**
 * @route   POST /api/v1/raydium-graduated
 * @desc    Get Raydium Launchpad graduated tokens
 * @body    { limit: 50 }
 */
router.post('/raydium-graduated', validate(raydiumGraduatedSchema), getRaydiumGraduated);

// ============================================
// API Documentation Endpoint
// ============================================
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Solana API v1',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/token-price',
        description: 'Get current prices for specified tokens',
        body: {
          tokenAddresses: 'Array<string> (required) - Token mint addresses'
        }
      },
      {
        method: 'POST',
        path: '/api/v1/wallet-trades',
        description: 'Get trading history for a wallet',
        body: {
          walletAddress: 'string (required) - Wallet address',
          limit: 'number (optional, default: 50) - Max trades to return',
          fromDate: 'string (optional) - Start date in ISO format'
        }
      },
      {
        method: 'POST',
        path: '/api/v1/balance-updates',
        description: 'Get balance change history',
        body: {
          address: 'string (required) - Address to track',
          fromDate: 'string (optional) - Start date in ISO format',
          toDate: 'string (optional) - End date in ISO format',
          limit: 'number (optional, default: 100) - Max updates to return'
        }
      },
      {
        method: 'POST',
        path: '/api/v1/token-metadata',
        description: 'Get metadata for a token',
        body: {
          tokenAddress: 'string (required) - Token mint address'
        }
      },
      {
        method: 'POST',
        path: '/api/v1/top-holders',
        description: 'Get list of top token holders',
        body: {
          tokenAddress: 'string (required) - Token mint address',
          limit: 'number (optional, default: 100) - Number of holders to return'
        }
      },
      {
        method: 'POST',
        path: '/api/v1/latest-trades',
        description: 'Get the most recent trades for a specific token',
        body: {
          tokenAddress: 'string (required) - Token mint address',
          limit: 'number (optional, default: 50) - Number of trades to return'
        }
      },
      {
        method: 'POST',
        path: '/api/v1/trades-by-wallet',
        description: 'Get trades for specific wallet addresses',
        body: {
          walletAddresses: 'Array<string> (required) - Wallet addresses'
        }
      },
      {
        method: 'POST',
        path: '/api/v1/bonding-curve',
        description: 'Get bonding curve progress percentage for a PumpFun token',
        body: {
          tokenAddress: 'string (required) - PumpFun token mint address'
        }
      },
      {
        method: 'POST',
        path: '/api/v1/top-pumpfun-tokens',
        description: 'Get top PumpFun tokens by market cap',
        body: {
          limit: 'number (optional, default: 10) - Number of tokens to return',
          sinceTime: 'string (optional, default: last 24h) - Start time in ISO format'
        }
      },
      {
        method: 'POST',
        path: '/api/v1/letsbonk-bonding-curve',
        description: 'Get bonding curve progress percentage for a LetsBonk.fun token',
        body: {
          tokenAddress: 'string (required) - LetsBonk.fun token mint address'
        }
      },
      {
        method: 'POST',
        path: '/api/v1/letsbonk-above-95',
        description: 'Get LetsBonk.fun tokens above 95% bonding curve progress',
        body: {
          limit: 'number (optional, default: 50) - Number of tokens to return'
        }
      },
      {
        method: 'POST',
        path: '/api/v1/letsbonk-top-graduating',
        description: 'Get top 100 about to graduate LetsBonk.fun tokens',
        body: {
          limit: 'number (optional, default: 100) - Number of tokens to return',
          minutesAgo: 'number (optional, default: 5) - Time window in minutes'
        }
      },
      {
        method: 'POST',
        path: '/api/v1/raydium-bonding-curve',
        description: 'Get bonding curve progress percentage for a Raydium Launchpad token',
        body: {
          tokenAddress: 'string (required) - Raydium Launchpad token mint address'
        }
      },
      {
        method: 'POST',
        path: '/api/v1/raydium-above-95',
        description: 'Get Raydium Launchpad tokens above 95% bonding curve progress',
        body: {
          limit: 'number (optional, default: 50) - Number of tokens to return'
        }
      },
      {
        method: 'POST',
        path: '/api/v1/raydium-top-graduating',
        description: 'Get top 100 about to graduate Raydium Launchpad tokens',
        body: {
          limit: 'number (optional, default: 100) - Number of tokens to return',
          minutesAgo: 'number (optional, default: 5) - Time window in minutes'
        }
      },
      {
        method: 'POST',
        path: '/api/v1/raydium-graduated',
        description: 'Get Raydium Launchpad graduated tokens',
        body: {
          limit: 'number (optional, default: 50) - Number of tokens to return'
        }
      }
    ]
  });
});

module.exports = router;