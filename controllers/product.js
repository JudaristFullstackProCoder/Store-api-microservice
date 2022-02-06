const responses = require("../middlewares/responses");
const Product = require("../models/product").model;
const requiredFields = require("../models/product").requiredFields;
const Mongoose = require("mongoose");
const cm = require("../libs/ApiCrudManager");
const crudManager = new cm();

const createProduct = async function (req, res, next) {
   return crudManager.create({req:req, res:res, next:next}, Product, requiredFields);
}

const getProduct = async function (req, res, next) {
    let product = null;
    try{
        product = await Product.findOne({ 
            _id: req.params.id,
        })
        .populate("options.option", "name")
        .populate("category", "name")
        .populate("compositions.options.option", "name")
        .exec();
    }catch(err){
        return next(err);
    }
    return responses.ok(product, res);
}

const updateProduct = async function (req, res, next) {
    return crudManager.update({req:req, res:res, next:next}, Product);
}

const deleteProduct = async function (req, res, next) {
    return crudManager.delete({req:req, res:res, next:next}, Product, {
        // afterDelete : delete the files directory associated with this product 
    });
}

const getAllProductWithPagination = function (req, res, next) {

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
        }, {new: true}, function (err, product) {
            if(err) return next(err);
            return responses.ok(product, res);
        });
    }catch(err){
        return next(err);
    }
}

const addProductAdditionalsImages = async function (req, res, next) {
    try {
        Product.updateOne({
            _id: req.params.id
        }, {
            $push : {images : req.file}
        }, {new : true} , function (err, product) {
            if (err) return next(err);
            return responses.ok(product, res);
        })
    }catch(err){
        return next(err);
    }
}

const addProductVideo = function (req, res, next) {
    // This method is called when we upload an image for a product
    // Store all informatios about uploaded video into the product
    try{
        Product.findOneAndUpdate({
            _id : new Mongoose.Types.ObjectId(req.params.id)
        }, {
            video : req.file
        }, {new: true}, function (err, success) {
            if(err) return next(err);
            return responses.upload(res);
        });
    }catch(err){
        return next(err);
    }
}

/**
 * Add a composition to a product
 */
const addProductComposition = function (req, res, next) {
    Product.updateOne({
        _id: req.params.id
    }, {
        $push : {
        compositions : 
            { 
                image : req.body.image,
                price : req.body.price,
                options : {
                    option : req.body.option,
                    value : req.body.value
                }
            }
        }
    }, {new : true} , function (err, product) {
        if (err) return next(err);
        return responses.ok(product, res);
    })
}

/**
 * Delete a composition from a product
 */
const deleteProductComposition = function (req, res, next) {
    Product.updateOne({
        _id : req.params.id
    }, {
        $pull : { compositions : {_id : req.body.id } }
    }, {}, function(err, result) {
        if (err) return next(err);
        return res.ok(result);
    })
}

/**
 *  Add an option inside a composition of a product
 */
const addProductCompositionOption = function (req, res, next) {
    Product.updateOne({
        _id: req.params.id
    }, {
        $push : {
            compositions : {
                options : {
                    option : req.body.option,
                    value : req.body.value
                }
            }
        }
    }, {new : true} , function (err, product) {
        if (err) return next(err);
        return responses.ok(product, res);
    })
}

/**
 * Delete an option inside a composition of a product
 */
const deleteProductCompositionOption = function (req, res, next) {
    Product.updateOne({
        _id : req.params.id
    }, {
        $pull : { 
            compositions : {
                options : {
                    _id : req.body.id 
                }
            } 
        }
    }, {}, function(err, result) {
        if (err) return next(err);
        return res.ok(result);
    })
}

module.exports = {
    createProduct: createProduct,
    getProduct: getProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    addProductOption : addProductOption,
    deleteProductOption : deleteProductOption,
    addProductImage : addProductImage,
    getAllProductWithPagination : getAllProductWithPagination,
    addProductAdditionalsImages : addProductAdditionalsImages,
    addProductVideo : addProductVideo,
    addProductComposition : addProductComposition,
    deleteProductComposition : deleteProductComposition,
    addProductCompositionOption : addProductCompositionOption,
    deleteProductCompositionOption : deleteProductCompositionOption
}
