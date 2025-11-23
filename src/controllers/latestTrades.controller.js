// src/controllers/latestTrades.controller.js
const bitqueryService = require('../services/bitquery.service');
const { transformLatestTradesData } = require('../services/transformer.service');
const { buildLatestTradesQuery } = require('../queries/latestTrades.query');
const { createSuccessResponse, asyncHandler } = require('../utils/errorHandler');

/**
 * Get latest trades for a token on Solana
 * POST /api/v1/latest-trades
 * Body: { tokenAddress: "address", limit: 50 }
 */
const getLatestTrades = asyncHandler(async (req, res) => {
  const { tokenAddress, limit = 50 } = req.body;
  
  if (!tokenAddress) {
    return res.status(400).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        code: 'VALIDATION_ERROR',
        message: 'tokenAddress is required'
      }
    });
  }
  
  // Build GraphQL query
  const query = buildLatestTradesQuery(tokenAddress, limit);
  
  // Execute query via Bitquery service
  const bitqueryData = await bitqueryService.executeQuery(query);
  
  // Transform response to our format
  const transformedData = transformLatestTradesData(bitqueryData);
  
  // Return standardized success response
  res.json(createSuccessResponse(transformedData, {
    count: transformedData.length,
    tokenAddress,
    limit
  }));
});

module.exports = {
  getLatestTrades
};
