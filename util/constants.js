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

module.exports = constants;