const log = require('../libs/log');

module.exports = function logError(err, req, res, next) {
  log.error(err.message);
  return next(err);
};
