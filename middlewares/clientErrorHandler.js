module.exports = function clientErrHandl(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({
    error: true,
    data: err.message || 'Something went wrong, try again later',
  }).end();
};
