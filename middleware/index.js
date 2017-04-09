// all midleware
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next)
{
    if(req.user && !req.user.verified)
    {
        req.logout();
        req.flash("error", "You need to verify your email before logging in.");
        return res.redirect("/");
    }
    if(req.isAuthenticated())
    {
        return next();
    }
    else
    {
        req.flash("error", "You need to be logged in.");
        return res.redirect("/");
    }
};

module.exports = middlewareObj