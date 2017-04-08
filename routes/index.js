var express = require("express");
var router = express.Router();
var User = require("../models/user");
var TempUser = require("../models/tempUser");
var passport = require("passport");
var middleware = require("../middleware");
var crypto = require("crypto");

//========================================================
// MISC ROUTES
//========================================================

//root route
router.get("/", function(req, res){
    
    //if user is logged in, take them home
    if(req.isAuthenticated())
    {
        res.redirect("/home");
    }
    //if not, take them to the landing page
    else
    {
        res.render("landing");
    }

});


//========================================================
// AUTH ROUTES
//========================================================

//home route
router.get("/home", middleware.isLoggedIn, function(req, res){
    
    res.render("home");
    
});

//account verify route
router.get("/verify/:accountID/:token", function(req, res){
    
    res.render("home");
    
});

//handle register logic
router.post("/register", function(req, res){
    
    //generate verification token
    var verifyToken = crypto.randomBytes(64).toString('hex');;

    var newTempUser = new TempUser({
        username: req.body.username,
        verifyToken: verifyToken
    });
    
    TempUser.create(newTempUser, function(err,tempUser){
        if(err)
        {
            //error handling
        }
        else
        {
            //notification to check email
        }
    });

});

module.exports = router;