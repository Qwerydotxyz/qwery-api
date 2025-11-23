// src/controllers/letsbonkBondingCurve.controller.js
const bitqueryService = require('../services/bitquery.service');
const { transformBondingCurveData } = require('../services/transformer.service');
const { buildLetsBonkBondingCurveQuery } = require('../queries/letsbonkBondingCurve.query');
const { createSuccessResponse, asyncHandler } = require('../utils/errorHandler');

/**
 * Get LetsBonk.fun bonding curve progress percentage
 * POST /api/v1/letsbonk-bonding-curve
 * Body: { tokenAddress: "address" }
 */
const getLetsBonkBondingCurveProgress = asyncHandler(async (req, res) => {
  const { tokenAddress } = req.body;
  
  // Validate token address
  if (!tokenAddress) {
    return res.status(400).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Token address is required'
      }
    });
  }
  
  // Build GraphQL query
  const query = buildLetsBonkBondingCurveQuery(tokenAddress);
  
  // Execute query via Bitquery service
  const bitqueryData = await bitqueryService.executeQuery(query);
  
  // Transform response to our format
  const transformedData = transformBondingCurveData(bitqueryData);
  
  // Return standardized success response
  res.json(createSuccessResponse(transformedData, {
    tokenAddress,
    platform: 'LetsBonk.fun'
  }));
});

module.exports = {
  getLetsBonkBondingCurveProgress
};
