const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Promocodes mongoose model
 */
const promoCodeSchema = new Schema({
    discount : {
        type: Schema.Types.Number,
        required: true
    },
    from : {
        type: Schema.Types.Date,
        required: true
    },
    to:{
        type: Schema.Types.Date,
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

export default mongoose.model("promocodes", promoCodeSchema);
