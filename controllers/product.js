/* eslint consistent-return: "off" */

const mongoose = require('mongoose');
const mongooseConnection = require('../db/mongoConnect');

mongooseConnection(mongoose);

const responses = require('../middlewares/responses');
const Product = require('../models/product').model;
const { ProductComposition } = require('../models/product');
const CM = require('../libs/ApiCrudManager');
const category = require('../models/category').model;

const crudManager = new CM();

const createProduct = async function createProd(req, res, next) {
  return crudManager.create({ req, res, next }, Product, []);
};

const getProduct = async function getProd(req, res, next) {
  let product = null;
  try {
    product = await Product.findOne({
      _id: req.params.id,
    })
      .populate('options.option')
      .populate('category', 'name', category)
      .exec();
    return responses.ok(res, product);
  } catch (err) {
    return next(err);
  }
};

const updateProduct = async function upProd(req, res, next) {
  return crudManager.update({ req, res, next }, Product);
};

const deleteProduct = async function delProd(req, res, next) {
  return crudManager.delete({ req, res, next }, Product, {
    // afterDelete : delete the files directory associated with this product
  });
};

const getAllProductWithPagination = function getAllProdWithPage() {

};

const addProductOption = async function addProdOption(req, res, next) {
  try {
    // Dont allow same option id
    const pr = await Product.findOne({
      _id: req.params.id,
      'options.option': req.body.option,
    }).exec();
    if (pr) {
      return next(new Error(`option with id 624f55bc229d2cc31798bb5f already exist in this product use the endpoint 
      PATCH /api/v1/product/[product id]/option/[option id] instead `));
    }
    // update the product
    Product.updateOne({
      _id: req.params.id,
    }, {
      $push: { options: { option: req.body.option, value: req.body.value } },
    }, { new: true }, async (err) => {
      if (err) return next(err);
      const returned = await Product.findOne({
        _id: req.params.id,
      }).populate('options.option', 'name')
        .populate('category', 'name')
        .exec();
      return responses.ok(res, returned);
    });
  } catch (err) {
    return next(err);
  }
};

const updateProductOption = async function updateProductOption(req, res, next) {
  try {
    const { id } = req.params;
    const { optionId } = req.params;
    Product.findOneAndUpdate({
      _id: id,
      'options.option': optionId,
    }, {
      $set: {
        'options.$.value': req.body.value,
      },
    }, {
      new: true,
    }, (err, data) => {
      if (err) {
        return next(err);
      }
      return res.json({
        success: true,
        data,
      });
    });
  } catch (err) {
    return next(err);
  }
};

const getProductOption = async function getProductOption(req, res, next) {
  try {
    const { id } = req.params;
    const { optionId } = req.params;
    Product.findOne({
      _id: id,
      'products.options.option': optionId,
    }, { _id: 1, 'product.options.option': 1, 'product.options.value': 1 }, {}, (err, data) => {
      if (err) {
        return next(err);
      }
      return res.json({
        success: true,
        data,
      });
    });
  } catch (err) {
    return next(err);
  }
};

const deleteProductOption = async function deleteProductOption(req, res, next) {
  try {
    Product.updateOne({
      _id: req.params.id,
    }, {
      $pull: { options: { option: req.body.option } },
    }, { new: true }, (err, result) => {
      if (err) return next(err);
      return responses.ok(res, result);
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * When an image is uploaded for a product this method is called to
 * store informations of an image of a product
 * @returns
 */
const addProductImage = async function addProdImage(req, res, next) {
  // This method is called when we upload an image for a product
  // Store all informatios about uploaded image into the product
  try {
    Product.findOneAndUpdate({
      _id: new mongoose.Types.ObjectId(req.params.id),
    }, {
      image: req.file,
    }, { new: true }, (err, product) => {
      if (err) return next(err);
      return responses.ok(res, product);
    });
  } catch (err) {
    return next(err);
  }
};

const addProductAdditionalsImages = async function addProdAdditionalsImages(req, res, next) {
  try {
    Product.updateOne({
      _id: req.params.id,
    }, {
      $push: { images: req.file },
    }, { new: true }, (err, product) => {
      if (err) return next(err);
      return responses.ok(res, product);
    });
  } catch (err) {
    return next(err);
  }
};

const addProductVideo = function addProdVideo(req, res, next) {
  // This method is called when we upload an image for a product
  // Store all informatios about uploaded video into the product
  try {
    Product.findOneAndUpdate({
      _id: new mongoose.Types.ObjectId(req.params.id),
    }, {
      video: req.file,
    }, { new: true }, (err) => {
      if (err) return next(err);
      return responses.upload(res);
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Add a composition to a product
 */
const addProductComposition = function addProductComposition(req, res, next) {
  try {
    const productComposition = new ProductComposition({
      image: req.body.image,
      price: req.body.price,
      options: {
        option: req.body.option,
        value: req.body.value,
      },
      product: req.params.id,
    });
    productComposition.save((err, data) => {
      if (err) {
        return next(err);
      }
      return res.json({
        success: true,
        data,
      });
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Delete a composition from a product
 */
const deleteProductComposition = function deleteProductComposition(req, res, next) {
  Product.updateOne({
    _id: req.params.id,
  }, {
    $pull: { compositions: { _id: req.body.id } },
  }, {}, (err, result) => {
    if (err) return next(err);
    return responses.ok(res, result);
  });
};

/**
 *  Add an option inside a composition of a product
 */
const addProductCompositionOption = function addProductCompositionOption(req, res, next) {
  try {
    Product.updateOne({
      _id: req.params.id,
    }, {
      $push: {
        compositions: {
          options: {
            option: req.body.option,
            value: req.body.value,
          },
        },
      },
    }, { new: true }, (err, product) => {
      if (err) return next(err);
      return responses.ok(res, product);
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Delete an option inside a composition of a product
 */
const deleteProductCompositionOption = function deleteProductCompositionOption(req, res, next) {
  Product.updateOne({
    _id: req.params.id,
  }, {
    $pull: {
      compositions: {
        options: {
          _id: req.body.id,
        },
      },
    },
  }, {}, (err, result) => {
    if (err) return next(err);
    return responses.ok(res, result);
  });
};

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  addProductOption,
  deleteProductOption,
  getProductOption,
  updateProductOption,
  addProductImage,
  getAllProductWithPagination,
  addProductAdditionalsImages,
  addProductVideo,
  addProductComposition,
  deleteProductComposition,
  addProductCompositionOption,
  deleteProductCompositionOption,
};
