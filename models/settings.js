const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * ]@description This settings model contains setting(s) name(s); We can link them to a
 * store with value
 */
const settingsSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: [true, "setting name is required !"],
        trim: true
    }
});

module.exports = {
    model: mongoose.model("settings", settingsSchema),
    shema: settingsSchema
};
