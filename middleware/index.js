// all midleware
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next)
{
    if(req.user && !req.user.verified)
    {
        req.flash("error", "You need to be logged in.");
        res.redirect("/");
    }
    
    if(req.isAuthenticated())
    {
        return next();
    }
    else
    {
        req.flash("error", "You need to be logged in.");
        res.redirect("/");
    }
};

module.exports = middlewareObj