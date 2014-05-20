'use strict';

var nodemailer = require('nodemailer');

function sendInvitation(id, email, aptName) {
  var smtpTransport = nodemailer.createTransport('SMTP', {
    service: 'Mandrill',
    auth: {
      user: process.env.MANDRILL_USER,
      pass: process.env.MANDRILL_PASS
    }
  });

  var mailOptions = {
    from: 'invitations@agreemates.com',
    to: email,
    subject: 'You have been invited to an AgreeMates apartment',
    generateTextFromHTML: true,
    html: 'You have been invited to ' + aptName + '! Click this ' +
      '<a href="' + process.env.MANDRILL_INVURL +
      id + '">link</a> to join'
  };

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + response.message);
    }
  });
}

module.exports = sendInvitation;

