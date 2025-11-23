// src/queries/raydiumAbove95.query.js

/**
 * Build GraphQL query for tracking Raydium Launchpad tokens above 95% bonding curve progress
 * @param {number} limit - Number of tokens to fetch (default: 50)
 * @returns {string} - GraphQL query string
 */
const buildRaydiumAbove95Query = (limit = 50) => {
  return `
    {
      Solana {
        DEXPools(
          limit: {count: ${limit}}
          orderBy: {descending: Block_Time}
          where: {
            Pool: {
              Base: {
                PostAmount: {gt: "206900000", lt: "246555000"}
              }
              Dex: {
                ProgramAddress: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}
              }
              Market: {
                QuoteCurrency: {
                  MintAddress: {
                    in: ["11111111111111111111111111111111", "So11111111111111111111111111111111111111112"]
                  }
                }
              }
            }
            Transaction: {Result: {Success: true}}
          }
        ) {
          Bonding_Curve_Progress_precentage: calculate(
            expression: "100 - ((($Pool_Base_Balance - 206900000) * 100) / 793100000)"
          )
          Pool {
            Market {
              BaseCurrency {
                MintAddress
                Name
                Symbol
              }
              MarketAddress
              QuoteCurrency {
                MintAddress
                Name
                Symbol
              }
            }
            Dex {
              ProtocolName
              ProtocolFamily
            }
            Base {
              Balance: PostAmount
            }
            Quote {
              PostAmount
              PriceInUSD
              PostAmountInUSD
            }
          }
        }
      }
    }
  `;
};

module.exports = {
  buildRaydiumAbove95Query
};
