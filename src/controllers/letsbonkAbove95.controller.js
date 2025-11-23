// src/controllers/letsbonkAbove95.controller.js
const bitqueryService = require('../services/bitquery.service');
const { transformLetsBonkTokensData } = require('../services/transformer.service');
const { buildLetsBonkAbove95Query } = require('../queries/letsbonkAbove95.query');
const { createSuccessResponse, asyncHandler } = require('../utils/errorHandler');

/**
 * Track LetsBonk.fun tokens above 95% bonding curve progress
 * POST /api/v1/letsbonk-above-95
 * Body: { limit: 50 } (optional)
 */
const getLetsBonkAbove95 = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.body;
  
  // Build GraphQL query
  const query = buildLetsBonkAbove95Query(limit);
  
  // Execute query via Bitquery service
  const bitqueryData = await bitqueryService.executeQuery(query);
  
  // Transform response to our format
  const transformedData = transformLetsBonkTokensData(bitqueryData);
  
  // Return standardized success response
  res.json(createSuccessResponse(transformedData, {
    count: transformedData.length,
    limit,
    minProgress: 95,
    platform: 'LetsBonk.fun'
  }));
});

module.exports = {
  getLetsBonkAbove95
};
