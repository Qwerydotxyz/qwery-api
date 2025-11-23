// src/queries/letsbonkBondingCurve.query.js

/**
 * Build GraphQL query for fetching LetsBonk.fun bonding curve progress percentage
 * @param {string} tokenAddress - Token mint address
 * @returns {string} - GraphQL query string
 */
const buildLetsBonkBondingCurveQuery = (tokenAddress) => {
  return `
    {
      Solana {
        DEXPools(
          limit: {count: 1}
          orderBy: {descending: Block_Slot}
          where: {
            Pool: {
              Market: {
                BaseCurrency: {
                  MintAddress: {is: "${tokenAddress}"}
                }
              }
              Dex: {
                ProgramAddress: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}
              }
            }
          }
        ) {
          Bonding_Curve_Progress_precentage: calculate(
            expression: "100-((($Pool_Base_Balance - 206900000) * 100) / 793100000)"
          )
          Pool {
            Market {
              MarketAddress
              BaseCurrency {
                MintAddress
                Symbol
                Name
              }
              QuoteCurrency {
                MintAddress
                Symbol
                Name
              }
            }
            Dex {
              ProtocolFamily
              ProtocolName
            }
            Quote {
              PostAmount
              PriceInUSD
              PostAmountInUSD
            }
            Base {
              Balance: PostAmount
            }
          }
        }
      }
    }
  `;
};

module.exports = {
  buildLetsBonkBondingCurveQuery
};
