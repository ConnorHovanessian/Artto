var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var Submission = require("../models/submission");


//Route to render the hall of fame
router.get("/hof", middleware.isLoggedIn, function(req, res){
    
    Submission.find({chosenForHOF : true}, function(err, submissions){
        if(err)
        {
            console.log(err);   
        }
        else
        {
            res.render("hof/hof", {submissions:submissions});
        }
    });
     
});

module.exports = router;