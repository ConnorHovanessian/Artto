var aestheticUtil = {};
var getPixels = require("get-pixels");
var fs = require('fs');
var mailUtil = require("../util/mailUtil");
var User = require("../models/user");

//pick most aesthetic art submission
aestheticUtil.pickMostAesthetic = function(){
    
    var width = 1024;
    var height = 576;
    
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
                                
                                score = Math.abs(refPiece[i][j].r - pixels.data[pixelIndex]);
                                score += Math.abs(refPiece[i][j].g - pixels.data[pixelIndex + 1]);
                                score += Math.abs(refPiece[i][j].b - pixels.data[pixelIndex + 2]);
                                score += Math.abs(refPiece[i][j].a - pixels.data[pixelIndex + 3]);
                                pixelIndex += 4;
                            }
                        }
                        
                        var pair = {name:file, score:score};
                        artScorePairs.push(pair);
            
                    }
                    
                    //sort scores (lowest to highest)
                    artScorePairs.sort(function(a,b){
                        return a.score - b.score;
                    });
                    
                    //email most aesthetic artist
                    User.findById(artScorePairs[0].name.slice(0,-4), function(err, user){
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            var subject = "Your Artto submission has been chosed as most aesthetic!";
            
                            var body = '<p>Hi ' + user.username + ',</p>';
                            body += '<p>Congratulations, your submission has been chosen as most aesthetic!</p> ';
                            //body += ' <p><a href="' + fullUrl + '">Verify</a></p>';
                            body += '<p>Cheers,</p>';
                            body += '<p>Artto Team</p>';
                            
                            var error;
                            mailUtil.sendMail(user.email, subject, body, error);
                            if(error)
                            {
                                console.log(error);
                            }
                        }
                    });
                });
            });
            
        }
    });
    
    
    
};

module.exports = aestheticUtil;