"use strict";

// Get all dependencies
const config = require("config");
const mongoose = require("../database");
const deepPopulate = require("mongoose-deep-populate")(mongoose);
const nexmo = require("../sms");
const Payment = require("../models/paymentSchema");
const tranporter = require("../email");
const User = require("../models/userSchema");

// Export functions/routes
module.exports = {
    // Create Payment
    createPayment: (req, res) => {
        // Get details from body
        const reservation = req.body.reservation;
        const user = req.body.user;
        const type = req.body.type;
        const value = req.body.value;

        let payment = null;
        let mailOptions = null;
        let userDetails = null;

        // Save Payment to database and get User details   
        Promise.all([
                Payment.create({
                    reservation: reservation,
                    user: user,
                    type: type,
                    value: value
                }),
                User.findById(user)
            ])
            // Save Payment and User info
            .then((result) => {
                payment = result[0];
                userDetails = result[1];

                mailOptions = {
                    from: config.get("email.auth.user"),
                    to: userDetails.email,
                    subject: "Payment Confirmation",
                    text: ("Payment " + payment.paymentID +
                        " has been made by " + userDetails.name + " for " + value)
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
                    ("Payment " + payment.paymentID + " has been made by " + userDetails.name + " for " + value), {
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
                    message: "Successfully saved payment",
                    result: payment
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

    // Get all Payments
    getAllPayments: (req, res) => {
        // Get all Payments
        Payment.find()
            .deepPopulate([
                "reservation",
                "reservation.user",
                "reservation.table",
                "user"
            ])
            .exec()
            // Send response
            .then((result) => {
                return res.json({
                    message: "Retrieved all Payments",
                    result: result
                });
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to retrieve all payments",
                    error: error
                });
            });
    },

    // Get one Payment
    getOnePayment: (req, res) => {
        // Get paymentID from parameter
        const paymentID = req.params.paymentID;

        // Get Payment from database
        Payment.findOne({
                paymentID: paymentID
            })
            .deepPopulate([
                "reservation",
                "reservation.user",
                "reservation.table",
                "user"
            ])
            .exec()
            .then((result) => {
                if (!result) {
                    // Payment does not exist
                    return res.json({
                        message: "Payment does not exist",
                        result: result
                    });
                } else {
                    // Payment exists
                    return res.json({
                        message: "Successfully retieved payment",
                        result: result
                    });
                }
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to retrieve payment",
                    error: error
                });
            });
    },

    // Update Payment
    updatePayment: (req, res) => {
        // Get paymentID from parameter
        const paymentID = req.params.paymentID;

        let payment = null;

        // Get Payment from database
        Payment.findOne({
                paymentID: paymentID
            })
            .then((result) => {
                if (!result) {
                    // Payment does not exist
                    return res.json({
                        message: "Payment does not exist",
                        result: result
                    });
                } else {
                    // Order exists
                    // Update details
                    payment = result;
                    payment.reservation = req.body.reservation;
                    payment.user = req.body.user;
                    payment.type = req.body.type;
                    payment.value = req.body.value;
                }
            })
            // Save updated payment to database
            .then(() => payment.save())
            // Send response
            .then((result) => {
                return res.json({
                    message: "Successfully updated payment",
                    result: result
                });
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to update payment",
                    error: error
                });
            });
    }
}