const responses = require('./responses');

module.exports = function NotFound(req, res, next) {
  return responses.notFound(req, res, next);
};
