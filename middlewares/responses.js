
module.exports = {
    
    invalidCredentials : function (res) {
        return res.status(403).json({
            error : true,
            data : "Invalid credentials"
        });
    },

    notFound : function (req, res, next) {
        return res.status(404).json({
            error : true,
            data : "Not Found"
        })
    },

    ok: function (data="ok", res) {
        return res.status(200).json({
            success : true,
            data: data
        });
    },

    created : function (data="201 Created", res) {
        return res.status(200).json({
            success : true,
            data: data
        });
    },

    upload : function (res) {
        return res.status(204).json({
            success : true,
            data: "Ok"
        });
    },

    deleted : function (res) {
        return res.status(204).json({
            success : true,
            data: "Ok"
        });
    }

}
