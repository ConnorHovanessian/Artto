var seeds = {};
var User = require("../models/user");
var Submission = require("../models/submission");
var constants = require("./constants");
var sysParamUtil = require("./systemParameters");

//================================================
//Function for admin account seed
//================================================
seeds.createAdminAccount = function(){
    Submission.remove({}, function(err) {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("removed submissions...");
        } 
    });
    User.remove({}, function(err){
       if(err)
       {
           console.log(err);
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
                    console.log(err);
                }
                else
                {
                    console.log("admin account created");
                }
                
            });
            
            var newUser2 = new User({
                username: "admin2",
                email: "dima.goncharov@hotmail.com",
                verified: true
            });
            
            User.register(newUser2, "admin", function(err, user){
                
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("admin account created");
                }
                
            });
            
            var newUser3 = new User({
                username: "admin3",
                email: "chovanes@sfu.ca",
                verified: true
            });
            
            User.register(newUser3, "admin", function(err, user){
                
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("admin account created");
                }
                
            });
            
            var newUser4 = new User({
                username: "admin4",
                email: "chovanes@sfu.ca",
                verified: true
            });
            
            User.register(newUser4, "admin", function(err, user){
                
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("admin account created");
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
            if(err)console.log(err)
        });
    });
    
};


module.exports = seeds;