const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = require("./product").schema

const storeSettingSchema = new Schema({
    setting: {
        type: Schema.Types.ObjectId,
        required: [true, "store setting id is required !"]
    },
    value: {
        type: Schema.Types.Mixed,
        required: [true, "store setting value is required !"]
    }
});

const storeSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: [true, "store name is required"],
        trim: true
    },
    shopkeeper: {
        type: Schema.Types.ObjectId,
        required: [true, "store shopkeeper id is required !"]
    },
    settings:[storeSettingSchema],
    products: [productSchema]
});

module.exports = {
    model : mongoose.model("store", storeSchema),
    scheme: storeSchema
}
