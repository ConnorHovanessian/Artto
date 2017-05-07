var constants = {};

//================================================
//Regex Constants for Registration Validation
//================================================
constants.usernameRegex         = /[a-zA-Z0-9_]{4,12}/;
constants.passwordRegex         = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}/;
constants.emailRegex            = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

//================================================
//Values for server captcha validation
//================================================
constants.captchaURL            = "https://www.google.com/recaptcha/api/siteverify";
constants.captchaSecret         = "6LdoSB4UAAAAAHtwHsjjlHYGwcGLE8EYVVjq6W0k";
constants.captchaPublic         = "6LdoSB4UAAAAAD3TBE6OA8HHnz9qh4aDiwD5Xyx3";

//================================================
//Mailgun API Keys
//================================================

//Your api key, from Mailgun’s Control Panel
constants.api_key               = 'key-96a0295f5f9c7990d36cc237f364696d';

//Your domain, from the Mailgun Control Panel
constants.domain                = 'sandbox4730a071afb34d268035b65dcc4180eb.mailgun.org';

//Your sending email address
constants.from_who              = 'support@artto.com';

//================================================
//Stripe API Keys, URLs, and Config
//================================================
constants.keyPublishable = process.env.PUBLISHABLE_KEY || "pk_test_qNf1FF8I6DkUaR8nofX4F552";
constants.keySecret = process.env.SECRET_KEY || "sk_test_Y0rTWBLLRZeoC8fv7dYZPtXq";
constants.client_id = process.env.CLIENT_ID || "ca_AbvKU4bTuaXtBnImjb3oww3umfEwRJlI";

constants.stripeConnectURL = "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=" 
                             + constants.client_id + "&scope=read_write";

constants.chargePerSubmission = 100; //in cents

//================================================
//Application URL
//================================================
constants.appURL                = process.env.APPURL || "https://lottery-bomjak.c9users.io";

//================================================
//Submission Config
//================================================
constants.numSelections         = 10;
constants.submissionWidth       = 1024;
constants.submissionHeight      = 576;

//================================================
//System parameters Config
//================================================

// all system wide parameter value names go here
constants.curSelState           = "current_selection_state";
constants.prevSelState          = "previous_selection_state";
constants.systemParameters      = [constants.curSelState, constants.prevSelState];

// possible states for current selection
constants.curSelState_OPEN      = "OPEN";
constants.curSelState_SELECTING = "SELECTING";

// possible states for previous selection
constants.prevSelState_NONE     = "NONE";
constants.prevSelState_SELECTED = "SELECTED";
constants.prevSelState_SOLD     = "SOLD";
constants.prevSelState_KEPT     = "KEPT";



module.exports = constants;