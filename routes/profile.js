var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware");

//Route to render drawing application
router.get("/profile", middleware.isLoggedIn, function(req, res){
    
    res.render("profile/profile");
    
});

module.exports = router;