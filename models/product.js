const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productOptionsSchema = new Schema({
    options: {
        type: Schema.Types.ObjectId,
        required: [true, "option's id is required !"]
    },
    value: {
        type: Schema.Types.Mixed,
        required: [true, "option's value is required !"]
    }
});

const productSchema = new Schema({
    name: {
        type: Schema.Types.String,
        trim: [true, "product's name is required !"],
        required: true
    },
    price: {
        type: Schema.Types.Number,
        required: [true, "product's price is required !"]
    }, 
    description: {
        type: Schema.Types.String,
        required: [true, "product's description is required !"],
        trim: true
    },
    options: [productOptionsSchema],
    category: {
        type: Schema.Types.ObjectId,
        required: [true, "product category is required !"]
    },
    online: {
        type: Schema.Types.Boolean,
        required: [true, "product is online ? required !"]
    },
    shopkeeper: {
        type: Schema.Types.ObjectId,
        required: [true, "product shopkeeper is required !"]
    },
    store: {
        type: Schema.Types.ObjectId,
        required: [true, "product shop is required !"]
    }
});

module.exports = {
    model : mongoose.model("product", productSchema),
    scheme: productSchema
};
