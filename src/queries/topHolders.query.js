// src/queries/topHolders.query.js

/**
 * Build GraphQL query for fetching top token holders
 * @param {string} tokenAddress - Token mint address
 * @param {number} limit - Number of holders to return
 * @returns {string} - GraphQL query string
 */
const buildTopHoldersQuery = (tokenAddress, limit = 100) => {
  return `
    {
      Solana(dataset: realtime, network: solana, aggregates: yes) {
        BalanceUpdates(
          orderBy: {descendingByField: "BalanceUpdate_Holding_maximum"}
          limit: {count: ${limit}}
          where: {
            BalanceUpdate: {
              Currency: {
                MintAddress: {is: "${tokenAddress}"}
              }
            }
            Transaction: {Result: {Success: true}}
          }
        ) {
          BalanceUpdate {
            Currency {
              Name
              MintAddress
              Symbol
            }
            Account {
              Address
            }
            Holding: PostBalance(maximum: Block_Slot, selectWhere: {gt: "0"})
          }
        }
      }
    }
  `;
};

module.exports = {
  buildTopHoldersQuery
};






