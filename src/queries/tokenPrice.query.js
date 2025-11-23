// src/queries/tokenPrice.query.js

/**
 * Build GraphQL query for fetching token prices on Solana
 * @param {Array<string>} tokenAddresses - Array of token mint addresses
 * @returns {string} - GraphQL query string
 */
const buildTokenPriceQuery = (tokenAddresses) => {
    // Convert array to GraphQL array format
    const addressesString = JSON.stringify(tokenAddresses);
    
    return `
      {
        Solana {
          DEXTradeByTokens(
            orderBy: {descending: Block_Time}
            where: {
              Trade: {
                Currency: {
                  MintAddress: {in: ${addressesString}}
                }, 
                Side: {
                  Currency: {
                    MintAddress: {is: "So11111111111111111111111111111111111111112"}
                  }
                }
              }
            }
            limitBy: {by: Trade_Currency_MintAddress, count: 1}
          ) {
            Block {
              Time
            }
            Trade {
              Currency {
                Name
                Symbol
                MintAddress
              }
              Price
              PriceInUSD
              Side {
                Currency {
                  Name
                  MintAddress
                }
              }
            }
          }
        }
      }
    `;
  };
  
  module.exports = {
    buildTokenPriceQuery
  };