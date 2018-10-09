"use strict";

// Get all dependencies
const mongoose = require("../database");
const deepPopulate = require("mongoose-deep-populate")(mongoose);
const Order = require("../models/orderSchema");

// Export functions/routes
module.exports = {
    // Create Order
    createOrder: (req, res) => {
        // Get details from body
        const reservation = req.body.reservation;
        const food = req.body.food;
        const quantity = req.body.quantity;

        // Save Order to database    
        Order.create({
                reservation: reservation,
                food: food,
                quantity: quantity
            })
            // Send response
            .then((result) => {
                return res.json({
                    message: "Successfully saved order",
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

    // Get all Orders
    getAllOrders: (req, res) => {
        // Get all Orders
        Order.find()
            .deepPopulate([
                "reservation",
                "reservation.user",
                "reservation.table"
            ])
            .exec()
            // Send response
            .then((result) => {
                return res.json({
                    message: "Retrieved all orders",
                    result: result
                });
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to retrieve all orders",
                    error: error
                });
            });
    },

    // Get one Order
    getOneOrder: (req, res) => {
        // Get orderID from parameter
        const orderID = req.params.orderID;

        // Get Order from database
        Order.findOne({
                orderID: orderID
            })
            .deepPopulate([
                "reservation",
                "reservation.user",
                "reservation.table"
            ])
            .exec()
            .then((result) => {
                if (!result) {
                    // Order does not exist
                    return res.json({
                        message: "Order does not exist",
                        result: result
                    });
                } else {
                    // Order exists
                    return res.json({
                        message: "Successfully retieved order",
                        result: result
                    });
                }
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to retrieve order",
                    error: error
                });
            });
    },

    // Update Order
    updateOrder: (req, res) => {
        // Get orderID from parameter
        const orderID = req.params.orderID;

        let order = null;

        // Get Order from database
        Order.findOne({
                orderID: orderID
            })
            .then((result) => {
                if (!result) {
                    // Order does not exist
                    return res.json({
                        message: "Order does not exist",
                        result: result
                    });
                } else {
                    // Order exists
                    // Update details
                    order = result;
                    order.reservation = req.body.reservation;
                    order.food = req.body.food;
                    order.quantity = req.body.quantity;
                }
            })
            // Save updated order to database
            .then(() => order.save())
            // Send response
            .then((result) => {
                return res.json({
                    message: "Successfully updated order",
                    result: result
                });
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to update order",
                    error: error
                });
            });
    }
}