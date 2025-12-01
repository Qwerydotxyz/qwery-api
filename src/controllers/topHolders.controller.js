// src/controllers/topHolders.controller.js
const bitqueryService = require('../services/bitquery.service');
const { transformTopHoldersData } = require('../services/transformer.service');
const { buildTopHoldersQuery } = require('../queries/topHolders.query');
const { createSuccessResponse, asyncHandler } = require('../utils/errorHandler');

/**
 * Get top token holders
 * POST /api/v1/top-holders
 * Body: { tokenAddress: "address", limit: 100 }
 */
const getTopHolders = asyncHandler(async (req, res) => {
  const { tokenAddress, limit = 100 } = req.body;
  
  const query = buildTopHoldersQuery(tokenAddress, limit);
  const bitqueryData = await bitqueryService.executeQuery(query);
  
  // Extract the holders data from the new query structure
  const holders = bitqueryData?.data?.Solana?.BalanceUpdates || [];
  
  res.json(createSuccessResponse(holders, {
    count: holders.length,
    tokenAddress,
    totalAnalyzed: holders.length
  }));
});

module.exports = { getTopHolders };






