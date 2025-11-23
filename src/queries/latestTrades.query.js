// src/queries/latestTrades.query.js

/**
 * Build GraphQL query for fetching latest trades by token
 * @param {string} tokenAddress - Token mint address
 * @param {number} limit - Number of trades to fetch (default: 50)
 * @returns {string} - GraphQL query string
 */
const buildLatestTradesQuery = (tokenAddress, limit = 50) => {
  return `
    {
      Solana {
        DEXTradeByTokens(
          orderBy: {descending: Block_Time}
          limit: {count: ${limit}}
          where: {
            Trade: {
              Currency: {
                MintAddress: {is: "${tokenAddress}"}
              }, 
              Side: {
                Currency: {
                  MintAddress: {
                    in: [
                      "",
                      "So11111111111111111111111111111111111111112",
                      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                      "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
                      "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
                      "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"
                    ]
                  }
                }
              }
            }
          }
        ) {
          Block {
            Time
          }
          Transaction {
            Signature
          }
          Trade {
            Market {
              MarketAddress
            }
            Dex {
              ProtocolName
              ProtocolFamily
            }
            AmountInUSD
            PriceInUSD
            Amount
            Currency {
              Name
            }
            Side {
              Type
              Currency {
                Symbol
                MintAddress
                Name
              }
              AmountInUSD
              Amount
            }
          }
        }
      }
    }
  `;
};

module.exports = {
  buildLatestTradesQuery
};
