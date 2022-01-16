const router = require("express").Router();
const storeController = require("../controllers/store");

router.route("/").post(storeController.createStore);
router.route("/:id").get(storeController.getStore)
    .delete(storeController.deleteStore)
    .patch(storeController.updateStore);
router.patch("/:id/settings", storeController.updateStoreSettings);

module.exports = router;
