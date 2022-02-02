const router = require("express").Router();
const addProductImage = require("../controllers/product").addProductImage;
const uploadStorage = require("../libs/MulterUpload");
const addProductAdditionalImage = require("../controllers/product").addProductAdditionalsImages;
const fs = require("fs");

/**
 * @param {string} "audio|video" fileType 
 */
function addFileToProduct (req, res, next) {
    // req.file is the name of your file in the form above
    // req.body will hold the text fields, if there were any 
    let fileToDelete = `/products/${req.params.id}/featured`;

    if (fs.readdirSync(`/products/${req.params.id}/featured`).length == 1){
        // then product already have a featured image
        fileToDelete = fileToDelete + fs.readdirSync(fileToDelete)[0];
    }

    let fileType = "image";
    if (req.route.path === "/product/:id/video"){
        fileType = "video";
    }

    uploadStorage(`/products/${req.params.id}/featured`, fileType).single('image')(req, res, (err) => {
        return next(err);
    });

    // Delete the old image if it exist
    if (fs.readdirSync(`/products/${req.params.id}/featured`).length > 1){
        fs.unlink(fileToDelete);
    }
    return addProductImage(req, res, next); // save into the product the information about his uploaded image
}

// Each time an image is uploaded, it's stored in a directory with the name equal to the id of the product

// single image (featured image) upload for product
router.post("/product/:id/image", addFileToProduct);
  
  // single video upload for product
router.post("/product/:id/video", addFileToProduct);
  
  // multiple images upload for product
router.post("/product/:id/images", function(req, res, next) {
    // req.file is the name of your file in the form above
    // req.body will hold the text fields, if there were any 

    // product max additionals images is 5
    let fileName = `/products/${req.params.id}/featured` + req.file.name;
    if (fs.readdirSync(`/products/${req.params.id}/featured`).length){
        // then product already have a featured image
       return next(new Error("Maximum number of images reached"));
    }

    uploadStorage(`/products/${req.params.id}`).array('images', 7)(req, res, (err) => {
        return next(err);
    });

    return addProductAdditionalImage(req, res, next); // save into the product the information about his uploaded image
    
});

module.exports = router;
