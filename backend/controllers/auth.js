// controller
var Users = require("../models/users");
var joi = require("joi");
var mongoose = require("mongoose");

function register(req, res, next) {
    var { email, username, password } = req.body;
    var schema = joi.object({
        email: joi.string().email().required().label("Email"),
        username: joi.string().regex(/^[a-zA-Z0-9_]*$/).min(3).max(30).required().label("Username").error(errors => {
            errors.forEach(err => {
                if (err.type === 'string.regex.base') {
                    err.message = `"Username" must contains only alphanumeric and _,-`
                }
            })
            return errors;
        }),
        password: joi.string().required().min(8).max(30).label("Password"),
    });

    const { error } = schema.validate({
        email: email,
        username: username,
        password: password
    }, { abortEarly: false });

    if (error) {
        var errors_data = { };
        for (var err of error.details) {
            var name = err.path[0];
            var message = err.message;
            errors_data[name] = message;
        }
        return res.status(422).json({
            type: "error",
            errors: errors_data,
            message: "validation error"
        });
    }

    Users.findOne({ email }, (err, user) => {
        if (err) {
            return res.status(400).json(
                {
                    type: "error",
                    message: "something went wrong"
                }
            );
        }
        if (user) {
            return res.status(422).json(
                {
                    type: "error",
                    errors: { 'email': '"Email" already exists' },
                    message: "validation error"
                }
            );
        }

        var new_user = new Users({ email, username, password });

        new_user.save(function (err, user) {
            if (err) {
                if (err.code === 11000) {
                    return res.status(422).json({
                        type: "error",
                        errors: { 'username': '"Username" already exists' },
                        message: "validation error"
                    });
                } else {
                    return res.status(400).json({
                        type: "error",
                        message: "something went wrong"
                    });
                }
            } else {
                return res.json({
                    type: "success",
                    message: "signup successfully"
                });
            }
        });
    })
}

function login(req, res, next) {
    var { email, password } = req.body; 

    var schema = joi.object({
        email: joi.string().email().required().label("Email"),
        password: joi.string().required().min(8).max(30).label("Password"),
    });

    const { error } = schema.validate({
        email: email,
        password: password
    }, { abortEarly: false });

    if (error) {
        var errors_data = { };
        for (var err of error.details) {
            var name = err.path[0];
            var message = err.message;
            errors_data[name] = message;
        }
        return res.status(422).json({
            type: "error",
            errors: errors_data,
            message: "validation error"
        });
    }

    Users.findOne({ email }, function (err, user) { 
        if (err) {
            return res.status(400).json({
                type: "error",
                message: "something went wrong"
            });
        }
        if (user) { 
            user.checkPassword(password, function (err, isMatch) {
                if (err) {
                    return res.status(400).json({
                        type: "error",
                        message: "something went wrong"
                    });
                }
                if (isMatch) {
                    var id = user["_id"].toString();
                    req.session.email = email;
                    req.session.username = user.username;
                    req.session._id = user._id.toString();
                    req.session.auth = 'Y';
                    return res.status(200).json({
                        type: "success",
                        message: "signin successfully",
                        session_id: user._id.toString(),
                        username: user.username
                    });
                } else {
                    return res.status(400).json({
                        type: "error",
                        message: "invalid credentials"
                    });
                }
            });
        } else {
            return res.status(400).json({
                type: "error",
                message: 'invalid credentials'
            });
        }
    });
}

function logout(req, res, next) {
    req.session.destroy(function (err) {
        if (err) {
            return res.status(400).json({
                type: "error",
                message: "something went wrong"
            });
        }
        return res.json({
            type: "success",
            message: "logged out successfully"
        });
    });

}

module.exports = {
    register,
    login,
    logout
}