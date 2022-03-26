const Console = require('../libs/logger');

module.exports = function logError(err, req, res, next) {
  Console.error(err.message);
  return next(err);
};
