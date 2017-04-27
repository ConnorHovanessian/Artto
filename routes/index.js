var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var middleware = require("../middleware");
var mailUtil = require("../util/mailUtil");
var constants = require("../util/constants");
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
    
    //Check for Honeypot 
    if(req.body.phone)
    {
        console.log("Honey Detected");
        return res.redirect("/");
    }
    
    //Check to make sure user data is valid
    if(!constants.usernameRegex.test(req.body.username) 
        || !constants.passwordRegex.test(req.body.password)
        || !constants.emailRegex.test(req.body.email)
        || (req.body.password !== req.body.password_confirmation))
    {
        req.flash("error", "Invalid user data detected!");
        return res.redirect("/register");
    }
    
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

//Route to render change password form
router.get("/forgotPassword", function(req, res){
    
    res.render("forgotPassword");
    
});

//Route to handle sending reset password emails
router.post("/forgotPassword", function(req, res){
    
    //Check to make email is valid
    if(!constants.emailRegex.test(req.body.email))
    {
        req.flash("error", "Invalid email detected!");
        return res.redirect("/");
    }
    
    User.findOne({email:req.body.email}, function(err, user){

        if(err)
        {
            return res.redirect("/");
        }
        else
        {
            //if we found a user
            if(user._id)
            {
                //generate password reset verification token
                var resetToken = crypto.randomBytes(32).toString('hex');
                user.passwordResetToken = resetToken;
                user.save();
                
                var subject = "Reset your Artto password.";
                var url = req.originalUrl.split("/")[0];
                var fullUrl = req.protocol + '://' + req.get('host') + url + "/resetPassword/" + user._id + "/" + resetToken;
                
                var body = '<p>Hi ' + user.username + ',</p>';
                body += '<p>Please click the link below to reset your Artto password:</p> ';
                body += ' <p><a href="' + fullUrl + '">Reset Password</a></p>';
                body += '<p>Cheers,</p>';
                body += '<p>Artto Team</p>';
                
                var error;
                mailUtil.sendMail(user.email, subject, body, error);
                if(error)
                {
                    console.log(error);
                }
            }
            
            req.flash("success", "If the specified email (" + req.body.email + ") belongs to an Artto account," +
                                " an email containing password reset instructions will be sent to the address!");
            return res.redirect("/");

        }
    
    });
    
});

//reset password routes
router.get("/resetPassword/:accountID/:token", function(req, res){
    
    res.render("profile/changePassword", 
               {userID : req.params.accountID, 
                token : req.params.token});
    
});

router.post("/resetPassword", function(req, res){
    
    //Check to make sure password data is valid
    if(!constants.passwordRegex.test(req.body.password)
        || (req.body.password !== req.body.password_confirmation))
    {
        req.flash("error", "Invalid passwords detected!");
        return res.redirect("/");
    }
    
    User.findById(req.body.userID, function(err, user){

        if(err)
        {
            return res.redirect("/");
        }
        else
        {
            if(user.passwordResetToken && (user.passwordResetToken === req.body.token))
            {
                user.setPassword(req.body.password, function(){
                    user.passwordResetToken = "";
                    user.save();
                    req.flash("success", "Successfully changed password, you can now login with the new password!");
                    return res.redirect("/");
                });
            }
            else
            {
                req.flash("error", "Password reset token expired! Please re-send the email.");
                return res.redirect("/");
            }
        }
    
    });
    
});

module.exports = router;