// src/controllers/tradesByWallet.controller.js
const bitqueryService = require('../services/bitquery.service');
const { transformTradesByWalletData } = require('../services/transformer.service');
const { buildTradesByWalletQuery } = require('../queries/tradesByWallet.query');
const { createSuccessResponse, asyncHandler } = require('../utils/errorHandler');

/**
 * Get trades by wallet address(es) on Solana
 * POST /api/v1/trades-by-wallet
 * Body: { walletAddresses: ["address1", "address2", ...] }
 */
const getTradesByWallet = asyncHandler(async (req, res) => {
  const { walletAddresses } = req.body;
  
  if (!walletAddresses || !Array.isArray(walletAddresses) || walletAddresses.length === 0) {
    return res.status(400).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        code: 'VALIDATION_ERROR',
        message: 'walletAddresses array is required and must not be empty'
      }
    });
  }
  
  // Build GraphQL query
  const query = buildTradesByWalletQuery(walletAddresses);
  
  // Execute query via Bitquery service
  const bitqueryData = await bitqueryService.executeQuery(query);
  
  // Transform response to our format
  const transformedData = transformTradesByWalletData(bitqueryData);
  
  // Return standardized success response
  res.json(createSuccessResponse(transformedData, {
    count: transformedData.length,
    walletAddresses,
    requestedWallets: walletAddresses.length
  }));
});

module.exports = {
  getTradesByWallet
};
