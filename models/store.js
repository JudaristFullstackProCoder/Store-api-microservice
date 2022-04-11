const mongoose = require('mongoose');

const mongooseConnect = require('../db/mongoConnect');

mongooseConnect(mongoose);

/**
 * @description Describe the structure of all settings of a store.
 * Because all store settings are the same.
 */
const storeSettingSchema = new mongoose.Schema({

});

/**
 * @description Describe the structure of a store.
 */
const storeSchema = new mongoose.Schema({
  // the name if the store
  name: {
    type: mongoose.Schema.Types.String,
    required: [true, 'store name is required'],
    trim: true,
    minlength: 4,
    maxlength: 30,
  },
  // the owner of the store
  shopkeeper: {
    type: mongoose.Schema.Types.ObjectId,
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
