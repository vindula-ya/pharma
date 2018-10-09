"use strict";

// Get all dependencies
const config = require("config");
const mongoose = require("../database");
const deepPopulate = require("mongoose-deep-populate")(mongoose);
const nexmo = require("../sms");
const tranporter = require("../email");
const Placing = require("../models/placingSchema");
const User = require("../models/userSchema");

// Export functions/routes
module.exports = {
    // Create Placing
    createPlacing: (req, res) => {
        // Get details from body
        const user = req.body.user;
        const prescription = req.body.prescription;
        const expectedTime = req.body.expectedTime;

        let placing = null;
        let mailOptions = null;
        let userDetails = null;

        // Save Placing to database and get User details
        Promise.all([
                Placing.create({
                    user: user,
                    prescription: prescription,
                    expectedTime: expectedTime
                }),
                User.findById(user)
            ])
            // Save Placing and User info
            .then((result) => {
                placing = result[0];
                userDetails = result[1];

                mailOptions = {
                    from: config.get("email.auth.user"),
                    to: userDetails.email,
                    subject: "Placing Confirmation",
                    text: ("Placing " + placing.placingID +
                        " has been made by " + userDetails.name + " at " + expectedTime)
                };
            })
            // Send email
            .then(() => tranporter.sendMail(mailOptions))
            // Display result of sending email in console
            .then((info) => {
                console.log("Email sent: " + info.response);
            })
            // Send SMS
            .then(() => {
                nexmo.message.sendSms(
                    config.get("senderNumber"),
                    userDetails.userID,
                    ("Placing " + placing.placingID + " has been made by " + userDetails.name + " at " + expectedTime), {
                        type: "unicode"
                    },
                    (err, responseData) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.dir(responseData);
                        }
                    }
                );
            })
            // Send response
            .then(() => {
                return res.json({
                    message: "Successfully saved placing",
                    result: placing
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

    // Get all Placings
    getAllPlacings: (req, res) => {
        // Get all Placing
        Placing.find()
            .deepPopulate([
                "user",
                "prescription"
            ])
            .exec()
            // Send response
            .then((result) => {
                return res.json({
                    message: "Retrieved all placings",
                    result: result
                });
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to retrieve all placings",
                    error: error
                });
            });
    },

    // Get one Placings
    getOnePlacing: (req, res) => {
        // Get placingID from parameter
        const placingID = req.params.placingID;

        // Get Placing from database
        Placing.findOne({
                placingID: placingID
            })
            .deepPopulate([
                "user",
                "prescription"
            ])
            .exec()
            .then((result) => {
                if (!result) {
                    // Placing does not exist
                    return res.json({
                        message: "Placing does not exist",
                        result: result
                    });
                } else {
                    // Placing exists
                    return res.json({
                        message: "Successfully retieved placing",
                        result: result
                    });
                }
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to retrieve placing",
                    error: error
                });
            });
    },

    // Update Payment
    updatePayment: (req, res) => {
        // Get placingID from parameter
        const placingID = req.params.placingID;

        let placing = null;

        // Get Placing from database
        Placing.findOne({
                placingID: placingID
            })
            .then((result) => {
                if (!result) {
                    // Payment does not exist
                    return res.json({
                        message: "Placing does not exist",
                        result: result
                    });
                } else {
                    // Order exists
                    // Update details
                    placing = result;
                    placing.user = req.body.user;
                    placing.table = req.body.table;
                    placing.expectedTime = req.body.expectedTime;
                }
            })
            // Save updated placing to database
            .then(() => placing.save())
            // Send response
            .then((result) => {
                return res.json({
                    message: "Successfully updated placing",
                    result: result
                });
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to update placing",
                    error: error
                });
            });
    }
}