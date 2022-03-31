const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Promocodes mongoose model
 */
const promoCodeSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  discount: {
    type: Schema.Types.Number,
    required: true,
  },
  from: {
    type: Schema.Types.Number, // timestamp GMT
    required: true,
    default: Date.now(),
  },
  to: {
    type: Schema.Types.Number, // timestamp GMT
    required: true,
  },
  maxuse: {
    type: Schema.Types.Number,
    required: true,
  },
  remaininguse: {
    type: Schema.Types.Number,
    required: true,
  },
}, {
  bufferCommands: true,
});

module.exports = mongoose.model('promocodes', promoCodeSchema);
