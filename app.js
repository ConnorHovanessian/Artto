var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    aestheticUtil = require("./util/aestheticUtil"),
    seedUtil = require("./util/seeds"),
    constants = require("./util/constants"),
    fs = require('fs'),
    cron = require('node-cron');

//requiring routes
var indexRoutes = require("./routes/index");
var hofRoutes = require("./routes/hof");
var paymentRoutes = require("./routes/payments");
var profileRoutes = require("./routes/profile");
var artRoutes = require("./routes/art");
    
var dbURL = process.env.DATABASEURL || "mongodb://localhost/lotto"
mongoose.connect(dbURL);

app.use(bodyParser.urlencoded({extended : true, limit : '5mb'}));
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
app.use(paymentRoutes);
app.use(artRoutes);
app.use(hofRoutes);
app.use(profileRoutes);

app.listen(process.env.PORT, process.env.IP, function(req){
    
    console.log("Artto started");
    
    var debug = process.argv[2];
    
    seedUtil.createAdminAccount();
    seedUtil.initializeSystemParameters();
    
    // create dirs for hof, hofContenders, and submissions
    // if they don't exist already
    var dirsToCreate = ["./public/hof", "./public/hofContenders", 
                        "./public/submissions"];
    dirsToCreate.forEach(dir => {
        if(!fs.existsSync(dir)) fs.mkdirSync(dir);
    });
    
    //schedule weekly round (now every 1 mins)
    cron.schedule('*/5 * * * *', function(){
        aestheticUtil.pickMostAesthetic();
    });
    
});
