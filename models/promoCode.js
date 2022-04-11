const mongoose = require('mongoose');

const mongooseConnect = require('../db/mongoConnect');

mongooseConnect(mongoose);

/**
 * Promocodes mongoose model
 */
const promoCodeSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  discount: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.Number, // timestamp GMT
    required: true,
    default: Date.now(),
  },
  to: {
    type: mongoose.Schema.Types.Number, // timestamp GMT
    required: true,
  },
  maxuse: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  remaininguse: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
}, {
  bufferCommands: true,
});

// Create index
promoCodeSchema.index({
  name: 1,
  countryOfOrigin: 1,
}, {
  unique: true,
});

module.exports = mongoose.model('promocodes', promoCodeSchema);
