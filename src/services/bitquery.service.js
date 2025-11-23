// src/services/bitquery.service.js
const axios = require('axios');
const config = require('../config/environment');

/**
 * Core service for communicating with Bitquery API
 * This module handles all GraphQL requests and hides Bitquery implementation details
 */
class BitqueryService {
  constructor() {
    this.apiKeys = config.bitquery.apiKeys;
    this.currentKeyIndex = 0;
    this.endpoint = config.bitquery.endpoint;
    this.timeout = config.bitquery.timeout;
    
    this.initializeClient();
  }

  initializeClient() {
    const currentKey = this.apiKeys[this.currentKeyIndex];
    console.log(`Initializing Bitquery client with key index: ${this.currentKeyIndex}`);
    
    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.endpoint,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentKey}`
      }
    });
  }

  rotateKey() {
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    console.log(`Switching to Bitquery API key index: ${this.currentKeyIndex}`);
    this.initializeClient();
  }
  
  /**
   * Execute a GraphQL query against Bitquery
   * @param {string} query - The GraphQL query string
   * @param {object} variables - Variables for the GraphQL query (optional)
   * @param {number} retryCount - Internal retry counter
   * @returns {Promise<object>} - The query result data
   */
  async executeQuery(query, variables = {}, retryCount = 0) {
    try {
      const response = await this.client.post('', {
        query,
        variables
      });
      
      // Check for GraphQL errors in response
      if (response.data.errors) {
        // Check if error is related to limits or auth
        const errorMsg = JSON.stringify(response.data.errors);
        if (errorMsg.includes('limit') || errorMsg.includes('quota') || errorMsg.includes('unauthorized')) {
          throw new Error('API_LIMIT_OR_AUTH_ERROR');
        }
        
        console.error('GraphQL errors:', response.data.errors);
        throw new Error('QUERY_ERROR');
      }
      
      // Check if data exists
      if (!response.data.data) {
        throw new Error('NO_DATA_FOUND');
      }
      
      return response.data.data;
    } catch (error) {
      // Check for retryable errors (429, 401, 403, or custom limit error)
      const isLimitError = error.message === 'API_LIMIT_OR_AUTH_ERROR' || 
                           (error.response && [429, 402, 401, 403].includes(error.response.status));

      if (isLimitError && retryCount < this.apiKeys.length) {
        console.warn(`Bitquery API limit reached or auth failed. Rotating key and retrying (Attempt ${retryCount + 1})...`);
        this.rotateKey();
        return this.executeQuery(query, variables, retryCount + 1);
      }

      // Log error for debugging (without exposing to user)
      console.error('Bitquery request failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Re-throw for error handler to process
      throw error;
    }
  }
  
  /**
   * Health check to verify Bitquery connection
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      const simpleQuery = `
        {
          Solana {
            Blocks(limit: 1) {
              Block {
                Height
              }
            }
          }
        }
      `;
      
      const result = await this.executeQuery(simpleQuery);
      return !!result.Solana;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
module.exports = new BitqueryService();