// src/controllers/walletTrades.controller.js
const bitqueryService = require('../services/bitquery.service');
const { transformWalletTradesData } = require('../services/transformer.service');
const { buildWalletTradesQuery } = require('../queries/walletTrades.query');
const { createSuccessResponse, asyncHandler } = require('../utils/errorHandler');

/**
 * Get wallet trades history
 * POST /api/v1/wallet-trades
 * Body: { walletAddress: "address", limit: 50, fromDate: "2024-01-01T00:00:00Z" }
 */
const getWalletTrades = asyncHandler(async (req, res) => {
  const { walletAddress, limit = 50, fromDate } = req.body;
  
  const query = buildWalletTradesQuery(walletAddress, limit, fromDate);
  const bitqueryData = await bitqueryService.executeQuery(query);
  const transformedData = transformWalletTradesData(bitqueryData);
  
  res.json(createSuccessResponse(transformedData, {
    count: transformedData.length,
    limit: limit
  }));
});

module.exports = { getWalletTrades };
