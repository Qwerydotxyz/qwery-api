// src/queries/topPumpfunTokens.query.js

/**
 * Build GraphQL query for fetching top PumpFun tokens by market cap
 * @param {number} limit - Number of tokens to fetch (default: 10)
 * @param {string} sinceTime - ISO timestamp to fetch tokens since (optional)
 * @returns {string} - GraphQL query string
 */
const buildTopPumpfunTokensQuery = (limit = 10, sinceTime = null) => {
  // Use provided time or default to 24 hours ago
  const timeFilter = sinceTime || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  return `
    {
      Solana {
        DEXTrades(
          limitBy: {by: Trade_Buy_Currency_MintAddress, count: 1}
          limit: {count: ${limit}}
          orderBy: {descending: Trade_Buy_Price}
          where: {
            Trade: {
              Dex: {
                ProtocolName: {is: "pump"}
              }, 
              Buy: {
                Currency: {
                  MintAddress: {notIn: ["11111111111111111111111111111111"]}
                }
              }, 
              PriceAsymmetry: {le: 0.1}, 
              Sell: {
                AmountInUSD: {gt: "10"}
              }
            }, 
            Transaction: {
              Result: {Success: true}
            }, 
            Block: {
              Time: {since: "${timeFilter}"}
            }
          }
        ) {
          Trade {
            Buy {
              Price(maximum: Block_Time)
              PriceInUSD(maximum: Block_Time)
              Currency {
                Name
                Symbol
                MintAddress
                Decimals
                Fungible
                Uri
              }
            }
          }
        }
      }
    }
  `;
};

module.exports = {
  buildTopPumpfunTokensQuery
};
