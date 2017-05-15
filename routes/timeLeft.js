var express = require("express");
var router = express.Router();

router.get("/timeLeft", function(req, res){

    var d = new Date(); 
    var seconds = d.getMinutes() * 60 + d.getSeconds();
    var tenmintime = seconds % (60*10);
    
    if(tenmintime < 60*4)
    {
        var timeleft = (60 * 4) - tenmintime; 
        var result = parseInt(timeleft / 60) + ':' + timeleft % 60;
    	res.send(result);
    }
    else if(tenmintime<60*5)
    {
        var result = "Currently selecting a winning piece of art!"
        res.send(result);
    }
    else if(tenmintime < 60*9)
    {
        var timeleft = (60 * 9) - tenmintime; 
        var result = parseInt(timeleft / 60) + ':' + timeleft % 60;
    	res.send(result);
    }
    else
    {
        var result = "Currently Selecting the Most Aesthetic Art!"
        res.send(result);
    }

	
});

module.exports = router;