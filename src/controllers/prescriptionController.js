"use strict";

// Get all dependencies
const Prescription = require("../models/prescriptionSchema");

// Export functions/routes
module.exports = {
    // Create Prescription
    createPrescription: (req, res) => {
        // Get details from body
        const occupied = req.body.occupied;

        // Save Prescription to database    
        Prescription.create({
                occupied: occupied
            })
            // Send response
            .then((result) => {
                return res.json({
                    message: "Successfully saved prescription",
                    result: result
                });
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Save unsuccessful",
                    error: error
                });
            });
    },

    // Get all Prescription
    getAllPrescriptions: (req, res) => {
        // Get all Prescription
        Prescription.find()
            // Send response
            .then((result) => {
                return res.json({
                    message: "Retrieved all prescription",
                    result: result
                });
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to retrieve all prescriptions",
                    error: error
                });
            });
    },

    // Get one Prescription
    getOnePrescription: (req, res) => {
        // Get prescriptionID from parameter
        const prescriptionID = req.params.prescriptionID;

        // Get Prescription from database
        Prescription.findOne({
            prescriptionID: prescriptionID
            })
            .then((result) => {
                if (!result) {
                    // Prescription does not exist
                    return res.json({
                        message: "Prescription does not exist",
                        result: result
                    });
                } else {
                    // Prescription exists
                    return res.json({
                        message: "Successfully retieved prescription",
                        result: result
                    });
                }
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to retrieve prescription",
                    error: error
                });
            });
    },

    // Update Prescription
    updatePrescription: (req, res) => {
        // Get prescriptionID from parameter
        const prescriptionID = req.params.prescriptionID;

        let Prescription = null;

        // Get Prescription from database
        Prescription.findOne({
            prescriptionID: prescriptionID
            })
            .then((result) => {
                if (!result) {
                    // Prescription does not exist
                    return res.json({
                        message: "Prescription does not exist",
                        result: result
                    });
                } else {
                    // Prescription exists
                    // Update details
                    prescription = result;
                    drug.occupied = req.body.occupied;
                }
            })
            // Save updated prescription to database
            .then(() => prescription.save())
            // Send response
            .then((result) => {
                return res.json({
                    message: "Successfully updated prescription",
                    result: result
                });
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to update prescription",
                    error: error
                });
            });
    }
}