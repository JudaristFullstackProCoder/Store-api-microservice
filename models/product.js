const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * @description Descrine the strucuture of product's options
 * All the product dont't have the same category then all product
 * can't have the same option then we need to link product's category options
 * with the product
 */
const productOptionsSchema = new Schema({
  // the id of the option
  option: {
    type: Schema.Types.ObjectId,
    required: [false, "option's id is required !"],
    ref: 'options',
  },
  // the value of the option
  value: {
    type: Schema.Types.Mixed,
    required: [false, "option's value is required !"],
  },
});

/**
 * Product composition schema
 */
const productComposition = new Schema({
  options: [productOptionsSchema],
  image: {
    type: Schema.Types.Mixed,
    required: true,
  },
  price: {
    type: Schema.Types.Number,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    required: [true, 'product id is required for product composition'],
  },
});

const productSchema = new Schema({
  name: {
    type: Schema.Types.String,
    trim: [true, "product's name is required !"],
    required: true,
  },
  price: {
    type: Schema.Types.Number,
    required: [true, "product's price is required !"],
  },
  description: {
    type: Schema.Types.String,
    required: [true, "product's description is required !"],
    trim: true,
  },
  // product's options
  options: {
    type: [productOptionsSchema],
    required: false,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
  // if the product has been published already,
  online: {
    type: Schema.Types.Boolean,
    required: true,
  },
  // the user who created this product
  shopkeeper: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  // the is of the store where this product is stored
  store: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'store',
  },
  // product's additionals images
  images: {
    type: Schema.Types.Array,
    validate: [function validateImages(arr) { return arr.length <= 5; }, 'maximum number of files reached'],
  },
  image: {
    type: Schema.Types.Mixed,
    required: false,
  },
  // presentation video
  pre_video: {
    type: Schema.Types.Mixed,
    required: false,
  },
  compositions: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'productcompositions',
  },
});

// Exports
module.exports = {
  model: mongoose.model('product', productSchema),
  ProductComposition: mongoose.model('productcompositions', productComposition),
};
