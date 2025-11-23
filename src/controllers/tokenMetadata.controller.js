// src/controllers/tokenMetadata.controller.js
const bitqueryService = require('../services/bitquery.service');
const { transformTokenMetadataData } = require('../services/transformer.service');
const { buildSimpleTokenMetadataQuery } = require('../queries/tokenMetadata.query');
const { createSuccessResponse, asyncHandler } = require('../utils/errorHandler');

/**
 * Get token metadata
 * POST /api/v1/token-metadata
 * Body: { tokenAddress: "address" }
 */
const getTokenMetadata = asyncHandler(async (req, res) => {
  const { tokenAddress } = req.body;
  
  const query = buildSimpleTokenMetadataQuery(tokenAddress);
  const bitqueryData = await bitqueryService.executeQuery(query);
  const transformedData = transformTokenMetadataData(bitqueryData);
  
  res.json(createSuccessResponse(transformedData));
});

module.exports = { getTokenMetadata };


