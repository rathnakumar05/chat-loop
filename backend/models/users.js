// model
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var salt_round = 10;
var user_schema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, require: true }
}, { timestamps: true });

user_schema.pre("save", function(next) {
    var user = this;
    if (!user.isModified("password")) {
        return next();
    }

    bcrypt.genSalt(salt_round, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

user_schema.methods.checkPassword = function (pass, done) {
    bcrypt.compare(pass, this.password, function(err, result) {
        done(err, result);
    });
};

var Users = mongoose.model("Users", user_schema);

module.exports = Users;