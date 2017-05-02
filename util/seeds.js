var seeds = {};
var User = require("../models/user");
var Submission = require("../models/submission");

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
       }
    });
    
};


module.exports = seeds;