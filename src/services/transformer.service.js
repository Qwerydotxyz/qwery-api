// src/services/transformer.service.js

/**
 * Service for transforming Bitquery responses into our API format
 * Removes all Bitquery-specific structure and metadata
 */

/**
 * Transform token price data from Bitquery format to our format
 * @param {object} bitqueryData - Raw data from Bitquery
 * @returns {Array} - Transformed token price array
 */
const transformTokenPriceData = (bitqueryData) => {
    if (!bitqueryData.Solana?.DEXTradeByTokens) {
      return [];
    }
    
    return bitqueryData.Solana.DEXTradeByTokens.map(trade => ({
      address: trade.Trade.Currency.MintAddress,
      name: trade.Trade.Currency.Name || 'Unknown',
      symbol: trade.Trade.Currency.Symbol || 'N/A',
      priceInSol: parseFloat(trade.Trade.Price) || 0,
      priceInUSD: parseFloat(trade.Trade.PriceInUSD) || 0,
      lastUpdated: trade.Block.Time,
      quoteCurrency: {
        name: trade.Trade.Side.Currency.Name,
        address: trade.Trade.Side.Currency.MintAddress
      }
    }));
  };
  
  /**
   * Transform wallet trades data from Bitquery format to our format
   * @param {object} bitqueryData - Raw data from Bitquery
   * @returns {Array} - Transformed trades array
   */
  const transformWalletTradesData = (bitqueryData) => {
    if (!bitqueryData.Solana?.DEXTrades) {
      return [];
    }
    
    return bitqueryData.Solana.DEXTrades.map((trade, index) => ({
      tradeId: `${trade.Transaction.Signature}-${index}`,
      timestamp: trade.Block.Time,
      type: trade.Trade.Side.Type || 'unknown',
      tokenAddress: trade.Trade.Currency.MintAddress,
      tokenSymbol: trade.Trade.Currency.Symbol || 'N/A',
      tokenName: trade.Trade.Currency.Name || 'Unknown',
      amount: parseFloat(trade.Trade.Amount) || 0,
      priceInUSD: parseFloat(trade.Trade.PriceInUSD) || 0,
      totalValueUSD: (parseFloat(trade.Trade.Amount) || 0) * (parseFloat(trade.Trade.PriceInUSD) || 0),
      dexName: trade.Trade.Dex?.ProtocolName || 'Unknown DEX',
      transactionSignature: trade.Transaction.Signature
    }));
  };
  
  /**
   * Transform balance updates data from Bitquery format to our format
   * @param {object} bitqueryData - Raw data from Bitquery
   * @returns {Array} - Transformed balance updates array
   */
  const transformBalanceUpdatesData = (bitqueryData) => {
    if (!bitqueryData.Solana?.BalanceUpdates) {
      return [];
    }
    
    let previousBalance = 0;
    
    return bitqueryData.Solana.BalanceUpdates.map((update, index) => {
      const currentBalance = parseFloat(update.BalanceUpdate.Amount) || 0;
      const change = index === 0 ? currentBalance : currentBalance - previousBalance;
      previousBalance = currentBalance;
      
      return {
        timestamp: update.Block.Time,
        balance: currentBalance,
        change: change,
        changeType: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'none',
        currency: {
          address: update.BalanceUpdate.Currency.MintAddress,
          symbol: update.BalanceUpdate.Currency.Symbol || 'N/A',
          name: update.BalanceUpdate.Currency.Name || 'Unknown'
        },
        transactionSignature: update.Transaction.Signature
      };
    });
  };
  
  /**
   * Transform token metadata from Bitquery format to our format
   * @param {object} bitqueryData - Raw data from Bitquery
   * @returns {object} - Transformed token metadata
   */
  const transformTokenMetadataData = (bitqueryData) => {
    if (!bitqueryData.Solana?.TokenInfo || bitqueryData.Solana.TokenInfo.length === 0) {
      throw new Error('NO_DATA_FOUND');
    }
    
    const tokenInfo = bitqueryData.Solana.TokenInfo[0];
    
    return {
      address: tokenInfo.Token.MintAddress,
      name: tokenInfo.Token.Name || 'Unknown',
      symbol: tokenInfo.Token.Symbol || 'N/A',
      decimals: tokenInfo.Token.Decimals || 9,
      totalSupply: tokenInfo.Token.Supply || '0',
      uri: tokenInfo.Token.Uri || null,
      owner: tokenInfo.Token.Owner || null
    };
  };
  
  /**
   * Transform top holders data from Bitquery format to our format
   * @param {object} bitqueryData - Raw data from Bitquery
   * @returns {Array} - Transformed top holders array
   */
  const transformTopHoldersData = (bitqueryData) => {
    if (!bitqueryData.Solana?.TokenHolders) {
      return [];
    }
    
    // Calculate total balance for percentage
    const totalBalance = bitqueryData.Solana.TokenHolders.reduce(
      (sum, holder) => sum + (parseFloat(holder.Balance.Amount) || 0),
      0
    );
    
    return bitqueryData.Solana.TokenHolders.map((holder, index) => {
      const balance = parseFloat(holder.Balance.Amount) || 0;
      const percentage = totalBalance > 0 ? (balance / totalBalance) * 100 : 0;
      
      return {
        rank: index + 1,
        address: holder.Balance.Owner,
        balance: balance,
        percentage: parseFloat(percentage.toFixed(4)),
        lastUpdated: holder.Block?.Time || null
      };
    });
  };
  
  /**
   * Transform latest trades data from Bitquery format to our format
   * @param {object} bitqueryData - Raw data from Bitquery
   * @returns {Array} - Transformed latest trades array
   */
  const transformLatestTradesData = (bitqueryData) => {
    if (!bitqueryData.Solana?.DEXTradeByTokens) {
      return [];
    }
    
    return bitqueryData.Solana.DEXTradeByTokens.map((trade, index) => ({
      tradeId: `${trade.Transaction.Signature}-${index}`,
      timestamp: trade.Block.Time,
      transactionSignature: trade.Transaction.Signature,
      marketAddress: trade.Trade.Market?.MarketAddress || 'Unknown',
      dex: {
        protocolName: trade.Trade.Dex?.ProtocolName || 'Unknown',
        protocolFamily: trade.Trade.Dex?.ProtocolFamily || 'Unknown'
      },
      amount: parseFloat(trade.Trade.Amount) || 0,
      amountInUSD: parseFloat(trade.Trade.AmountInUSD) || 0,
      priceInUSD: parseFloat(trade.Trade.PriceInUSD) || 0,
      currency: {
        name: trade.Trade.Currency?.Name || 'Unknown'
      },
      side: {
        type: trade.Trade.Side?.Type || 'unknown',
        currency: {
          symbol: trade.Trade.Side?.Currency?.Symbol || 'N/A',
          mintAddress: trade.Trade.Side?.Currency?.MintAddress || null,
          name: trade.Trade.Side?.Currency?.Name || 'Unknown'
        },
        amount: parseFloat(trade.Trade.Side?.Amount) || 0,
        amountInUSD: parseFloat(trade.Trade.Side?.AmountInUSD) || 0
      }
    }));
  };
  
  /**
   * Transform trades by wallet data from Bitquery format to our format
   * @param {object} bitqueryData - Raw data from Bitquery
   * @returns {Array} - Transformed wallet trades array
   */
  const transformTradesByWalletData = (bitqueryData) => {
    if (!bitqueryData.Solana?.DEXTrades) {
      return [];
    }
    
    return bitqueryData.Solana.DEXTrades.map((trade, index) => ({
      tradeId: `${trade.Transaction.Signature}-${index}`,
      timestamp: trade.Block.Time,
      transactionSignature: trade.Transaction.Signature,
      signer: trade.Transaction.Signer,
      programMethod: trade.Instruction?.Program?.Method || 'Unknown',
      buy: {
        amount: parseFloat(trade.Trade.Buy?.Amount) || 0,
        amountInUSD: parseFloat(trade.Trade.Buy?.AmountInUSD) || 0,
        accountAddress: trade.Trade.Buy?.Account?.Address || null,
        currency: {
          name: trade.Trade.Buy?.Currency?.Name || 'Unknown',
          symbol: trade.Trade.Buy?.Currency?.Symbol || 'N/A',
          mintAddress: trade.Trade.Buy?.Currency?.MintAddress || null,
          decimals: trade.Trade.Buy?.Currency?.Decimals || 9
        }
      },
      sell: {
        amount: parseFloat(trade.Trade.Sell?.Amount) || 0,
        amountInUSD: parseFloat(trade.Trade.Sell?.AmountInUSD) || 0,
        accountAddress: trade.Trade.Sell?.Account?.Address || null,
        currency: {
          name: trade.Trade.Sell?.Currency?.Name || 'Unknown',
          symbol: trade.Trade.Sell?.Currency?.Symbol || 'N/A',
          mintAddress: trade.Trade.Sell?.Currency?.MintAddress || null,
          decimals: trade.Trade.Sell?.Currency?.Decimals || 9
        }
      }
    }));
  };
  
  /**
   * Transform bonding curve data from Bitquery format to our format
   * @param {object} bitqueryData - Raw data from Bitquery
   * @returns {object} - Transformed bonding curve data
   */
  const transformBondingCurveData = (bitqueryData) => {
    if (!bitqueryData.Solana?.DEXPools || bitqueryData.Solana.DEXPools.length === 0) {
      throw new Error('NO_POOL_DATA_FOUND');
    }
    
    const pool = bitqueryData.Solana.DEXPools[0];
    
    return {
      bondingCurveProgress: parseFloat(pool.Bonding_Curve_Progress_precentage) || 0,
      pool: {
        marketAddress: pool.Pool.Market?.MarketAddress || null,
        baseCurrency: {
          mintAddress: pool.Pool.Market?.BaseCurrency?.MintAddress || null,
          symbol: pool.Pool.Market?.BaseCurrency?.Symbol || 'N/A',
          name: pool.Pool.Market?.BaseCurrency?.Name || 'Unknown'
        },
        quoteCurrency: {
          mintAddress: pool.Pool.Market?.QuoteCurrency?.MintAddress || null,
          symbol: pool.Pool.Market?.QuoteCurrency?.Symbol || 'N/A',
          name: pool.Pool.Market?.QuoteCurrency?.Name || 'Unknown'
        },
        dex: {
          protocolFamily: pool.Pool.Dex?.ProtocolFamily || 'Unknown',
          protocolName: pool.Pool.Dex?.ProtocolName || 'Unknown'
        },
        quote: {
          postAmount: parseFloat(pool.Pool.Quote?.PostAmount) || 0,
          priceInUSD: parseFloat(pool.Pool.Quote?.PriceInUSD) || 0,
          postAmountInUSD: parseFloat(pool.Pool.Quote?.PostAmountInUSD) || 0
        },
        base: {
          balance: parseFloat(pool.Pool.Base?.Balance) || 0
        }
      }
    };
  };
  
  /**
   * Transform top PumpFun tokens data from Bitquery format to our format
   * @param {object} bitqueryData - Raw data from Bitquery
   * @returns {Array} - Transformed top tokens array
   */
  const transformTopPumpfunTokensData = (bitqueryData) => {
    if (!bitqueryData.Solana?.DEXTrades) {
      return [];
    }
    
    return bitqueryData.Solana.DEXTrades.map((trade, index) => ({
      rank: index + 1,
      price: parseFloat(trade.Trade.Buy?.Price) || 0,
      priceInUSD: parseFloat(trade.Trade.Buy?.PriceInUSD) || 0,
      currency: {
        name: trade.Trade.Buy?.Currency?.Name || 'Unknown',
        symbol: trade.Trade.Buy?.Currency?.Symbol || 'N/A',
        mintAddress: trade.Trade.Buy?.Currency?.MintAddress || null,
        decimals: trade.Trade.Buy?.Currency?.Decimals || 9,
        fungible: trade.Trade.Buy?.Currency?.Fungible || true,
        uri: trade.Trade.Buy?.Currency?.Uri || null
      }
    }));
  };
  
  /**
   * Transform LetsBonk.fun tokens data from Bitquery format to our format
   * @param {object} bitqueryData - Raw data from Bitquery
   * @returns {Array} - Transformed LetsBonk tokens array
   */
  const transformLetsBonkTokensData = (bitqueryData) => {
    if (!bitqueryData.Solana?.DEXPools) {
      return [];
    }
    
    return bitqueryData.Solana.DEXPools.map((poolData, index) => ({
      rank: index + 1,
      bondingCurveProgress: parseFloat(poolData.Bonding_Curve_Progress_precentage) || 0,
      pool: {
        marketAddress: poolData.Pool.Market?.MarketAddress || null,
        baseCurrency: {
          mintAddress: poolData.Pool.Market?.BaseCurrency?.MintAddress || null,
          symbol: poolData.Pool.Market?.BaseCurrency?.Symbol || 'N/A',
          name: poolData.Pool.Market?.BaseCurrency?.Name || 'Unknown'
        },
        quoteCurrency: {
          mintAddress: poolData.Pool.Market?.QuoteCurrency?.MintAddress || null,
          symbol: poolData.Pool.Market?.QuoteCurrency?.Symbol || 'N/A',
          name: poolData.Pool.Market?.QuoteCurrency?.Name || 'Unknown'
        },
        dex: {
          protocolFamily: poolData.Pool.Dex?.ProtocolFamily || 'Unknown',
          protocolName: poolData.Pool.Dex?.ProtocolName || 'Unknown'
        },
        base: {
          balance: parseFloat(poolData.Pool.Base?.Balance) || 0
        },
        quote: {
          postAmount: parseFloat(poolData.Pool.Quote?.PostAmount) || 0,
          priceInUSD: parseFloat(poolData.Pool.Quote?.PriceInUSD) || 0,
          postAmountInUSD: parseFloat(poolData.Pool.Quote?.PostAmountInUSD) || 0
        }
      }
    }));
  };
  
  /**
   * Transform Raydium Launchpad tokens data from Bitquery format to our format
   * Uses same structure as LetsBonk tokens
   * @param {object} bitqueryData - Raw data from Bitquery
   * @returns {Array} - Transformed Raydium tokens array
   */
  const transformRaydiumTokensData = (bitqueryData) => {
    return transformLetsBonkTokensData(bitqueryData);
  };
  
  /**
   * Transform Raydium graduated tokens data from Bitquery format to our format
   * @param {object} bitqueryData - Raw data from Bitquery
   * @returns {Array} - Transformed graduated tokens array
   */
  const transformRaydiumGraduatedData = (bitqueryData) => {
    if (!bitqueryData.Solana?.Instructions) {
      return [];
    }
    
    return bitqueryData.Solana.Instructions.map((instruction, index) => ({
      rank: index + 1,
      timestamp: instruction.Block?.Time || null,
      transaction: {
        signature: instruction.Transaction?.Signature || null,
        signer: instruction.Transaction?.Signer || null
      },
      program: {
        method: instruction.Instruction?.Program?.Method || 'Unknown',
        address: instruction.Instruction?.Program?.Address || null,
        name: instruction.Instruction?.Program?.Name || 'Unknown',
        accountNames: instruction.Instruction?.Program?.AccountNames || []
      },
      arguments: instruction.Instruction?.Program?.Arguments?.map(arg => ({
        name: arg.Name || null,
        type: arg.Type || null,
        value: extractArgumentValue(arg.Value)
      })) || [],
      accounts: instruction.Instruction?.Accounts?.map(account => ({
        address: account.Address || null,
        isWritable: account.IsWritable || false,
        token: {
          programId: account.Token?.ProgramId || null,
          owner: account.Token?.Owner || null,
          mint: account.Token?.Mint || null
        }
      })) || []
    }));
  };
  
  /**
   * Helper function to extract argument value from various types
   * @param {object} value - Argument value object
   * @returns {any} - Extracted value
   */
  const extractArgumentValue = (value) => {
    if (!value) return null;
    
    if (value.json !== undefined) return value.json;
    if (value.float !== undefined) return value.float;
    if (value.bool !== undefined) return value.bool;
    if (value.hex !== undefined) return value.hex;
    if (value.bigInteger !== undefined) return value.bigInteger;
    if (value.address !== undefined) return value.address;
    if (value.integer !== undefined) return value.integer;
    if (value.string !== undefined) return value.string;
    
    return null;
  };
  
  module.exports = {
    transformTokenPriceData,
    transformWalletTradesData,
    transformBalanceUpdatesData,
    transformTokenMetadataData,
    transformTopHoldersData,
    transformLatestTradesData,
    transformTradesByWalletData,
    transformBondingCurveData,
    transformTopPumpfunTokensData,
    transformLetsBonkTokensData,
    transformRaydiumTokensData,
    transformRaydiumGraduatedData
  };