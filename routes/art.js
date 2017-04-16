var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var middleware = require("../middleware");
var fs = require('fs');




router.get("/art", middleware.isLoggedIn, function(req, res){
    res.render("art/art");
});

router.post("/art/:userID", middleware.isLoggedIn, function(req, res){
    
    var img = req.body.img;
    var data = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    fs.writeFile(__dirname + '/../public/submissions/image.png', buf, 'base64', function(err){
        if(err)
        {
            req.flash("error", "Error with submission, please try again!" + err);
            res.redirect("/home");
        }
        else
        {
            
            req.flash("success", "Art submission successfull!");
            res.redirect("/home");
        }
    });
    
});

module.exports = router;