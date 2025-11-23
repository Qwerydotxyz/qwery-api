// src/queries/raydiumTopGraduating.query.js

/**
 * Build GraphQL query for top 100 about to graduate Raydium Launchpad tokens
 * @param {number} limit - Number of tokens to fetch (default: 100)
 * @param {number} minutesAgo - Time window in minutes (default: 5)
 * @returns {string} - GraphQL query string
 */
const buildRaydiumTopGraduatingQuery = (limit = 100, minutesAgo = 5) => {
  return `
    {
      Solana {
        DEXPools(
          limitBy: {by: Pool_Market_BaseCurrency_MintAddress, count: 1}
          limit: {count: ${limit}}
          orderBy: {ascending: Pool_Base_PostAmount}
          where: {
            Pool: {
              Base: {
                PostAmount: {gt: "206900000"}
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
            Block: {Time: {since_relative: {minutes_ago: ${minutesAgo}}}}
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
              Balance: PostAmount(maximum: Block_Time)
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
  buildRaydiumTopGraduatingQuery
};
