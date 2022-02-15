module.exports = function logError(err, req, res, next) {
  console.error(err.message);
  next(err);
};
