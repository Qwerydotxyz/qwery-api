// src/queries/balanceUpdates.query.js

/**
 * Build GraphQL query for fetching balance updates for an address
 * @param {string} address - Solana address to track
 * @param {string} fromDate - Optional start date (ISO format)
 * @param {string} toDate - Optional end date (ISO format)
 * @param {number} limit - Number of updates to return
 * @returns {string} - GraphQL query string
 */
const buildBalanceUpdatesQuery = (address, fromDate = null, toDate = null, limit = 100) => {
  let timeFilter = '';
  
  if (fromDate && toDate) {
    timeFilter = `, Block: {Time: {after: "${fromDate}", before: "${toDate}"}}`;
  } else if (fromDate) {
    timeFilter = `, Block: {Time: {after: "${fromDate}"}}`;
  } else if (toDate) {
    timeFilter = `, Block: {Time: {before: "${toDate}"}}`;
  }
  
  return `
    {
      Solana(dataset: realtime, network: solana) {
        BalanceUpdates(
          orderBy: {descending: Block_Time}
          limit: {count: ${limit}}
          where: {
            BalanceUpdate: {
              Account: {Address: {is: "${address}"}}
            }${timeFilter}
            Transaction: {Result: {Success: true}}
          }
        ) {
          Block {
            Time
          }
          Transaction {
            Signature
          }
          BalanceUpdate {
            Amount
            Currency {
              MintAddress
              Symbol
              Name
            }
          }
        }
      }
    }
  `;
};

module.exports = {
  buildBalanceUpdatesQuery
};


