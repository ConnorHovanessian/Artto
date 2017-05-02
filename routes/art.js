var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Submission = require("../models/submission");
var mailUtil = require("../util/mailUtil");
var constants = require("../util/constants");
var middleware = require("../middleware");
var fs = require('fs');

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
        User.findById(req.params.userID, function(err, user){
            if(err)
            {
                console.log(err);
                res.redirect("/");
            }
            else
            {
                var submission = {value : 0};
                
                Submission.create(submission, function(err, submission){
                    if(err)
                    {
                        console.log(err);
                        res.redirect("/");
                    }
                    else
                    {
                        submission.artist.id = user._id;
                        submission.artist.username = user.username;
                        submission.chosenForHOF = false;
                        submission.hofContender = false;
                        submission.rank = 0;
                        submission.dateSubmitted = Date.now();
                        submission.save();
                        
                        user.submissions.push(submission);
                        user.save();
                        
                        var img = req.body.img;
                        var data = img.replace(/^data:image\/\w+;base64,/, "");
                        var buf = new Buffer(data, 'base64');
                        var uniqueFileName = __dirname + '/../public/submissions/' + submission._id + '.png';
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
                
            }
        });
        
    }
    
});

//Route to sell submission to Hall of Fame
router.get("/sell/:accountID/:token",  middleware.isLoggedIn, function(req, res){
    
    User.findById(req.params.accountID).populate("submissions").exec(function(err, user){
    
        if(err)
        {
            console.log(err);
            res.redirect("/");
        }
        else
        {
            if(user.sellToken != "" 
                && user.sellToken === req.params.token)
            {
                var chosenIndex = user.submissions.findIndex(function(sub){
                    return sub.hofContender;
                });
                
                //Copy submission to Hall of Fame
                var uniqueFileName = __dirname + '/../public/hofContenders/' + user.submissions[chosenIndex]._id + '.png';
                var hofFileName = __dirname + '/../public/hof/' + user.submissions[chosenIndex]._id + '.png';
                fs.rename(uniqueFileName, hofFileName, function(err){
                    if(err)
                    {
                        console.log(err);
                        res.redirect("/");
                    }
                    else
                    {
                        
                        //Choose this submission for the HOF
                        user.submissions[chosenIndex].chosenForHOF = true;
                        user.submissions[chosenIndex].hofContender = false;
                        user.submissions[chosenIndex].save();
                        user.sellToken = "";
                        user.save();
                        
                        req.flash("success", "Congratulations, your art is now in the Artto Hall of Fame!");
                        res.redirect("/hof");
                        
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

//Router to keep art submission
router.get("/keep/:accountID/:token",  middleware.isLoggedIn, function(req, res){
    
    User.findById(req.params.accountID).populate("submissions").exec(function(err, user){
    
        if(err)
        {
            console.log(err);
            res.redirect("/");
        }
        else
        {
            if(user.sellToken != "" 
                && user.sellToken === req.params.token)
            {
                
                var chosenIndex = user.submissions.findIndex(function(sub){
                    return sub.hofContender;
                });
                
                var nextRank = user.submissions[chosenIndex].rank + 1;
                var successMessage = "Thank you for responding, and enjoy your art! "
                                     + "The user will the next most aesthetic submission will be emailed next.";
                
                //If we're on our last HOF contender, do nothing
                if(nextRank > constants.numSelections)
                {
                    req.flash("success", successMessage);
                    return res.redirect("/home");
                }
                
                //Find next ranked HOF contender and email the user
                Submission.findOne({rank : nextRank, hofContender : true}, function(err, submission){
                    if(err)
                    {
                        console.log(err);
                        res.redirect("/");
                    }
                    else
                    {
                        if(!submission)
                        {
                            req.flash("success", "Thank you for responding, and enjoy your art!");
                            res.redirect("/home");
                        }
                        User.findById(submission.artist.id, function(err, user){
                            if(err)
                            {
                                console.log(err);
                                res.redirect("/");
                            }
                            else
                            {
                                user.sellToken = "";
                                user.save();
                                mailUtil.sendSelectionMail(user);
                                req.flash("success", successMessage);
                                res.redirect("/home");
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