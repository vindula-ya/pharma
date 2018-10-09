"use strict";

// Get all dependencies
const mongoose = require("../database");
const autoIncrement = require("mongoose-sequence")(mongoose);

// Define schema
const schema = {
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    price: {
        type: mongoose.Schema.Types.Number,
        required: true
    }
};

// Collection name
const collectionName = "drug";
// Create Schema
const drugSchema = mongoose.Schema(schema);
// Added auto incrementing field
drugSchema.plugin(autoIncrement, {
    inc_field: "drugID"
});
// Create Model
const Drug = mongoose.model(collectionName, drugSchema);

// Export Drug model
module.exports = Drug;