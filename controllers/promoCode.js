const cm = require("../libs/ApiCrudManager");
const crudManager = new cm();
const promoCodeModel = require("../models/promoCode");

const createPromoCode = function (req, res, next) {
    return crudManager.create({req:req, res:res, next:next}, promoCodeModel);
}

const updatePromoCode = function (req, res, next) {
    return crudManager.update({req:req, res:res, next:next}, promoCodeModel, []);
}

const deletePromoCode = function (req, res, next) {
    return crudManager.delete({req:req, res:res, next:next}, promoCodeModel);
}

const getPromoCode = function (req, res, next) {
    return crudManager.read({req:req, res:res, next:next}, promoCodeModel);
}

module.exports = {
    createPromoCode : createPromoCode,
    deletePromoCode : deletePromoCode,
    getPromoCode : getPromoCode,
    updatePromoCode : updatePromoCode
}
