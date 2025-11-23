// src/queries/walletTrades.query.js

/**
 * Build GraphQL query for fetching trades by wallet address
 * @param {string} walletAddress - Solana wallet address
 * @param {number} limit - Number of trades to return
 * @param {string} fromDate - Optional start date (ISO format)
 * @returns {string} - GraphQL query string
 */
const buildWalletTradesQuery = (walletAddress, limit = 50, fromDate = null) => {
    let timeFilter = '';
    if (fromDate) {
      timeFilter = `, Block: {Time: {after: "${fromDate}"}}`;
    }
    
    return `
      {
        Solana {
          DEXTrades(
            orderBy: {descending: Block_Time}
            limit: ${limit}
            where: {
              Trade: {
                Account: {Address: {is: "${walletAddress}"}}
              }${timeFilter}
            }
          ) {
            Block {
              Time
            }
            Transaction {
              Signature
            }
            Trade {
              Currency {
                MintAddress
                Symbol
                Name
              }
              Amount
              PriceInUSD
              Side {
                Type
              }
              Dex {
                ProtocolName
              }
            }
          }
        }
      }
    `;
  };
  
  module.exports = {
    buildWalletTradesQuery
  };