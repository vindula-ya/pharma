"use strict";

// Get all dependencies
const Drug = require("../models/drugSchema");

// Export functions/routes
module.exports = {
    // Create Drug
    createDrug: (req, res) => {
        // Get details from body
        const name = req.body.name;
        const price = req.body.price;

        // Save Drug to database    
        Drug.create({
                name: name,
                price: price
            })
            // Send response
            .then((result) => {
                return res.json({
                    message: "Successfully saved drug",
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

    // Get all Drug
    getAllDrug: (req, res) => {
        // Get all Drug
        Drug.find()
            // Send response
            .then((result) => {
                return res.json({
                    message: "Retrieved all drug",
                    result: result
                });
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to retrieve all drugs",
                    error: error
                });
            });
    },

    // Get one Drug
    getOneDrug: (req, res) => {
        // Get drugID from parameter
        const drugID = req.params.drugID;

        // Get Drug from database
        Drug.findOne({
                drugID: drugID
            })
            .then((result) => {
                if (!result) {
                    // Drug does not exist
                    return res.json({
                        message: "Drug does not exist",
                        result: result
                    });
                } else {
                    // Drug exists
                    return res.json({
                        message: "Successfully retieved drug",
                        result: result
                    });
                }
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to retrieve drug",
                    error: error
                });
            });
    },

    //Update Drug
    updateDrug: (req, res) => {
        // Get drugID from parameter
        const drugID = req.params.drugID;

        let drug = null;

        // Get Drug from database
        Drug.findOne({
                drugID: drugID
            })
            .then((result) => {
                if (!result) {
                    // Drug does not exist
                    return res.json({
                        message: "Drug does not exist",
                        result: result
                    });
                } else {
                    // Drug exists
                    // Update details
                    drug = result;
                    drug.name = req.body.name;
                    drug.price = req.body.price;
                }
            })
            // Save updated drug to database
            .then(() => drug.save())
            // Send response
            .then((result) => {
                return res.json({
                    message: "Successfully updated drug",
                    result: result
                });
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to update drug",
                    error: error
                });
            });
    }
}