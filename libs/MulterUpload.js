
module.exports = 
/**
 * @param {String} subDirectory 
 * This function allows you to choose when uploading a file 
 * the destination (subfolder) which must receive this file by passing the name of the subfolder as a parameter.
 */
function (subDirectory) {
    const multer = require("multer");
    // File upload
    const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `uploads/${subDirectory}`)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },
    });
    return multer({ storage: storage });
}