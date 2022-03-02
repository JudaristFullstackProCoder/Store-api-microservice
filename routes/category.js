const router = require('express').Router();
const categoryController = require('../controllers/category');

router.route('/')
  .post(categoryController.createCategory);
router.route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

router.route('/child').post(categoryController.createChildCategory);
router.route('/child/:id')
  .delete(categoryController.deleteChildCategory)
  .get(categoryController.getChildCategory)
  .patch(categoryController.updateChildCategory);
router.route('/child/:id/option')
  .delete(categoryController.deleteChildCategoryOption)
  .put(categoryController.addChildCategoryOption);

module.exports = router;
