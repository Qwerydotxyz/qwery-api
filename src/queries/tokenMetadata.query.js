// src/queries/tokenMetadata.query.js

/**
 * Build GraphQL query for fetching token metadata
 * @param {string} tokenAddress - Token mint address
 * @returns {string} - GraphQL query string
 */
const buildSimpleTokenMetadataQuery = (tokenAddress) => {
  return `
    {
      Solana {
        DEXTradeByTokens(
          orderBy: {descending: Block_Time}
          limit: 1
          where: {
            Trade: {
              Currency: {
                MintAddress: {is: "${tokenAddress}"}
              }
            }
          }
        ) {
          Block {
            Time
          }
          Trade {
            Currency {
              Name
              Symbol
              MintAddress
              Decimals
              Fungible
              Uri
            }
            Price
            PriceInUSD
          }
        }
      }
    }
  `;
};

module.exports = {
  buildSimpleTokenMetadataQuery
};
