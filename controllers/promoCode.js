const cm = require("../libs/ApiCrudManager");
const crudManager = new cm();
const promoCodeModel = require("../models/promoCode");

const createPromoCode = function (req, res, next) {
    return crudManager.create({req, res, next}, promoCodeModel);
}

const updatePromoCode = function (req, res, next) {
    return crudManager.update({req, res, next}, promoCodeModel, []);
}

const deletePromoCode = function (req, res, next) {
    return crudManager.delete({req, res, next}, promoCodeModel);
}

const getPromoCode = function (req, res, next) {
    return crudManager.read({req, res, next}, promoCodeModel);
}

module.exports = {
    createPromoCode : createPromoCode,
    deletePromoCode : deletePromoCode,
    getPromoCode : getPromoCode,
    updatePromoCode : updatePromoCode
}
