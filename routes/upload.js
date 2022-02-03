const router = require("express").Router();
const addProductImage = require("../controllers/product").addProductImage;
const uploadStorage = require("../libs/MulterUpload");
const addProductAdditionalImage = require("../controllers/product").addProductAdditionalsImages;
const responses = require("../middlewares/responses");
const fs = require("fs");

/**
 * @param {string} "audio|video" fileType 
 */
function addFileToProduct (req, res, next) {
    // req.file is the name of your file in the form above
    // req.body will hold the text fields, if there were any 
    let filePath = `${req.params.id}/featured`;
    let fileType = "image";

    // If we want to upload a video
    if (req.route.path === "/product/:id/video"){
        fileType = "video";
        filePath = `${req.params.id}/video`;
    }
    
    let fileToDelete = 'uploads/'+filePath; 

    if (!fs.existsSync('uploads/'+filePath)) {
        fs.mkdirSync('uploads/'+filePath, {recursive : true});
    }
    
    let fileDirectoryLength = fs.readdirSync('uploads/'+filePath).length;

    if (fileDirectoryLengthh = 1){
        // then product already have a featured image or a video.
        fileToDelete = 'uploads/'+filePath + '/' + fs.readdirSync('uploads/'+filePath)[0];
    }

    //  we pass the next:Express.NextFunction to this function to handle error when uploading or when 
    // when file validation failed
    uploadStorage(filePath, fileType).single('image')(req, res, next);
    
    // Delete the old image if it exist
    if (fileDirectoryLength > 1){
        fs.unlinkSync(fileToDelete);
    }

    return addProductImage(req, res, next); // save into the product the information about his uploaded image

}

// Each time an image is uploaded, it's stored in a directory with the name equal to the id of the product

// single image (featured image) upload for product
router.post("/product/:id/image", addFileToProduct);

router.delete("/product/:id/image/:name", function(req, res, next) {
    try{
        fs.unlinkSync(`uploads/${req.params.id}/${req.params.name}`);
    }catch(err){
        return next(err);
    }
    return responses.deleted(res);
})
  
  // single video upload for product
router.post("/product/:id/video", addFileToProduct);

router.delete("/product/:id/video/:name", function(req, res, next) {
    try{
        fs.unlinkSync(`uploads/${req.params.id}/video/${req.params.name}`);
    }catch(err){
        return next(err);
    }
    return responses.deleted(res);
})

  // multiple images upload for product
router.post("/product/:id/images", function(req, res, next) {
    // req.file is the name of your file in the form above
    // req.body will hold the text fields, if there were any 

    // product max additionals images is 5
    let filePath = `${req.params.id}` + req.file.name;
    // filePath : equal the id of the product, then uploaded images will be stored in this folder
    if (fs.readdirSync(`uploads/${filePath}}`).length >5){
        // then product already have a featured image
       return next(new Error("Maximum number of images reached"));
    }

    uploadStorage(`uploads/${filePath}`).array('images', 5);

    return addProductAdditionalImage(req, res, next); // save into the product the information about his uploaded image
    
});

// Delete one additoonal images of a product
router.delete("/product/:id/images/:name", function(req, res, next) {
    try{
        fs.unlinkSync(`uploads/${req.params.id}/${req.params.name}`);
    }catch(err){
        return next(err);
    }
    return responses.deleted(res);
})

module.exports = router;
