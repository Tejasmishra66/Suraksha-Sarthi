function asyncHandler(handler) {
  // Wraps async controllers to pass rejected promises to error middleware.
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
