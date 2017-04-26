var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware");
var constants = require("../util/constants");

//Route to render user profile information
router.get("/profile", middleware.isLoggedIn, function(req, res){
    
    res.render("profile/profile");
    
});

//Route to render change password form
router.get("/changePassword", middleware.isLoggedIn, function(req, res){
    
    res.render("profile/changePassword");
    
});

//Route to handle changing of passwords
router.post("/changePassword", middleware.isLoggedIn, function(req, res){
    
    //Check to make sure user data is valid
    if(!constants.passwordRegex.test(req.body.password)
        || (req.body.password !== req.body.password_confirmation))
    {
        req.flash("error", "Invalid passwords detected!");
        return res.redirect("/profile");
    }
    
    User.findById(req.user._id, function(err, user){

        if(err)
        {
            return res.redirect("/");
        }
        else
        {
            user.setPassword(req.body.password, function(){
                user.save();
                req.flash("success", "Your password was successfully changed!");
                return res.redirect("/profile");
            });
        }
    
    });
    
});

module.exports = router;