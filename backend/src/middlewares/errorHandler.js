const logger = require("../utils/logger");

function errorHandler(error, _req, res, _next) {
  // Centralized error response middleware for all routes.
  logger.error({ message: error.message, stack: error.stack });
  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error"
  });
}

module.exports = errorHandler;
