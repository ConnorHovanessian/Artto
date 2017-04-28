var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    verifyToken: String,
    passwordResetToken: String,
    sellToken: String,
    verified: Boolean,
    hasPayed: Boolean,
    hasSubmitted: Boolean,
    dateCreated: Date,
    submissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Submission"
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);