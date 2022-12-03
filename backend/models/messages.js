const mongoose = require('mongoose');

const message_schema = mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    message: { type: String },
    seen: { type: String, required: true },
}, { timestamps: true });

var Messages = mongoose.model("Messages", message_schema);

module.exports = Messages;