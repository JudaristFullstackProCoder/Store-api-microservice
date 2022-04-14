const router = require('express').Router();
const productController = require('../controllers/product');

router.post('/', productController.createProduct);
router.route('/:id').get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

router.route('/:id/option')
  .post(productController.addProductOption);
router.route('/:id/option/:optionId').delete(productController.deleteProductOption)
  .patch(productController.updateProductOption).get(productController.getProductOption);

router.route('/:id/variable').post(productController.addProductVariation);
router.route('/:id/variable/:variableId')
  .delete(productController.deleteProductVariation)
  .patch(productController.updateProductVariation);
router.route('/:id/variable/:variableId/option').post(productController.addProductVariationOption);
router.route('/:id/variable/:variableId/option/:optionId')
  .delete(productController.deleteProductVariationOption)
  .patch(productController.updateProductVariationOption)
  .get(productController.getProductVariationOption);

module.exports = router;
