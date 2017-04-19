var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var fs = require('fs');


//Route to render the hall of fame
router.get("/hof", middleware.isLoggedIn, function(req, res){
    
    var submissionDir = __dirname + '/../public/hof/';
     fs.readdir(submissionDir, (err, files) => {
         if(err)
         {
             console.log(err);
         }
         else
         {
             res.render("hof/hof", {files:files});
         }
     });
     
});

module.exports = router;