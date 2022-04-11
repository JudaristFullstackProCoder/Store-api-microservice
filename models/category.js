const mongoose = require('mongoose');

const connectMongoose = require('../db/mongoConnect');

connectMongoose(mongoose);

/**
 * @description Describe the structure of a child category
 */
const childCategorySchema = new mongoose.Schema({
  // the parent category
  parent: {
    type: mongoose.Types.ObjectId,
    required: [true, 'parent category id is required'],
    ref: 'category',
  },
  // name of the child category
  name: {
    type: mongoose.Schema.Types.String,
    required: [true, "child category's name is required"],
    trim: true,
    minLength: 3,
    maxLength: 30,
    unique: true,
  },
  abbr: {
    type: mongoose.Schema.Types.String,
    default: null,
  },
  // child category's options
  options: {
    type: [mongoose.Schema.Types.ObjectId],
    required: [true, "child category's options is required"],
    default: [],
    ref: 'options',
  },
});

/**
 * @description Describe the strucuture of a parent category
 */
const categorySchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: [true, "category's name is required"],
    trim: true,
    unique: true,
  },
});

// Exports
module.exports = {
  schema: categorySchema,
  model: mongoose.model('category', categorySchema),
  childCategorySchema,
  ChildCategoryModel: mongoose.model('childcategory', childCategorySchema),
};
