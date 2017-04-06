var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override");

var dbURL = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"
mongoose.connect(dbURL);

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.get("/", function(req, res){
    res.send("hi");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started");
});