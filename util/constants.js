var constants = {};

//================================================
//Regex Constants for Registration Validation
//================================================
constants.usernameRegex = /[a-zA-Z0-9_]{4,12}/;
constants.passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}/;
constants.emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

module.exports = constants;