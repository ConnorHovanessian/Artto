var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware");
var constants = require("../util/constants");

const stripe = require("stripe")(constants.keySecret);

router.get("/charge", [middleware.isLoggedIn, middleware.noBlackout], function(req, res){
    
    res.render("payments/payment", {keyPublishable: constants.keyPublishable});
    
});

router.post("/charge/:userID", [middleware.isLoggedIn, middleware.noBlackout], function(req, res){
    
    //charge user $1
    var amount = constants.chargePerSubmission;
    
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
        if(charge.paid)
        {
            req.user.hasPayed = true;
            req.user.save();
            req.flash("success", "Payment successful! Make some art.");
            res.redirect("/art");
        }
        else
        {
            req.flash("error", charge.outcome.seller_message);
            res.redirect("/charge");
        }
    });

});

module.exports = router;