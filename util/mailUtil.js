// all midleware
var mailUtil = {};

var Mailgun = require('mailgun-js');

//Mailgun API keys
//Your api key, from Mailgun’s Control Panel
var api_key = 'key-96a0295f5f9c7990d36cc237f364696d';

//Your domain, from the Mailgun Control Panel
var domain = 'sandbox4730a071afb34d268035b65dcc4180eb.mailgun.org';

//Your sending email address
var from_who = 'support@artto.com';

mailUtil.sendMail = function(to, subject, body, error)
{
    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
    //Specify email data
      from: from_who,
    //The email to contact
      to: to,
    //Subject and text data  
      subject: subject,
      html: body
    }

    //Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            error = err;
        }
    });
};

module.exports = mailUtil