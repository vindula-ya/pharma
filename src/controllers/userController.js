"use strict";

// Get all dependencies
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

// Export functions/routes
module.exports = {
    // Create User
    createUser: (req, res) => {
        // Get details from body
        const userID = req.body.userID;
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        // Hash password
        bcrypt.hash(password, config.get("saltRounds"))
            // Save User to database    
            .then((hashResult) => User.create({
                userID: userID,
                name: name,
                email: email,
                password: hashResult
            }))
            // Send response
            .then((result) => {
                return res.json({
                    message: "Successfully saved user",
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

    // Get all Users
    getAllUsers: (req, res) => {
        // Get all Users
        User.find()
            // Send response
            .then((result) => {
                return res.json({
                    message: "Retrieved all users",
                    result: result
                });
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to retrieve all users",
                    error: error
                });
            });
    },

    // Get one User
    getOneUser: (req, res) => {
        // Get userID from parameter
        const userID = req.params.userID;

        // Get User from database
        User.findOne({
                userID: userID
            })
            .then((result) => {
                if (!result) {
                    // User does not exist
                    return res.json({
                        message: "User does not exist",
                        result: result
                    });
                } else {
                    // User exists
                    return res.json({
                        message: "Successfully retieved user",
                        result: result
                    });
                }
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to retrieve user",
                    error: error
                });
            });
    },

    // Update User
    updateUser: (req, res) => {
        // Get userID from parameter
        const userID = req.params.userID;

        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        let user = null;

        // Get User from database
        User.findOne({
                userID: userID
            })
            .then((result) => {
                if (!result) {
                    // User does not exist
                    return res.json({
                        message: "User does not exist",
                        result: result
                    });
                } else {
                    // User exists
                    // Update details
                    user = result;
                    user.name = req.body.name;
                    user.email = req.body.email;
                }
            })
            // Hash password
            .then(() => bcrypt.hash(req.body.password, config.get("saltRounds")))
            // Update password
            .then((result) => {
                user.password = result;
            })
            // Save updated user to database
            .then(() => user.save())
            // Send response
            .then((result) => {
                return res.json({
                    message: "Successfully updated user",
                    result: result
                });
            })
            // Catch errors
            .catch((error) => {
                return res.json({
                    message: "Unable to update user",
                    error: error
                });
            });
    },

    // Login user
    loginUser: (req, res) => {
        const app = require("../app");

        // Get details
        const userID = req.body.userID;
        const password = req.body.password;

        // Find the user
        User.findOne({
                userID: userID
            })
            .then((user) => {
                // User does not exist
                if (!user) {
                    return res.json({
                        message: "User does not exist",
                        result: result
                    });
                }

                // If user has been found
                // Check password
                bcrypt.compare(password, user.password)
                    .then((result) => {
                        // Wrong password
                        if (!result) {
                            res.status(401).json({
                                success: false,
                                error: "Authentication failed. Wrong password"
                            });
                        }
                        // Correct Password
                        else {
                            const userDetails = {
                                userID: user.userID,
                                name: user.name,
                                email: user.email
                            };

                            // Create token
                            const token = jwt.sign(userDetails, app.get("superSecret"), {
                                expiresIn: config.get("tokenExpireTime")
                            });

                            return res.json({
                                success: true,
                                message: "Successfully logged in",
                                token: token
                            });
                        }
                    })
                    .catch((err) => {
                        return res.json({
                            success: false,
                            message: "Authentication failed. No password given",
                            error: err
                        });
                    })
            })
            .catch((err) => {
                return res.json({
                    error: err
                });
            });
    }
}