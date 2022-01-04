
module.exports = function (err, req, res, next) {
    if (res.headersSent) {
        next(err);
    };
    res.status(500).json({
        error : true,
        message : err.message || "Something went wrong, try again later"
    }).end();
}
