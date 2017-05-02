var aestheticUtil = {};

var getPixels = require("get-pixels");
var fs = require('fs');
var mailUtil = require("../util/mailUtil");
var User = require("../models/user");
var Submission = require("../models/submission");
var constants = require("./constants");
const path = require('path');

//pick most aesthetic art submission
aestheticUtil.pickMostAesthetic = function(){
    
    console.log("Choosing most aesthetic artists...");
    var width = constants.submissionWidth;
    var height = constants.submissionHeight;
    
    //create reference piece by generating grid of rgb colors
    
    //initialize 2d array of image dimensions 
    var refPiece = new Array(width);
    for (var i = 0; i < width; i++) 
    {
        refPiece[i] = new Array(height);
    }
    
    for(var i = 0; i < width; i++)
    {
        for(var j = 0; j < height; j++)
        {
            var r = Math.floor(Math.random() * (255 - 0 + 1));
            var g = Math.floor(Math.random() * (255 - 0 + 1));
            var b = Math.floor(Math.random() * (255 - 0 + 1));
            var a = Math.random();
            refPiece[i][j] = {r:r, g:g, b:b, a:a};
        }
    }
    
    //get all submissions in dir
    var submissionDir = __dirname + '/../public/submissions/';
    var artScorePairs = [];
    fs.readdir(submissionDir, (err, files) => {

        if(err)
        {
            console.log(err);
        }
        else
        {
            files.forEach(file => {
                getPixels(submissionDir + file, function(err, pixels)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        //give the submission a score
                        //lowest score is best, means less variance from
                        //reference piece
                        var pixelIndex = 0;
                        var score = 0;
                        for(var i = 0; i < width; i++)
                        {
                            for(var j = 0; j < height; j++)
                            {
                                
                                score += Math.abs(refPiece[i][j].r - pixels.data[pixelIndex]);
                                score += Math.abs(refPiece[i][j].g - pixels.data[pixelIndex + 1]);
                                score += Math.abs(refPiece[i][j].b - pixels.data[pixelIndex + 2]);
                                score += Math.abs(refPiece[i][j].a - pixels.data[pixelIndex + 3]);
                                pixelIndex += 4;
                            }
                        }
                        
                        var pair = {name:file, score:score};
                        artScorePairs.push(pair);
                        
                        // if we're on the last scoring, find the lowest score
                        if(artScorePairs.length === files.length)
                        {
                            //sort scores (lowest to highest)
                            artScorePairs.sort(function(a,b){
                                return a.score - b.score;
                            });
                            
                            //Delete all old submissions that aren't in the HOF 
                            Submission.find({chosenForHOF : false}, function(err, submissions){
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    //Make sure we're not deleteing a submission that has been chosen
                                    submissions.forEach(function(submission){
                                        
                                        var found = false;
                                        artScorePairs.forEach(pair => {
                                            if(pair.name == ("" + submission._id + ".png")) found = true;
                                        });
                                        
                                        if(!found)
                                        {
                                            Submission.findByIdAndRemove(submission._id, function(err){
                                                if(err)
                                                {
                                                    console.log(err);
                                                }
                                            });
                                        }
                                        
                                    });
                                }
                            });
                            
                            //Remove all old HOF contender files (if any)
                            var hofContenderDir = __dirname + '/../public/hofContenders/';
                            fs.readdir(hofContenderDir, (err, files) => {
                                
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    files.forEach(file => {
                                        fs.unlink(path.join(hofContenderDir, file), err => {
                                            if(err)
                                            {
                                                console.log(err);
                                            }
                                        });
                                    });
                                }
                            });
                            
                            
                            //Move and update the configured number of selections
                            var numSelections = constants.numSelections > artScorePairs.length ? 
                                                    artScorePairs.length : constants.numSelections;
                                                    
                                                    console.log(artScorePairs);
                            for(var index = 0; index < numSelections; index++)
                            {
                                var uniqueFileName = __dirname + '/../public/submissions/' + artScorePairs[index].name;
                                var hofContenderFileName = __dirname + '/../public/hofContenders/' +  artScorePairs[index].name;
                                fs.rename(uniqueFileName, hofContenderFileName, function(err){
                                    if(err) console.log(err);
                                });
                                
                                Submission.findById(artScorePairs[index].name.slice(0,-4), function(err, submission){
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        submission.rank = artScorePairs.findIndex(function(pair){
                                            return (pair.name.slice(0,-4) == ("" + submission._id));
                                        });
                                        submission.rank++;
                                        submission.hofContender = true;
                                        console.log(submission);
                                        submission.save();
                                    }
                                });
                            }
                            
                            //Delete all submission files that weren't chosen
                            var submissionDir = __dirname + '/../public/submissions/';
                            fs.readdir(submissionDir, (err, files) => {
                                
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    files.forEach(file => {
                                        //Make sure we're not deleteing a submission that has been chosen
                                        var found = false;
                                        artScorePairs.forEach(pair => {
                                            if(pair.name == file) found = true;
                                        });
                                        
                                        if(!found)
                                        {
                                            fs.unlink(path.join(submissionDir, file), err => {
                                                if(err)
                                                {
                                                    console.log(err);
                                                }
                                            });
                                        }
                                        
                                    });
                                }
                            });
                            
                            //Reset user states
                            User.find({}, function(err, users){
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    users.forEach(function(userToReset){
                                        userToReset.hasSubmitted = false;
                                        userToReset.hasPayed = false;
                                        userToReset.save();
                                    });
                                }
                            });
                            
                            //email most aesthetic artist
                            Submission.findById(artScorePairs[0].name.slice(0,-4), function(err, submission){
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    User.findById(submission.artist.id, function(err, user){
                                        if(err)
                                        {
                                            console.log(err);
                                        }
                                        else
                                        {
                                            mailUtil.sendSelectionMail(user);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            });
        }
    });
    
};

module.exports = aestheticUtil;