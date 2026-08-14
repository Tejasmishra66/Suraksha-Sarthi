const logger = require("../utils/logger");

function errorHandler(error, _req, res, _next) {
  // Centralized error response middleware for all routes.
  logger.error({ message: error.message, stack: error.stack });
  
  const isProd = process.env.NODE_ENV === 'production';
  const isServerError = !error.statusCode || error.statusCode === 500;
  
  return res.status(error.statusCode || 500).json({
    message: (isProd && isServerError) ? "Internal server error" : (error.message || "Internal server error")
  });
}

module.exports = errorHandler;
