// src/utils/validator.js

/**
 * Validates a Solana address (base58 format, 32-44 characters)
 */
const isValidSolanaAddress = (address) => {
    if (!address || typeof address !== 'string') {
      return false;
    }
    
    // Solana addresses are base58 encoded and typically 32-44 characters
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
  };
  
  /**
   * Validates an array of Solana addresses
   */
  const isValidSolanaAddressArray = (addresses) => {
    if (!Array.isArray(addresses) || addresses.length === 0) {
      return false;
    }
    
    return addresses.every(addr => isValidSolanaAddress(addr));
  };
  
  /**
   * Validates a positive integer
   */
  const isValidPositiveInteger = (value) => {
    const num = parseInt(value, 10);
    return !isNaN(num) && num > 0 && Number.isInteger(num);
  };
  
  /**
   * Validates a date string (ISO 8601 format)
   */
  const isValidDateString = (dateString) => {
    if (!dateString) return true; // Optional parameter
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };
  
  /**
   * Validates limit parameter (1-1000)
   */
  const isValidLimit = (limit) => {
    if (!limit) return true; // Optional parameter
    
    const num = parseInt(limit, 10);
    return !isNaN(num) && num >= 1 && num <= 1000;
  };
  
  /**
   * Sanitizes string input to prevent injection
   */
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    // Remove potential harmful characters but keep alphanumeric and common symbols
    return str.replace(/[^\w\s\-_.@]/gi, '');
  };
  
  /**
   * Validation middleware factory
   */
  const validate = (schema) => {
    return (req, res, next) => {
      const errors = [];
      
      // Validate each field in schema
      for (const [field, rules] of Object.entries(schema)) {
        const value = req.body[field];
        
        // Check required fields
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`${field} is required`);
          continue;
        }
        
        // Skip validation if field is optional and not provided
        if (!rules.required && (value === undefined || value === null || value === '')) {
          continue;
        }
        
        // Type validations
        if (rules.type === 'solanaAddress' && !isValidSolanaAddress(value)) {
          errors.push(`${field} must be a valid Solana address`);
        }
        
        if (rules.type === 'solanaAddressArray' && !isValidSolanaAddressArray(value)) {
          errors.push(`${field} must be an array of valid Solana addresses`);
        }
        
        if (rules.type === 'positiveInteger' && !isValidPositiveInteger(value)) {
          errors.push(`${field} must be a positive integer`);
        }
        
        if (rules.type === 'date' && !isValidDateString(value)) {
          errors.push(`${field} must be a valid ISO date string`);
        }
        
        if (rules.type === 'limit' && !isValidLimit(value)) {
          errors.push(`${field} must be between 1 and 1000`);
        }
        
        // Custom validator function
        if (rules.validator && typeof rules.validator === 'function') {
          const customError = rules.validator(value);
          if (customError) {
            errors.push(customError);
          }
        }
      }
      
      // Return errors if any
      if (errors.length > 0) {
        return res.status(400).json({
          status: 'error',
          timestamp: new Date().toISOString(),
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input parameters',
            details: errors
          }
        });
      }
      
      next();
    };
  };
  
  module.exports = {
    isValidSolanaAddress,
    isValidSolanaAddressArray,
    isValidPositiveInteger,
    isValidDateString,
    isValidLimit,
    sanitizeString,
    validate
  };