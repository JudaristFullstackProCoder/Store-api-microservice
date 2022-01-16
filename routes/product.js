const router = require("express").Router();
const productController = require("../controllers/product");

router.post("/", productController.createProduct);
router.route("/:id").get(productController.getProduct)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct);
    
router.route("/:id/options")
    .post(productController.addProductOption)
    .delete(productController.deleteProductOption);

module.exports = router;
