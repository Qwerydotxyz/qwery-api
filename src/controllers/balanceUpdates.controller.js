// src/controllers/balanceUpdates.controller.js
const bitqueryService = require('../services/bitquery.service');
const { transformBalanceUpdatesData } = require('../services/transformer.service');
const { buildBalanceUpdatesQuery } = require('../queries/balanceUpdates.query');
const { createSuccessResponse, asyncHandler } = require('../utils/errorHandler');

/**
 * Get balance updates for an address
 * POST /api/v1/balance-updates
 * Body: { address: "address", fromDate: "2024-01-01T00:00:00Z", toDate: "2024-12-31T23:59:59Z", limit: 100 }
 */
const getBalanceUpdates = asyncHandler(async (req, res) => {
  const { address, fromDate, toDate, limit = 100 } = req.body;
  
  const query = buildBalanceUpdatesQuery(address, fromDate, toDate, limit);
  const bitqueryData = await bitqueryService.executeQuery(query);
  const transformedData = transformBalanceUpdatesData(bitqueryData);
  
  res.json(createSuccessResponse(transformedData, {
    count: transformedData.length,
    limit: limit
  }));
});

module.exports = { getBalanceUpdates };



