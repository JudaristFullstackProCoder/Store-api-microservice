const fs = require('fs');
const path = require('path');

module.exports = 
/**
 * @param {String} subDirectory 
 * This function allows you to choose when uploading a file 
 * the destination (subfolder) which must receive this file by passing the name of the subfolder as a parameter.
 */
function (subDirectory, fileType="image") {
    const multer = require("multer");
    // Create the destination directory if it doesn't exist'

    if (!fs.existsSync(`uploads/${subDirectory}`)) {
        fs.mkdir(`uploads/${subDirectory}`, {recursive : true}, (err) => {
            console.log(err);
        });
    }

    // diskStorage
    const storage = multer.diskStorage({
        destination: (_req, file, cb) => {
            cb(null, `uploads/${subDirectory}`)
        },
        filename: (_req, file, cb) => {
            cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        },
        fileFilter: function(_req, file, cb){
            checkFileType(file, cb, fileType);
        }
    });

    return multer({ storage: storage, limits: {} });
}

function checkFileType(file, cb, fileType){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  if (fileType === "video") {
    filetypes = /.mp4|.mkv|.avi|.m4v|.ogv|.ogg /
  }
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: This file is not supported ');
  }
}
