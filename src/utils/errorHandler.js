// src/utils/errorHandler.js

/**
 * Standard error response structure
 */
const createErrorResponse = (code, message, details = null) => {
    const response = {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        code,
        message
      }
    };
    
    if (details) {
      response.error.details = details;
    }
    
    return response;
  };
  
  /**
   * Maps internal errors to user-friendly messages (hides Bitquery references)
   */
  const mapErrorToResponse = (error) => {
    // Network/timeout errors
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return {
        statusCode: 504,
        response: createErrorResponse(
          'GATEWAY_TIMEOUT',
          'The request took too long to process. Please try again.'
        )
      };
    }
    
    // Connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return {
        statusCode: 503,
        response: createErrorResponse(
          'SERVICE_UNAVAILABLE',
          'Service temporarily unavailable. Please try again later.'
        )
      };
    }
    
    // Rate limit errors (from Bitquery or our own)
    if (error.response?.status === 429) {
      return {
        statusCode: 429,
        response: createErrorResponse(
          'RATE_LIMIT_EXCEEDED',
          'Too many requests. Please slow down and try again later.'
        )
      };
    }
    
    // Authentication errors (Bitquery API key issues)
    if (error.response?.status === 401 || error.response?.status === 403) {
      return {
        statusCode: 500,
        response: createErrorResponse(
          'INTERNAL_ERROR',
          'An internal error occurred. Please contact support.'
        )
      };
    }
    
    // Bad request from upstream (usually our query is wrong)
    if (error.response?.status === 400) {
      return {
        statusCode: 400,
        response: createErrorResponse(
          'INVALID_REQUEST',
          'The request could not be processed. Please check your parameters.'
        )
      };
    }
    
    // No data found
    if (error.message?.includes('NO_DATA_FOUND')) {
      return {
        statusCode: 404,
        response: createErrorResponse(
          'NO_DATA_FOUND',
          'No data found for the provided parameters.'
        )
      };
    }
    
    // Default internal server error
    return {
      statusCode: 500,
      response: createErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred. Please try again later.'
      )
    };
  };
  
  /**
   * Express error handling middleware
   */
  const errorMiddleware = (err, req, res, next) => {
    console.error('Error occurred:', {
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
    
    const { statusCode, response } = mapErrorToResponse(err);
    res.status(statusCode).json(response);
  };
  
  /**
   * Async handler wrapper to catch async errors
   */
  const asyncHandler = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };
  
  /**
   * 404 Not Found handler
   */
  const notFoundHandler = (req, res) => {
    res.status(404).json(
      createErrorResponse(
        'NOT_FOUND',
        `Endpoint ${req.method} ${req.path} not found`
      )
    );
  };
  
  /**
   * Success response helper
   */
  const createSuccessResponse = (data, meta = null) => {
    const response = {
      status: 'success',
      timestamp: new Date().toISOString(),
      data
    };
    
    if (meta) {
      response.meta = meta;
    }
    
    return response;
  };
  
  module.exports = {
    createErrorResponse,
    mapErrorToResponse,
    errorMiddleware,
    asyncHandler,
    notFoundHandler,
    createSuccessResponse
  };