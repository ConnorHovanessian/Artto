var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var middleware = require("../middleware");

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

//home route
router.get("/home", middleware.isLoggedIn, function(req, res){
    
    res.render("home");
    
});

//account verify route
router.get("/verify/:accountID/:token", function(req, res){
    
    res.render("home");
    
});

module.exports = router;