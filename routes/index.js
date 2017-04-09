var express = require("express");
var router = express.Router();
var User = require("../models/user");
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
    
    if(!req.user.verified)
    {
        req.logout();
        req.flash("error", "Please verify your email to login.");
        return res.redirect("/login");
    }
    res.render("home");
    
});

//handle register logic
router.post("/register", function(req, res){
    
    //generate verification token
    var verifyToken = crypto.randomBytes(64).toString('hex');;

    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        verifyToken: verifyToken,
        verified: false
    });
    
    User.register(newUser, req.body.password, function(err, user){
        
        if(err)
        {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        else
        {
            req.flash("success", "Successfully created account! Please verify your email address to login.");
            return res.redirect("/register");
        }
        
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handle login logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res){
    
});


//account verify route
router.get("/verify/:accountID/:token", function(req, res){
    
    User.findById(req.params.accountID, function(err, user){
    
        if(err)
        {
            res.redirect("/");
        }
        else
        {
            if(user.verifyToken === req.params.token)
            {
                user.verified = true;
                user.save();
                passport.authenticate("local")(req, res, function(){
                    req.flash("success", "Account successfully verified!");
                    res.redirect("/home");
                });
            }
        }

    });

});

module.exports = router;