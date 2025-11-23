// src/controllers/raydiumTopGraduating.controller.js
const bitqueryService = require('../services/bitquery.service');
const { transformRaydiumTokensData } = require('../services/transformer.service');
const { buildRaydiumTopGraduatingQuery } = require('../queries/raydiumTopGraduating.query');
const { createSuccessResponse, asyncHandler } = require('../utils/errorHandler');

/**
 * Get top 100 about to graduate Raydium Launchpad tokens
 * POST /api/v1/raydium-top-graduating
 * Body: { limit: 100, minutesAgo: 5 } (optional)
 */
const getRaydiumTopGraduating = asyncHandler(async (req, res) => {
  const { limit = 100, minutesAgo = 5 } = req.body;
  
  const query = buildRaydiumTopGraduatingQuery(limit, minutesAgo);
  const bitqueryData = await bitqueryService.executeQuery(query);
  const transformedData = transformRaydiumTokensData(bitqueryData);
  
  res.json(createSuccessResponse(transformedData, {
    count: transformedData.length,
    limit,
    timeWindow: `Last ${minutesAgo} minutes`,
    platform: 'Raydium Launchpad'
  }));
});

module.exports = {
  getRaydiumTopGraduating
};
