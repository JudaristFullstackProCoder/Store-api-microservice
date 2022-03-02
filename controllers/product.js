const Mongoose = require('mongoose');

const responses = require('../middlewares/responses');
const Product = require('../models/product').model;
const { ProductComposition } = require('../models/product');
const CM = require('../libs/ApiCrudManager');

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
      .populate('options.option', 'name')
      .populate('category', 'name')
      .exec();
  } catch (err) {
    return next(err);
  }
  return responses.ok(product, res);
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
  Product.updateOne({
    _id: req.params.id,
  }, {
    $push: { options: { option: req.body.option, value: req.body.value } },
  }, { new: true }, (err, product) => {
    if (err) return next(err);
    return responses.ok(product, res);
  });
  return next(new Error());
};

const updateProductOption = async function updateProductOption(req, res, next) {
  const { id } = req.params;
  const { optionId } = req.params;
  Product.findOneAndUpdate({
    _id: id,
    'product.options.option': optionId,
  }, {
    value: req.body.value,
  }, { new: true }, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json({
      success: true,
      data,
    });
  });
};

const getProductOption = async function getProductOption(req, res, next) {
  const { id } = req.params;
  const { optionId } = req.params;
  Product.findOne({
    _id: id,
    'product.options.option': optionId,
  }, { _id: 1, 'product.options.option': 1, 'product.options.value': 1 }, {}, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json({
      success: true,
      data,
    });
  });
};

const deleteProductOption = async function deleteProductOption(req, res, next) {
  Product.updateOne({
    _id: req.params.id,
  }, {
    $pull: { options: { option: req.body.option } },
  }, {}, (err, result) => {
    if (err) return next(err);
    return res.ok(result);
  });
  return false;
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
      _id: new Mongoose.Types.ObjectId(req.params.id),
    }, {
      image: req.file,
    }, { new: true }, (err, product) => {
      if (err) return next(err);
      return responses.ok(product, res);
    });
  } catch (err) {
    return next(err);
  }
  return false;
};

const addProductAdditionalsImages = async function addProdAdditionalsImages(req, res, next) {
  try {
    Product.updateOne({
      _id: req.params.id,
    }, {
      $push: { images: req.file },
    }, { new: true }, (err, product) => {
      if (err) return next(err);
      return responses.ok(product, res);
    });
  } catch (err) {
    return next(err);
  }
  return false;
};

const addProductVideo = function addProdVideo(req, res, next) {
  // This method is called when we upload an image for a product
  // Store all informatios about uploaded video into the product
  try {
    Product.findOneAndUpdate({
      _id: new Mongoose.Types.ObjectId(req.params.id),
    }, {
      video: req.file,
    }, { new: true }, (err) => {
      if (err) return next(err);
      return responses.upload(res);
    });
  } catch (err) {
    return next(err);
  }
  return false;
};

/**
 * Add a composition to a product
 */
const addProductComposition = function addProductComposition(req, res, next) {
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
    return res.ok(result);
  });
};

/**
 *  Add an option inside a composition of a product
 */
const addProductCompositionOption = function addProductCompositionOption(req, res, next) {
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
    return responses.ok(product, res);
  });
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
    return res.ok(result);
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
