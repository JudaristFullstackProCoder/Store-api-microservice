const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Promocodes mongoose model
 */
const promoCodeSchema = new Schema({
    name : {
        type : Schema.Types.String,
        required : true
    },
    discount : {
        type: Schema.Types.Number,
        required: true
    },
    from : {
        type: Schema.Types.Number, // timestamp GMT
        required: true,
        default: parseInt(Date.parse(new Date().toISOString())) // Timestamp GMT
    },
    to:{
        type: Schema.Types.Number, // timestamp GMT
        required: true
    },
    maxuse : {
        type: Schema.Types.Number,
        required: true
    },
    remaininguse: {
        type: Schema.Types.Number,
        required: true
    }
});

module.exports = mongoose.model("promocodes", promoCodeSchema);
