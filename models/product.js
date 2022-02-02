const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * @description Descrine the strucuture of product's options
 * All the product dont't have the same category then all product
 * can't have the same option then we need to link product's category options
 * with the product
 */
const productOptionsSchema = new Schema({
    // the id of the option
    option: {
        type: Schema.Types.ObjectId,
        required: [true, "option's id is required !"],
        ref: 'options',
        unique: true
    },
    // the value of the option
    value: {
        type: Schema.Types.Mixed,
        required: [true, "option's value is required !"]
    }
});

/**
 * Product composition schema
 */
const productComposition = new Schema({
    options: [productOptionsSchema],
    image : {
        type: Schema.Types.Mixed,
        required: true
    },
    price : {
        type: Schema.Types.Number,
        required: true
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
    // product's options
    options: [productOptionsSchema],
    category: {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: [true, "product category is required !"],
    },
    // if the product has been published already,
    online: {
        type: Schema.Types.Boolean,
        required: [true, "product is online ? required !"]
    },
    // the user who created this product
    shopkeeper: {
        type: Schema.Types.ObjectId,
        required: [true, "product shopkeeper is required !"]
    },
    // the is of the store where this product is stored
    store: {
        type: Schema.Types.ObjectId,
        required: [true, "product shop is required !"]
    },
    // product's additionals images
    images: [{}],
    image: {
        type : Schema.Types.Mixed,
        required: false,
    }, 
    // presentation video
    pre_video: {
        type: Schema.Types.Mixed,
        required: false
    },
    compositions : [productComposition]
});

// Exports
module.exports = {
    model : mongoose.model("product", productSchema),
    schema: productSchema,
    requiredFields : ["name", "price", "description", 
    "category", "shopkeeper", "store", "online"],
    productOptionsRequiredFields : ["option", "value"]
};