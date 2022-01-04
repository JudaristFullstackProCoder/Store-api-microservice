const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const childCategoryOptionsSchema = new Schema({
    id: {
        type : Schema.Types.ObjectId,
        required : [true, "option's id is required"]
    }
});

const childCategorySchema = new Schema({
    parent : {
        type: Schema.Types.ObjectId,
        required: [true, "category's id required"],
    },
    name: {
        type: Schema.Types.String,
        required: [true, "child category's name is required"],
        trim: true,
        minLength: 3,
        maxLength: 15
    },
    options : [childCategoryOptionsSchema],
});

const categorySchema = new Schema({
    name : {
        type: Schema.Types.String,
        required : [true, "category's name is required"],
        trim: true
    },
    children: [childCategorySchema]
});

module.exports = {
    schema : categorySchema,
    model : mongoose.model("category", categorySchema)
}
