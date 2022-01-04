
module.exports = function (req, res, next) {
    return require("./responses").notFound(req, res, next);
}
