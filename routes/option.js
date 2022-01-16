const router = require("express").Router();
const optionsController = require("../controllers/options");

router.route("/:id").get(optionsController.getOption)
    .patch(optionsController.updateOption)
    .delete(optionsController.deleteOption);
router.route("/").post(optionsController.createOption);

module.exports = router;
