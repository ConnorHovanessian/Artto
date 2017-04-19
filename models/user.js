var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    verifyToken: String,
    sellToken: String,
    verified: Boolean,
    hasPayed: Boolean,
    hasSubmitted: Boolean,
    created: Date
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);