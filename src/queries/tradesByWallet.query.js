// src/queries/tradesByWallet.query.js

/**
 * Build GraphQL query for fetching trades by wallet address
 * Note: Original query was a subscription, but we'll use a regular query for REST API
 * @param {Array<string>} walletAddresses - Array of wallet addresses
 * @returns {string} - GraphQL query string
 */
const buildTradesByWalletQuery = (walletAddresses) => {
  const addressesString = JSON.stringify(walletAddresses);
  
  return `
    {
      Solana {
        DEXTrades(
          where: {
            Transaction: {Result: {Success: true}}
            any: [
              {Trade: {Buy: {Account: {Address: {in: ${addressesString}}}}}},
              {Trade: {Buy: {Account: {Token: {Owner: {in: ${addressesString}}}}}}},
              {Trade: {Sell: {Account: {Address: {in: ${addressesString}}}}}},
              {Trade: {Sell: {Account: {Token: {Owner: {in: ${addressesString}}}}}}}
            ]
          }
          limit: {count: 100}
          orderBy: {descending: Block_Time}
        ) {
          Instruction {
            Program {
              Method
            }
          }
          Block {
            Time
          }
          Trade {
            Buy {
              Amount
              Account {
                Address
              }
              Currency {
                Name
                Symbol
                MintAddress
                Decimals
              }
              AmountInUSD
            }
            Sell {
              Amount
              Account {
                Address
              }
              Currency {
                Name
                Symbol
                MintAddress
                Decimals
              }
              AmountInUSD
            }
          }
          Transaction {
            Signature
            Signer
          }
        }
      }
    }
  `;
};

module.exports = {
  buildTradesByWalletQuery
};
