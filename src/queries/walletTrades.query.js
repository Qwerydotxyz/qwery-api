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
        Solana(dataset: realtime, network: solana) {
          DEXTradeByTokens(
            orderBy: {descending: Block_Time}
            limit: {count: ${limit}}
            where: {
              Trade: {
                Account: {
                  Owner: {is: "${walletAddress}"}
                }
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
            Trade {
              Currency {
                MintAddress
                Symbol
                Name
              }
              Amount
              AmountInUSD
              PriceInUSD
              Dex {
                ProtocolName
                ProtocolFamily
              }
              Side {
                Type
                Currency {
                  Symbol
                  MintAddress
                  Name
                }
                Amount
                AmountInUSD
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