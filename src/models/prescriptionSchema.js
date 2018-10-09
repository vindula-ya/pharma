"use strict";

// Get all dependencies
const mongoose = require("../database");
const autoIncrement = require("mongoose-sequence")(mongoose);

// Define schema
const schema = {
    occupied: {
        type: mongoose.Schema.Types.Boolean,
        required: true
    }
};

// Collection name
const collectionName = "prescription";
// Create Schema
const prescriptionSchema = mongoose.Schema(schema);
// Added auto incrementing field
tableSchema.plugin(autoIncrement, {
    inc_field: "prescriptionID"
});
// Create Model
const Prescription = mongoose.model(collectionName, prescriptionSchema);

// Export Prescription model
module.exports = Prescription;