var mongoose = require("mongoose");

var TempUserSchema = new mongoose.Schema({
    username: String,
    verifyToken: String,
    created: Date
});


module.exports = mongoose.model("TempUser", TempUserSchema);