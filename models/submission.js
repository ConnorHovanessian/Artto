var mongoose = require("mongoose");
require('mongoose-double')(mongoose);

var SubmissionSchema = new mongoose.Schema({
    dateSubmitted: Date,
    rank: Number,
    chosenForHOF: Boolean,
    hofContender: Boolean,
    value: mongoose.Schema.Types.Double,
    artist: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Submission", SubmissionSchema);