const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const categoryOptions = new Schema({
    id: {
        type : Schema.Types.ObjectId,
        required : [true, "option's id is required"]
    }
});

const categorySchema = new Schema({
    name : {
        type: Schema.Types.String,
        required : [true, "category's name is required"],
        trim: true
    },
    options : [categoryOptions]
});

module.exports = {
    schema : categorySchema,
    model : mongoose.model("category", categorySchema)
}
