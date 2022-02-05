const fs = require("fs");

const deleteFile = function (filePath) {
    fs.unlinkSync(filePath);
}

module.exports = {
    delete : deleteFile
}