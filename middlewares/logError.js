
module.exports = function (err, req, res, next) {
    console.error(err.message);
    next(err);
}
