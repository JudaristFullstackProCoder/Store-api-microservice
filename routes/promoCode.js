const router = require('express').Router();
const promoCodeController = require('../controllers/promoCode');

router.route('/:id').get(promoCodeController.getPromoCode)
  .delete(promoCodeController.deletePromoCode).patch(promoCodeController.updatePromoCode);
router.route('/').post(promoCodeController.createPromoCode);

module.exports = router;
