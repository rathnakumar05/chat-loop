var Contacts = require("../models/contacts");
var Users = require("../models/users");
var { auth } = require('../middlewares/auth');

const get = function (req, res, next) {
    var user_id = req.session._id;
    Contacts.find({ user_id: user_id }, function (err, contacts) {
        if (err) {
            return res.status(400).json(
                {
                    type: "error",
                    message: "something went wrong"
                }
            );
        }

        var data = [];
        if (contacts) {
            contacts.map(function (el) {
                data.push({
                    username: el.username
                });
            });
        }
        return res.json(
            {
                type: "success",
                data: data
            }
        );
    })
}

const add = function (req, res, next) {
    var username = req.body.username;
    var user_id = req.session._id;
    username = username.trim();
    Users.findOne({ username: username }, function (err, user) {
        if (err) {
            return res.status(400).json(
                {
                    type: "error",
                    message: "something went wrong"
                }
            );
        }

        if (user) {
            Contacts.findOne({ username: username, user_id: user_id }, function (err, contact) {
                if (err) {
                    return res.status(400).json(
                        {
                            type: "error",
                            message: "something went wrong"
                        }
                    );
                }

                if (contact) {
                    return res.status(400).json(
                        {
                            type: "error",
                            message: "contact already saved"
                        }
                    );
                } else {
                    var contacts = new Contacts({
                        username: username,
                        user_id: user_id
                    });
        
                    contacts.save(function (err) {
                        if (err) {
                            return res.status(400).json(
                                {
                                    type: "error",
                                    message: "something went wrong"
                                }
                            );
                        }
        
                        return res.json(
                            {
                                type: "success",
                                message: "contact saved successfully"
                            }
                        );
                    });
                }
            })
        } else {
            return res.status(400).json(
                {
                    type: "error",
                    message: "username not found"
                }
            );
        }
    })
}

module.exports = {
    add,
    get
}