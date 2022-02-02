const router = require("express").Router();
const addProductImage = require("../controllers/product").addProductImage;
const uploadStorage = require("../libs/MulterUpload");

// single image upload for product
router.post("/product/:id/image", function(req, res, next) {
    // req.file is the name of your file in the form above
    // req.body will hold the text fields, if there were any 
    uploadStorage(`images/products/${req.params.id}`).single('image')(req, res, (err) => {
        return next(err);
    });
    return addProductImage(req, res, next); // save into the product the information about his uploaded image
});
  
  // single video upload for product
router.post("/product/:id/video", function(req, res, next) {
    // req.file is the name of your file in the form above
    // req.body will hold the text fields, if there were any 
    uploadStorage(`videos/products/${req.params.id}`).single('image')(req, res, (err) => {
        return next(err);
    });
    return addProductImage(req, res, next); // save into the product the information about his uploaded image
});
  
  // multiple images upload for product
router.post("/product/:id/images", function(req, res, next) {
    // req.file is the name of your file in the form above
    // req.body will hold the text fields, if there were any 
    uploadStorage(`images/products/${req.params.id}`).array('images', 7)(req, res, (err) => {
        return next(err);
    });
    return addProductImage(req, res, next); // save into the product the information about his uploaded image
});

module.exports = router;
