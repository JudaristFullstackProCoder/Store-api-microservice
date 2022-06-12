const router = require('express').Router();
const productController = require('../controllers/product');

router.post('/', productController.createProduct);
router.route('/:id').get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

router.route('/:id/option')
  .post(productController.addProductOption);
router.post('/:id/option/:optionId')
  .post(productController.addProductOptionByParams);
router.route('/:id/option/:optionId')
  .delete(productController.deleteProductOption)
  .patch(productController.updateProductOption)
  .get(productController.getProductOption);

router.route('/:id/variation').post(productController.addProductVariation)
  .get(productController.getAllProductVariations);
router.route('/:id/variation/:variationId')
  .delete(productController.deleteProductVariation)
  .patch(productController.updateProductVariation)
  .get(productController.getProductVariation);
router.route('/:id/variation/:variationId/option')
  .post(productController.addProductVariationOption);
router.route('/:id/variation/:variationId/option/:optionId')
  .delete(productController.deleteProductVariationOption)
  .patch(productController.updateProductVariationOption)
  .get(productController.getProductVariationOption);

module.exports = router;
