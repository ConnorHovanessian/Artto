var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var middleware = require("../middleware");
var mailUtil = require("../util/mailUtil");
var crypto = require("crypto");

//========================================================
// MISC ROUTES
//========================================================

//root route
router.get("/", function(req, res){
    
    res.render("landing");
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
        res.render("landing");
    }
    else
    {
        res.render("home");  
    }

});

//show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle register logic
router.post("/register", function(req, res){
    
    //generate verification token
    var verifyToken = crypto.randomBytes(32).toString('hex');

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
        /*else if(user.username.length<4||user.username.length>12||!user.username.match(/^[0-9a-z]+$/))
        {
            req.flash("error", "Username must be between 4 and 12 alphanumeric characters.");
            return res.redirect("/register");
        }   
        else if(user.password.length<8||user.password.length>20)
        {
            req.flash("error", "Password must be between 8 and 20 characters.");
            return res.redirect("/register");
        }
        else if(user.password.value!=user.password_confirmation.value)
        {
            req.flash("error", "Password and Password Confirmation must be the same.");
            return res.redirect("/register");
        }*/
        
        
        else //success
        {
            var url = req.originalUrl.split("/")[0];
            var fullUrl = req.protocol + '://' + req.get('host') + url + "/verify/" + user._id + "/" + verifyToken;
            
            var subject = "Verify your Artto account.";
            
            var body = '<p>Hi ' + user.username + ',</p>';
            body += '<p>Thanks for signing up with Artto! Please click on the following link to verify your Artto account:</p> ';
            body += ' <p><a href="' + fullUrl + '">Verify</a></p>';
            body += '<p>Cheers,</p>';
            body += '<p>Artto Team</p>';
            
            var error;
            mailUtil.sendMail(user.email, subject, body, error);
            if(error)
            {
                console.log(error);
            }
            
            req.flash("success", "Successfully created account! Please verify your email address to login.");
            return res.redirect("/login");
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
            if(user.verifyToken != "" 
                && user.verifyToken === req.params.token)
            {
                user.verified = true;
                user.verifyToken = "";
                user.save();
                req.flash("success", "Account successfully verified, you can now login!");
                res.redirect("/");
            }
            else
            {
                res.redirect("/");
            }
            
        }

    });
    
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged out, see you soon!");
    res.redirect("/");
});

module.exports = router;