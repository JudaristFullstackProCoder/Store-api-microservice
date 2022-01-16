const router = require("express").Router();
const categoryController = require("../controllers/category");

router.route("/")
    .post(categoryController.createCategory);
router.route("/:id")
    .get(categoryController.getCategory)
    .patch(categoryController.updatecategory)
    .delete(categoryController.deletecategory);

router.route("/childs").post(categoryController.createChildCategory);
router.route("/childs/:id")
    .delete(categoryController.deleteChildCategory)
    .get(categoryController.getChildCategory)
    .patch(categoryController.updateChildCategory);
router.route("/childs/:id/options")
    .delete(categoryController.deleteChildCategoryOption)
    .put(categoryController.addChildCategoryOption);

module.exports = router;
