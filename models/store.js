const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * @description Describe the structure of all settings of a store.
 * Because all store settings are the same.
 */
const storeSettingSchema = new Schema({

});

/**
 * @description Describe the structure of a store.
 */
const storeSchema = new Schema({
  // the name if the store
  name: {
    type: Schema.Types.String,
    required: [true, 'store name is required'],
    trim: true,
    minlength: 4,
    maxlength: 22,
  },
  // the owner of the store
  shopkeeper: {
    type: Schema.Types.ObjectId,
    required: [true, 'store shopkeeper id is required !'],
  },
  settings: {
    type: storeSettingSchema,
    required: [true, 'store settings is required !'],
    default: {},
  },
});

module.exports = {
  model: mongoose.model('store', storeSchema),
  scheme: storeSchema,
};
