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

router.route('/:id/variable').post(productController.addProductComposition);
router.route('/:id/variable/:variableId')
  .delete(productController.deleteProductComposition)
  .patch(productController.updateProductComposition);
router.route('/:id/variable/:variableId').post(productController.addProductCompositionOption);
router.route('/:id/variable/:variableId/option')
  .post(productController.addProductCompositionOption)
  .delete(productController.deleteProductCompositionOption)
  .patch(productController.updateProductCompositonOption);

module.exports = router;
