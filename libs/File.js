const fs = require('fs');

const deleteFile = function delFile(filePath) {
  fs.unlinkSync(filePath);
};

module.exports = {
  delete: deleteFile,
};
