// src/queries/tokenMetadata.query.js

/**
 * Build GraphQL query for fetching token metadata
 * @param {string} tokenAddress - Token mint address
 * @returns {string} - GraphQL query string
 */
const buildSimpleTokenMetadataQuery = (tokenAddress) => {
  return `
    {
      Solana(dataset: realtime, network: solana) {
        DEXTradeByTokens(
          orderBy: {descending: Block_Time}
          limit: {count: 1}
          where: {
            Trade: {
              Currency: {
                MintAddress: {is: "${tokenAddress}"}
              }
            }
            Transaction: {Result: {Success: true}}
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
