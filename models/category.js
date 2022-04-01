const mongoose = require('mongoose');
const { Schema } = require('mongoose');

/**
 * @description Describe the structure of a child category
 */
const childCategorySchema = new Schema({
  // the parent category
  parent: {
    type: mongoose.Types.ObjectId,
    required: [true, 'parent category id is required'],
    ref: 'category',
  },
  // name of the child category
  name: {
    type: Schema.Types.String,
    required: [true, "child category's name is required"],
    trim: true,
    minLength: 3,
    maxLength: 30,
    unique: true,
  },
  abbr: {
    type: Schema.Types.String,
    default: null,
  },
  // child category's options
  options: {
    type: [Schema.Types.ObjectId],
    required: [true, "child category's options is required"],
    default: [],
    ref: 'options',
  },
});

/**
 * @description Describe the strucuture of a parent category
 */
const categorySchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: [true, "category's name is required"],
    trim: true,
    unique: true,
  },
});

// Create index
childCategorySchema.index({
  name: 1,
  countryOfOrigin: 1,
}, {
  unique: true,
});

categorySchema.index({
  name: 1,
  countryOfOrigin: 1,
}, {
  unique: true,
});

// Exports
module.exports = {
  schema: categorySchema,
  model: mongoose.model('category', categorySchema),
  childCategorySchema,
  ChildCategoryModel: mongoose.model('childcategory', childCategorySchema),
};
