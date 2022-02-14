const Cm = require('../libs/ApiCrudManager');

const crudManager = new Cm();
const promoCodeModel = require('../models/promoCode');

const createPromoCode = function createPromoCod(req, res, next) {
  return crudManager.create({ req, res, next }, promoCodeModel);
};

const updatePromoCode = function upPromoCod(req, res, next) {
  return crudManager.update({ req, res, next }, promoCodeModel, []);
};

const deletePromoCode = function delPromoCod(req, res, next) {
  return crudManager.delete({ req, res, next }, promoCodeModel);
};

const getPromoCode = function getPromoCod(req, res, next) {
  return crudManager.read({ req, res, next }, promoCodeModel);
};

module.exports = {
  createPromoCode,
  deletePromoCode,
  getPromoCode,
  updatePromoCode,
};
