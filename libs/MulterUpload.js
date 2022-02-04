const fs = require('fs');
const path = require('path');

module.exports = 
/**
 * @param {String} subDirectory 
 * @throws {Error}
 * This function allows you to choose when uploading a file 
 * the destination (subfolder) which must receive this file by passing the name of the subfolder as a parameter.
 */
function (subDirectory, fileType="image") {
    const multer = require("multer");
    // Create the destination directory if it doesn't exist'

    if (!fs.existsSync(`uploads/${subDirectory}`)) {
        fs.mkdirSync(`uploads/${subDirectory}`, {recursive : false});
    }

    // diskStorage
    const storage = multer.diskStorage({
        destination: (_req, file, cb) => {
          cb(null, `uploads/${subDirectory}`);
        },
        filename: (_req, file, cb) => {
            cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });
    
    return multer({
      storage: storage, 
      limits: {},
       fileFilter : (_req, file, FileFilterCallback) => {
          return checkFileType(file, fileType, FileFilterCallback);
      }
    });
}

function checkFileType(file,fileType, FileFilterCallback){
  // Allowed ext
  
  let filetypes = /jpeg|jpg|png|gif/;

  if (fileType === "video") {
    filetypes = /.mp4|.mkv|.avi|.m4v|.ogv|.ogg /
  }
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  
  if(!mimetype || !extname){
    return FileFilterCallback(new Error('This file is not a valid'), false);
  }

  return FileFilterCallback(null , true);

}
