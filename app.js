var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override");

//requiring routes
var indexRoutes = require("./routes/index");
    
var dbURL = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"
mongoose.connect(dbURL);

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//================================================
//Passport Config
//================================================
app.use(require("express-session")({
    secret: "EFB64206B08666DF7866AF05442C237E20B6A8D16",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Passes currentUser object to all templates
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error =  req.flash("error");
    res.locals.success =  req.flash("success");
    next();
});

app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started");
});