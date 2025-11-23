// src/controllers/tokenPrice.controller.js
const bitqueryService = require('../services/bitquery.service');
const { transformTokenPriceData } = require('../services/transformer.service');
const { buildTokenPriceQuery } = require('../queries/tokenPrice.query');
const { createSuccessResponse, asyncHandler } = require('../utils/errorHandler');

/**
 * Get token prices on Solana
 * POST /api/v1/token-price
 * Body: { tokenAddresses: ["address1", "address2", ...] }
 */
const getTokenPrice = asyncHandler(async (req, res) => {
  const { tokenAddresses } = req.body;
  
  // Build GraphQL query
  const query = buildTokenPriceQuery(tokenAddresses);
  
  // Execute query via Bitquery service
  const bitqueryData = await bitqueryService.executeQuery(query);
  
  // Transform response to our format (removing all Bitquery references)
  const transformedData = transformTokenPriceData(bitqueryData);
  
  // Return standardized success response
  res.json(createSuccessResponse(transformedData, {
    count: transformedData.length,
    requested: tokenAddresses.length
  }));
});

module.exports = {
  getTokenPrice
};