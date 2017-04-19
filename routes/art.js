var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware");
var fs = require('fs');
const path = require('path');

//Route to render drawing application
router.get("/art", middleware.isLoggedIn, function(req, res){
    if(req.user.hasPayed && !req.user.hasSubmitted)
    {
        res.render("art/art");
    }
    else if(!req.user.hasPayed)
    {
        req.flash("error", "You must pay before creating a submission!");
        res.redirect("/home");
    }
    else if(req.user.hasSubmitted)
    {
        req.flash("error", "You've alreay made a submission for this round!");
        res.redirect("/home");
    }
});

//Route to create new submission
router.post("/art/:userID", middleware.isLoggedIn, function(req, res){
    
    if(!req.user.hasPayed)
    {
        req.flash("error", "You must pay before creating a submission!");
        res.redirect("/home");
    }
    else if(req.user.hasSubmitted)
    {
        req.flash("error", "You've alreay made a submission for this round!");
        res.redirect("/home");
    }
    else
    {
        var img = req.body.img;
        var data = img.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');
        var uniqueFileName = __dirname + '/../public/submissions/' + req.user._id + '.png';
        fs.writeFile(uniqueFileName, buf, 'base64', function(err){
            if(err)
            {
                req.flash("error", "Error with submission, please try again!" + err);
                res.redirect("/home");
            }
            else
            {
                req.user.hasSubmitted = true;
                req.user.save();
                req.flash("success", "Art submission successfull." 
                            + " You will be contacted by email if your art was chosen!");
                res.redirect("/home");
            }
        });
    }
    
});

//Route to sell submission to Hall of Fame
router.get("/sell/:accountID/:token",  middleware.isLoggedIn, function(req, res){
    
    User.findById(req.params.accountID, function(err, user){
    
        if(err)
        {
            res.redirect("/");
        }
        else
        {
            if(user.sellToken != "" 
                && user.sellToken === req.params.token)
            {
                user.sellToken = "";
                user.save();
                
                //Copy submission to Hall of Fame
                
                var submissionDir = __dirname + '/../public/submissions/';
                var uniqueFileName = __dirname + '/../public/submissions/' + req.user._id + '.png';
                var hofFileName = __dirname + '/../public/hof/' + req.user._id + '.png';
                fs.rename(uniqueFileName, hofFileName, function(err){
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        //Clear all submission and payment info from users
                        fs.readdir(submissionDir, (err, files) => {
                            
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                files.forEach(file => {
                                    fs.unlink(path.join(submissionDir, file), err => {
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        User.find({}, function(err, users){
                                            if(err)
                                            {
                                                console.log(err);
                                            }
                                            else
                                            {
                                                users.forEach(function(user){
                                                    user.sellToken = "";
                                                    user.hasSubmitted = false;
                                                    user.hasPayed = false;
                                                    user.save();
                                                });
                                            
                                                req.flash("success", "Congratulations, your art is now in the Hall of Fame!");
                                                res.redirect("/hof");
                                            }

                                        });
                                    }
                                });
                            });
                            }
                        
                        });
                
                    }
                });

            }
            else
            {
                res.redirect("/");
            }
            
        }

    });
    
});

module.exports = router;