// src/queries/raydiumGraduated.query.js

/**
 * Build GraphQL query for Raydium Launchpad graduated tokens
 * @param {number} limit - Number of tokens to fetch (default: 50)
 * @returns {string} - GraphQL query string
 */
const buildRaydiumGraduatedQuery = (limit = 50) => {
  return `
    {
      Solana {
        Instructions(
          limit: {count: ${limit}}
          orderBy: {descending: Block_Time}
          where: {
            Instruction: {
              Program: {
                Address: {is: "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"}
                Method: {in: ["migrate_to_amm", "migrate_to_cpswap"]}
              }
            }
            Transaction: {Result: {Success: true}}
          }
        ) {
          Block {
            Time
          }
          Instruction {
            Program {
              Method
              AccountNames
              Address
              Arguments {
                Value {
                  ... on Solana_ABI_Json_Value_Arg {
                    json
                  }
                  ... on Solana_ABI_Float_Value_Arg {
                    float
                  }
                  ... on Solana_ABI_Boolean_Value_Arg {
                    bool
                  }
                  ... on Solana_ABI_Bytes_Value_Arg {
                    hex
                  }
                  ... on Solana_ABI_BigInt_Value_Arg {
                    bigInteger
                  }
                  ... on Solana_ABI_Address_Value_Arg {
                    address
                  }
                  ... on Solana_ABI_Integer_Value_Arg {
                    integer
                  }
                  ... on Solana_ABI_String_Value_Arg {
                    string
                  }
                }
                Type
                Name
              }
              Name
            }
            Accounts {
              Address
              IsWritable
              Token {
                ProgramId
                Owner
                Mint
              }
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
  buildRaydiumGraduatedQuery
};
