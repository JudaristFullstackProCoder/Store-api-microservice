const Mongoose = require('mongoose');

const responses = require('../middlewares/responses');
const Product = require('../models/product').model;
const { requiredFields } = require('../models/product');
const CM = require('../libs/ApiCrudManager');
const rf = require('../models/product').productOptionsRequiredFields;

const crudManager = new CM();

const createProduct = async function createProd(req, res, next) {
  return crudManager.create({ req, res, next }, Product, requiredFields);
};

const getProduct = async function getProd(req, res, next) {
  let product = null;
  try {
    product = await Product.findOne({
      _id: req.params.id,
    })
      .populate('options.option', 'name')
      .populate('category', 'name')
      .populate('compositions.options.option', 'name')
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
  // required fields
  for (let i = 0; i < rf.length; i += 1) {
    if (!req.body[rf[i]]) {
      return next(new Error(`${rf[i]} is required`));
    }
  }

  Product.updateOne({
    _id: req.params.id,
  }, {
    $push: { options: { option: req.body.option, value: req.body.value } },
  }, { new: true }, (err, product) => {
    if (err) return next(err);
    return responses.ok(product, res);
  });
  return false;
};

const deleteProductOption = async function deleteProductOption(req, res, next) {
  // required fields
  const requiredFiels = ['option']; // the id of option that will be removed
  for (let i = 0; i < requiredFiels.length; i += 1) {
    if (!req.body[rf[i]]) {
      return next(new Error(`${rf[i]} is required`));
    }
  }

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
  Product.updateOne({
    _id: req.params.id,
  }, {
    $push: {
      compositions:
            {
              image: req.body.image,
              price: req.body.price,
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
  addProductImage,
  getAllProductWithPagination,
  addProductAdditionalsImages,
  addProductVideo,
  addProductComposition,
  deleteProductComposition,
  addProductCompositionOption,
  deleteProductCompositionOption,
};
