// src/controllers/raydiumGraduated.controller.js
const bitqueryService = require('../services/bitquery.service');
const { transformRaydiumGraduatedData } = require('../services/transformer.service');
const { buildRaydiumGraduatedQuery } = require('../queries/raydiumGraduated.query');
const { createSuccessResponse, asyncHandler } = require('../utils/errorHandler');

/**
 * Get Raydium Launchpad graduated tokens
 * POST /api/v1/raydium-graduated
 * Body: { limit: 50 } (optional)
 */
const getRaydiumGraduated = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.body;
  
  const query = buildRaydiumGraduatedQuery(limit);
  const bitqueryData = await bitqueryService.executeQuery(query);
  const transformedData = transformRaydiumGraduatedData(bitqueryData);
  
  res.json(createSuccessResponse(transformedData, {
    count: transformedData.length,
    limit,
    platform: 'Raydium Launchpad'
  }));
});

module.exports = {
  getRaydiumGraduated
};
