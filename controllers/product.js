/* eslint consistent-return: "off" */

const mongoose = require('mongoose');
const mongooseConnection = require('../db/mongoConnect');

mongooseConnection(mongoose);

const responses = require('../middlewares/responses');
const Product = require('../models/product').model;
const { ProductVariation } = require('../models/product');
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
    message: 'product deleted successfully',
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
      return responses.created(res, 'product option added succesfully');
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
    }, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({
        success: true,
        data: 'product option updated succesfully',
      });
    });
  } catch (err) {
    return next(err);
  }
};

const getProductOption = async function getProductOption(req, res, next) {
  try {
    const { id: productId, optionId } = req.params;
    /** @var {Array} productOtions  */
    let productOtions = await Product.findOne({
      _id: productId,
    }).select('options')
      .populate('options.option')
      .exec();
    /**
    * productOptions format
    {
      "_id": "62577c6e29e7943996d0651c",
      "options": [
        {
          "_id": "62577c6e29e7943996d0651d"
        },
        {
          "option": {
            "_id": "62577c81451d7f23ecd169e9",
            "name": "op-test-product",
            "__v": 0
          },
          "value": "exemple value",
          "_id": "62577c81451d7f23ecd169ed"
        },
        { ... },
        { ... }
      ]
    }
     */

    productOtions = productOtions.options;
    productOtions.forEach((option) => {
      /* eslint no-underscore-dangle: "off" */
      if (option.option?._id?.toString() === optionId) {
        return responses.ok(res, option);
      }
    });
    // Not found
    return responses.notFound(req, res);
  } catch (error) {
    return next(error);
  }
};

const deleteProductOption = async function deleteProductOption(req, res, next) {
  try {
    Product.updateOne({
      _id: req.params.id,
    }, {
      $pull: { options: { option: req.body.option } },
    }, {}, (err) => {
      if (err) return next(err);
      return responses.ok(res, 'product option deleted successfully');
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

const addProductVariation = async function addProductVariation(req, res, next) {
  try {
    return crudManager.create({ req, res, next }, ProductVariation, {
      message: 'product variation created sucessfully',
    });
  } catch (err) {
    return next(err);
  }
};

const getProductVariation = async function getProductVariation(req, res, next) {
  try {
    return crudManager.read({ req, res, next }, ProductVariation, {
      filters: {
        product: req.params.id,
        _id: req.params.variationId,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getAllProductVariations = async function getAllProductVariations(req, res, next) {
  try {
    return crudManager.readAll({ req, res, next }, ProductVariation, {
      filters: {
        product: req.params.id,
        // req.params.id is the id of the product ref in ProductVariation record
      },
    });
  } catch (error) {
    return next(error);
  }
};

const deleteProductVariation = async function deleteProductVariation(req, res, next) {
  try {
    return crudManager.delete({ req, res, next }, ProductVariation, {
      message: 'product variation deleted successfully',
      filters: {
        product: req.params.id,
        _id: req.params.variationId,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const updateProductVariation = async function updateProductVariation(req, res, next) {
  try {
    return crudManager.update({ req, res, next }, ProductVariation, {
      message: 'product variation updated successfully',
      filters: {
        product: req.params.id,
        _id: req.params.variationId,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const addProductVariationOption = async function addProductVariationOption(req, res, next) {
  try {
    // Dont allow same option id
    const pr = await ProductVariation.findOne({
      _id: req.params.id,
      'options.option': req.body.option,
    }).exec();
    if (pr) {
      return next(new Error(`option with id 624f55bc229d2cc31798bb5f already exist in this product use the endpoint 
      PATCH /api/v1/product/{productId}/variation/{variationId}/option/{optionId} instead `));
    }
    ProductVariation.updateOne({
      product: req.params.id,
      _id: req.params.variationId,
    }, {
      $push: {
        options: {
          option: req.body.option,
          value: req.body.value,
        },
      },
    }, {}, (err) => {
      if (err) return next(err);
      return responses.created(res, 'product variation option created successfully');
    });
  } catch (err) {
    return next(err);
  }
};

const deleteProductVariationOption = function deleteProductVariationOption(req, res, next) {
  ProductVariation.updateOne({
    product: req.params.id,
    _id: req.params.variationId,
  }, {
    $pull: {
      options: {
        option: req.params.optionId,
      },
    },
  }, {}, (err) => {
    if (err) return next(err);
    return responses.ok(res, 'product variation option deleted successfully');
  });
};

const updateProductVariationOption = async function updateProductVariationOption(req, res, next) {
  try {
    const { id, optionId, variationId } = req.params;
    ProductVariation.findOneAndUpdate({
      _id: variationId,
      product: id,
      'options.option': optionId,
    }, {
      $set: {
        'options.$.value': req.body.value,
      },
    }, {
      new: true,
    }, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({
        success: true,
        data: 'product variation option updated successfully',
      });
    });
  } catch (err) {
    return next(err);
  }
};

const getProductVariationOption = async function getProductVariationOption(req, res, next) {
  try {
    const { id: productId, optionId, variationId } = req.params;
    let productVariationOptions = await ProductVariation.findOne({
      product: productId,
      _id: variationId,
      'options.option': optionId,
    }).select('options')
      .populate('options.option', 'name')
      .exec();

    productVariationOptions = productVariationOptions.options;
    productVariationOptions.forEach((option) => {
      /* eslint no-underscore-dangle: "off" */
      if (option.option?._id?.toString() === optionId) {
        return responses.ok(res, option);
      }
    });
    // Not found
    return responses.notFound(req, res);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  addProductOption,
  deleteProductOption,
  updateProductOption,
  addProductImage,
  getAllProductWithPagination,
  addProductAdditionalsImages,
  addProductVideo,
  addProductVariation,
  deleteProductVariation,
  addProductVariationOption,
  deleteProductVariationOption,
  updateProductVariationOption,
  updateProductVariation,
  getProductVariationOption,
  getProductOption,
  getProductVariation,
  getAllProductVariations,
};
