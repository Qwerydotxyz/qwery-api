// src/controllers/letsbonkTopGraduating.controller.js
const bitqueryService = require('../services/bitquery.service');
const { transformLetsBonkTokensData } = require('../services/transformer.service');
const { buildLetsBonkTopGraduatingQuery } = require('../queries/letsbonkTopGraduating.query');
const { createSuccessResponse, asyncHandler } = require('../utils/errorHandler');

/**
 * Get top 100 about to graduate LetsBonk.fun tokens
 * POST /api/v1/letsbonk-top-graduating
 * Body: { limit: 100, minutesAgo: 5 } (optional)
 */
const getLetsBonkTopGraduating = asyncHandler(async (req, res) => {
  const { limit = 100, minutesAgo = 5 } = req.body;
  
  // Build GraphQL query
  const query = buildLetsBonkTopGraduatingQuery(limit, minutesAgo);
  
  // Execute query via Bitquery service
  const bitqueryData = await bitqueryService.executeQuery(query);
  
  // Transform response to our format
  const transformedData = transformLetsBonkTokensData(bitqueryData);
  
  // Return standardized success response
  res.json(createSuccessResponse(transformedData, {
    count: transformedData.length,
    limit,
    timeWindow: `Last ${minutesAgo} minutes`,
    platform: 'LetsBonk.fun'
  }));
});

module.exports = {
  getLetsBonkTopGraduating
};
