// src/controllers/topPumpfunTokens.controller.js
const bitqueryService = require('../services/bitquery.service');
const { transformTopPumpfunTokensData } = require('../services/transformer.service');
const { buildTopPumpfunTokensQuery } = require('../queries/topPumpfunTokens.query');
const { createSuccessResponse, asyncHandler } = require('../utils/errorHandler');

/**
 * Get top PumpFun tokens by market cap
 * POST /api/v1/top-pumpfun-tokens
 * Body: { limit: 10, sinceTime: "ISO timestamp" } (optional)
 */
const getTopPumpfunTokens = asyncHandler(async (req, res) => {
  const { limit = 10, sinceTime } = req.body;
  
  // Build GraphQL query
  const query = buildTopPumpfunTokensQuery(limit, sinceTime);
  
  // Execute query via Bitquery service
  const bitqueryData = await bitqueryService.executeQuery(query);
  
  // Transform response to our format
  const transformedData = transformTopPumpfunTokensData(bitqueryData);
  
  // Return standardized success response
  res.json(createSuccessResponse(transformedData, {
    count: transformedData.length,
    limit,
    sinceTime: sinceTime || 'Last 24 hours'
  }));
});

module.exports = {
  getTopPumpfunTokens
};
