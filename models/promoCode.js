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
        required: true,
        default: parseInt(Date.parse(new Date().toISOString())) // Timestamp GMT
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
