var seeds = {};
var User = require("../models/user");
var Submission = require("../models/submission");
var SystemParameter = require("../models/systemParameter");
var constants = require("./constants");
var sysParamUtil = require("./systemParameters");

//================================================
//Function to initialize debug environment
//================================================
seeds.initDebugEnv = function(callback){
    SystemParameter.remove({}, function(err) {
        if(err)
        {
            callback(err);
        }
        else
        {
            console.log("removed system parameters...");
            
            Submission.remove({}, function(err) {
                if(err)
                {
                    callback(err);
                }
                else
                {
                    console.log("removed submissions...");
                    User.remove({}, function(err){
                       if(err)
                       {
                           callback(err);
                       }
                       else
                       {
                           console.log("creating admin users...");
                            var newUser = new User({
                                username: "admin",
                                email: "dima.goncharov@hotmail.com",
                                verified: true
                            });
                            
                            User.register(newUser, "admin", function(err, user){
                                
                                if(err)
                                {
                                    callback(err);
                                }
                                else
                                {
                                    console.log("admin account created");
                                    var newUser2 = new User({
                                        username: "admin2",
                                        email: "dima.goncharov@hotmail.com",
                                        verified: true
                                    });
                                    
                                    User.register(newUser2, "admin", function(err, user){
                                        
                                        if(err)
                                        {
                                            callback(err);
                                        }
                                        else
                                        {
                                            console.log("admin account created");
                                            
                                            var newUser3 = new User({
                                                username: "admin3",
                                                email: "chovanes@sfu.ca",
                                                verified: true
                                            });
                                            
                                            User.register(newUser3, "admin", function(err, user){
                                                
                                                if(err)
                                                {
                                                    callback(err);
                                                }
                                                else
                                                {
                                                    console.log("admin account created");
                                                    
                                                    var newUser4 = new User({
                                                        username: "admin4",
                                                        email: "chovanes@sfu.ca",
                                                        verified: true
                                                    });
                                                    
                                                    User.register(newUser4, "admin", function(err, user){
                                                        
                                                        if(err)
                                                        {
                                                            callback(err);
                                                        }
                                                        else
                                                        {
                                                            
                                                            console.log("admin account created");
                                                            callback(null);
                                                        }
                                                        
                                                    });
                                                }
                                                
                                            });
                                            
                                            
                                        }
                                        
                                    });
                                }
                                
                            });
                       }
                    });
                } 
            });
            
       }
    });
    
};

//================================================
// System parameter seeds
//================================================
seeds.initializeSystemParameters = function(){
    
    constants.systemParameters.forEach(param => {
        
        sysParamUtil.addParameter(param, err => {
            
            // initialize parameters with default values if 
            // they didn't exist already
            if(err)
            {
                console.log(err);
            }
            else if(param === constants.curSelState)
            {
                sysParamUtil.setParameterValue(
                    param, constants.curSelState_OPEN, function(err){
                        if(err)
                        {
                            console.log(err);
                        } 
                        else
                        {
                            console.log("System parameter " + param 
                            + " initialized with value " + constants.curSelState_OPEN);
                        }
                    });
            }
            else if(param === constants.prevSelState)
            {
                sysParamUtil.setParameterValue(
                    param, constants.prevSelState_NONE, function(err){
                        if(err)
                        {
                            console.log(err);
                        } 
                        else
                        {
                            console.log("System parameter " + param 
                            + " initialized with value " + constants.prevSelState_NONE);
                        }
                    });
            }
             
        });
    });
    
};


module.exports = seeds;