var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var middleware = require("../middleware");
var fs = require('fs');




router.get("/art", middleware.isLoggedIn, function(req, res){
    if(req.user.hasPayed && !req.user.hasSubmitted)
    {
        res.render("art/art");
    }
    else if(!req.user.hasPayed)
    {
        req.flash("error", "You must pay before creating a submission!");
        res.redirect("/home");
    }
    else if(req.user.hasSubmitted)
    {
        req.flash("error", "You've alreay made a submission for this round!");
        res.redirect("/home");
    }
});

router.post("/art/:userID", middleware.isLoggedIn, function(req, res){
    
    var img = req.body.img;
    var data = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    var uniqueFileName = __dirname + '/../public/submissions/' + req.user._id + '.png';
    fs.writeFile(uniqueFileName, buf, 'base64', function(err){
        if(err)
        {
            req.flash("error", "Error with submission, please try again!" + err);
            res.redirect("/home");
        }
        else
        {
            req.user.hasSubmitted = true;
            req.user.save();
            req.flash("success", "Art submission successfull." 
                        + " You will be contacted by email if your art was chosen!");
            res.redirect("/home");
        }
    });
    
});

module.exports = router;