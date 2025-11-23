// src/controllers/raydiumAbove95.controller.js
const bitqueryService = require('../services/bitquery.service');
const { transformRaydiumTokensData } = require('../services/transformer.service');
const { buildRaydiumAbove95Query } = require('../queries/raydiumAbove95.query');
const { createSuccessResponse, asyncHandler } = require('../utils/errorHandler');

/**
 * Track Raydium Launchpad tokens above 95% bonding curve progress
 * POST /api/v1/raydium-above-95
 * Body: { limit: 50 } (optional)
 */
const getRaydiumAbove95 = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.body;
  
  const query = buildRaydiumAbove95Query(limit);
  const bitqueryData = await bitqueryService.executeQuery(query);
  const transformedData = transformRaydiumTokensData(bitqueryData);
  
  res.json(createSuccessResponse(transformedData, {
    count: transformedData.length,
    limit,
    minProgress: 95,
    platform: 'Raydium Launchpad'
  }));
});

module.exports = {
  getRaydiumAbove95
};
