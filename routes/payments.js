var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var middleware = require("../middleware");
var mailUtil = require("../util/mailUtil");
var crypto = require("crypto");


const keyPublishable = process.env.PUBLISHABLE_KEY || "pk_test_qNf1FF8I6DkUaR8nofX4F552";
const keySecret = process.env.SECRET_KEY || "sk_test_Y0rTWBLLRZeoC8fv7dYZPtXq";

const stripe = require("stripe")(keySecret);

router.get("/charge", middleware.isLoggedIn, function(req, res){
    res.render("payments/payment", {keyPublishable:keyPublishable});
});

router.post("/charge/:userID", middleware.isLoggedIn, function(req, res){
    
    //charge user $1
    var amount = 100;
    
    stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
    })
    .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
         currency: "usd",
         customer: customer.id
    }))
    .then(function(charge){
        req.user.hasPayed = true;
        req.user.save();
        res.send(":)");
    });

});

module.exports = router;