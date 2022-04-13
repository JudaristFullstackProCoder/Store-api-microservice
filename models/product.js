const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

const connectMongoose = require('../db/mongoConnect');

connectMongoose(mongoose);

/**
 * @description Descrine the strucuture of product's options
 * All the product dont't have the same category then all product
 * can't have the same option then we need to link product's category options
 * with the product
 */
const productOptionsSchema = new mongoose.Schema({
  // the id of the option
  option: {
    type: mongoose.Schema.Types.ObjectId,
    required: [false, "option's id is required !"],
    ref: 'options',
  },
  // the value of the option
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: [false, "option's value is required !"],
  },
});

/**
 * Product composition schema
 */
const productComposition = new mongoose.Schema({
  options: [productOptionsSchema],
  image: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  price: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'product id is required for product composition'],
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    trim: [true, "product's name is required !"],
    required: true,
  },
  price: {
    type: mongoose.Schema.Types.Number,
    required: [true, "product's price is required !"],
  },
  description: {
    type: mongoose.Schema.Types.String,
    required: [true, "product's description is required !"],
    trim: true,
  },
  // product's options
  options: {
    type: [productOptionsSchema],
    required: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
  // if the product has been published already,
  online: {
    type: mongoose.Schema.Types.Boolean,
    required: true,
  },
  // the user who created this product
  shopkeeper: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  // the is of the store where this product is stored
  store: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'store',
  },
  // product's additionals images
  images: {
    type: mongoose.Schema.Types.Array,
    validate: [function validateImages(arr) { return arr.length <= 5; }, 'maximum number of files reached'],
  },
  image: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  // presentation video
  pre_video: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  compositions: [{
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'productcompositions',
  }],
});

// mongoosastic
productSchema.plugin(mongoosastic, {
});

// Exports
module.exports = {
  model: mongoose.model('products', productSchema),
  ProductComposition: mongoose.model('productcompositions', productComposition),
};
