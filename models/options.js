/**
 * @description the option's schema is used to configure a list of options for a category
 * for exemple a category can have options for his products; for exemple the category called
 * phones can have options like : color, width, height, manufacturer etc...
 * so we would be able to link option(s) to a category and the products of this category
 * will take the options of their category
 */
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const optionSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: [true, "the option's name is required"],
    trim: true,
    minlength: 4,
    maxlength: 30,
    unique: true,
  },
});

// Create index
optionSchema.index({
  name: 1,
  countryOfOrigin: 1,
}, {
  unique: true,
});

module.exports = {
  model: mongoose.model('options', optionSchema),
  schema: optionSchema,
};
