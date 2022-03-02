const router = require('express').Router();
const productController = require('../controllers/product');

router.post('/', productController.createProduct);
router.route('/:id').get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

router.route('/:id/option')
  .post(productController.addProductOption);
router.route('/:id/option/:option_id').delete(productController.deleteProductOption)
  .patch(productController.updateProductOption).get(productController.getProductOption);

module.exports = router;
