"use strict";

// Get all dependencies
const mongoose = require("../database");
const autoIncrement = require("mongoose-sequence")(mongoose);
const deepPopulate = require("mongoose-deep-populate")(mongoose);

// Define schema
const schema = {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    prescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "prescription",
        required: true
    },
    expectedTime: {
        type: mongoose.Schema.Types.Date,
        required: true
    }
};

// Collection name
const collectionName = "placing";
// Create Schema
const placingSchema = mongoose.Schema(schema);
// Added auto incrementing field
placingSchema.plugin(autoIncrement, {
    inc_field: "placingID"
});
// Add deep populate plugin
placingSchema.plugin(deepPopulate, {
    whitelist: [
        "user",
        "prescription"
    ]
});
// Create Model
const Placing = mongoose.model(collectionName, placingSchema);

// Export Placing model
module.exports = Placing;