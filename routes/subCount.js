var express = require("express");
var router = express.Router();
var Submission = require("../models/submission");

router.get("/subCount", function(req, res){
    
    Submission.find({hofContender:false, chosenForHOF:false}, function(err, submissions){
		if(err)
		{
			console.log(err);
			res.send("");
		}
		else
		{
		    var countObj = {subCount:submissions.length};
			res.send(JSON.stringify(countObj));
		}
	});

});

module.exports = router;