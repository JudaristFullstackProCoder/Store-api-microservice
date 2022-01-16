const responses = require("../middlewares/responses");
const Product = require("../models/product").model;
const requiredFields = require("../models/product").requiredFields;
const Mongoose = require("mongoose");

const createProduct = async function (req, res, next) {
    // required fields
    for (let i = 0; i <requiredFields.length; i++) {
        if(!req.body[requiredFields[i]]){
            return next(new Error(`${requiredFields[i]} is required`));
        }
    }

    let product =  new Product(req.body);
    try{
        product = await product.save();
    }catch(err){
        return next(err);
    }
   return responses.ok(product, res);
}

const getProduct = async function (req, res, next) {
    let product = null;
    try{
        product = await Product.findOne({ 
            _id: req.params.id,
        }).populate("options.option", "name").exec();
    }catch(err){
        return next(err);
    }
    return responses.ok(product, res);
}

const updateProduct = async function (req, res, next) {
    let updated = null;
    try {
        updated = await Product.findOneAndUpdate({
            _id: new Mongoose.Types.ObjectId(req.params.id || "")
        }, req.body,{
            new: true
        }).exec();
    }catch(err){
        return next(err);
    }
    return responses.ok(updated, res);
}

const deleteProduct = async function (req, res, next) {
    let deleted = null;
    try {
        deleted = await Product.findOneAndDelete({
            _id: new Mongoose.Types.ObjectId(req.params.id)
        }).exec();
    }catch(err){
        return next(err);
    }
    return responses.ok(deleted, res);
}

const addProductOption = async function (req, res, next) {
    // required fields
    const rf = require("../models/product").productOptionsRequiredFields;
    for (let i = 0; i <rf.length; i++) {
        if(!req.body[rf[i]]){
            return next(new Error(`${rf[i]} is required`));
        }
    }

    Product.updateOne({
        _id: req.params.id
    }, {
        $push : {options : { option: req.body.option, value: req.body.value }}
    }, {new : true} , function (err, product) {
        if (err) return next(err);
        return responses.ok(product, res);
    })
}

const deleteProductOption = async function (req, res, next) {
    // required fields
    let rf = ["option"] // the id of option that will be removed
    for (let i = 0; i <rf.length; i++) {
        if(!req.body[rf[i]]){
            return next(new Error(`${rf[i]} is required`));
        }
    }

    Product.updateOne({
        _id : req.params.id
    }, {
        $pull : { options : {option : req.body.option } }
    }, {}, function(err, result) {
        if (err) return next(err);
        return res.ok(result);
    })
}

/**
 * When an image is uploaded for a product this method is called to
 * store informations of an image of a product
 * @returns 
 */
const addProductImage = async function (req, res, next)  {
    // This method is called when we upload an image for a product
    // Store all informatios about uploaded image into the product
    try{
        Product.findOneAndUpdate({
            _id : new Mongoose.Types.ObjectId(req.params.id)
        }, {
            image : req.file
        }, {new: true}, function (err, success) {
            if(err) return next(err);
            return responses.upload(res);
        });
    }catch(err){
        return next(err);
    }
}

module.exports = {
    createProduct: createProduct,
    getProduct: getProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    addProductOption : addProductOption,
    deleteProductOption : deleteProductOption,
    addProductImage : addProductImage
}
