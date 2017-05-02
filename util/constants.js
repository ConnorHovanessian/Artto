var constants = {};

//================================================
//Regex Constants for Registration Validation
//================================================
constants.usernameRegex = /[a-zA-Z0-9_]{4,12}/;
constants.passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}/;
constants.emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

//================================================
//Values for server captcha validation
//================================================
constants.captchaURL = "https://www.google.com/recaptcha/api/siteverify";
constants.captchaSecret = "6LdoSB4UAAAAAHtwHsjjlHYGwcGLE8EYVVjq6W0k";
constants.captchaPublic = "6LdoSB4UAAAAAD3TBE6OA8HHnz9qh4aDiwD5Xyx3";

//================================================
//Mailgun API Keys
//================================================

//Your api key, from Mailgun’s Control Panel
constants.api_key = 'key-96a0295f5f9c7990d36cc237f364696d';

//Your domain, from the Mailgun Control Panel
constants.domain = 'sandbox4730a071afb34d268035b65dcc4180eb.mailgun.org';

//Your sending email address
constants.from_who = 'support@artto.com';

//================================================
//Application URL
//================================================
constants.appURL = process.env.APPURL || "https://lottery-bomjak.c9users.io";

//================================================
//Submission Config
//================================================
constants.numSelections = 10;
constants.submissionWidth = 1024;
constants.submissionHeight = 576;


module.exports = constants;