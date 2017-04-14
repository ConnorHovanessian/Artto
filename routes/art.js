var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var middleware = require("../middleware");




router.get("/art", middleware.isLoggedIn, function(req, res){
    res.render("art/art");
});

router.post("/art/:userID", middleware.isLoggedIn, function(req, res){
    
    res.send(":)");

});

module.exports = router;