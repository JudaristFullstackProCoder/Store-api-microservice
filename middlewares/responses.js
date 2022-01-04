
module.exports = {
    
    invalidCredentials : function (res) {
        res.status(403).json({
            error : true,
            message : "Invalid credentials"
        });
    },

    notFound : function (req, res, next) {
        return res.status(404).json({
            error : true,
            data : "Not Found"
        })
    }
}
