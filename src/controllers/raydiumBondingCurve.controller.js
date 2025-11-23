// src/controllers/raydiumBondingCurve.controller.js
const bitqueryService = require('../services/bitquery.service');
const { transformBondingCurveData } = require('../services/transformer.service');
const { buildRaydiumBondingCurveQuery } = require('../queries/raydiumBondingCurve.query');
const { createSuccessResponse, asyncHandler } = require('../utils/errorHandler');

/**
 * Get Raydium Launchpad bonding curve progress percentage
 * POST /api/v1/raydium-bonding-curve
 * Body: { tokenAddress: "address" }
 */
const getRaydiumBondingCurveProgress = asyncHandler(async (req, res) => {
  const { tokenAddress } = req.body;
  
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
  
  const query = buildRaydiumBondingCurveQuery(tokenAddress);
  const bitqueryData = await bitqueryService.executeQuery(query);
  const transformedData = transformBondingCurveData(bitqueryData);
  
  res.json(createSuccessResponse(transformedData, {
    tokenAddress,
    platform: 'Raydium Launchpad'
  }));
});

module.exports = {
  getRaydiumBondingCurveProgress
};
