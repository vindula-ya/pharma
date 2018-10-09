"use strict";

// Get all dependencies
const authentication = require("../authenticationMiddleware");
const express = require("express");
const router = express.Router();
const food = require("./drugController");
const order = require("./orderController");
const payment = require("./paymentController");
const reservation = require("./reservationController");
const table = require("./tableController");
const user = require("./userController");

// Export routes
module.exports = (app) => {
    // Login route
    app.post('/login', user.loginUser);

    // Use authentication middleware for router routes
    router.use(authentication);

    // Drug routes
    router.route('/drug')
        // Create a Drug
        .post(drug.createDrug)
        // Get all Dru
        .get(drug.getAllDrug);
    router.route('/drug/:drugID')
        // Get one Drug based on drugID
        .get(drug.getOneDrug)
        // Update one Drug based on drugID
        .put(drug.updateDrug);

    // Order routes
    router.route('/order')
        // Create a Order
        .post(order.createOrder)
        // Get all Orders
        .get(order.getAllOrders);
    router.route('/order/:orderID')
        // Get one Order based on orderID
        .get(order.getOneOrder)
        // Update one Order based on orderID
        .put(order.updateOrder);

    // Payment routes
    router.route('/payment')
        // Create a Payment
        .post(payment.createPayment)
        // Get all Payments
        .get(payment.getAllPayments);
    router.route('/payment/:paymentID')
        // Get one Payment based on paymentID
        .get(payment.getOnePayment)
        // Update one Payment based on paymentID
        .put(payment.updatePayment);

    // Reservation routes
    router.route('/reservation')
        // Create a Reservation
        .post(reservation.createReservation)
        // Get all Reservations
        .get(reservation.getAllReservations);
    router.route('/reservation/:reservationID')
        // Get one Reservation based on reservationID
        .get(reservation.getOneReservation)
        // Update one Reservation based on reservationID
        .put(reservation.updatePayment);

    // Table routes
    router.route('/table')
        // Create a Table
        .post(table.createTable)
        // Get all Tables
        .get(table.getAllTables);
    router.route('/table/:tableID')
        // Get one Table based on tableID
        .get(table.getOneTable)
        // Update one Table based on tableID
        .put(table.updateTable);

    // User routes
    router.route('/user')
        // Create a User
        .post(user.createUser)
        // Get all Users
        .get(user.getAllUsers);
    router.route('/user/:userID')
        // Get one user based on userID
        .get(user.getOneUser)
        // Update one user based on userID
        .put(user.updateUser);

    // Link router to server
    app.use('/pharma', router);
};