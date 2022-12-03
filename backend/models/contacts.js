var mongoose = require('mongoose');

var contact_schema = mongoose.Schema({
    username: { type: String, required: true },
    user_id: { type: String, required: true }
}, { timestamps: true });

var Contacts = mongoose.model("Contacts", contact_schema);

module.exports = Contacts;