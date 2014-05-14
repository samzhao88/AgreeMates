// Invitation routes

'use strict';

var ApartmentModel = require('../models/apartment').model;
var InvitationModel = require('../models/invitation').model;

var invitations = function(app) {

  var nodemailer = require('nodemailer');

  var sendInvitation = function(id, email, aptName) {
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
        '<a href="http://agreemates.com/invitations/' +
        id + '">link</a> to join'
    };

    smtpTransport.sendMail(mailOptions, function(error, response) {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent: ' + response.message);
      }
    });
  };

  // Add invitation to database
  app.post('/invitations', function(req, res) {
    /*jshint camelcase: false*/
    if (req.user === null || req.body === null) {
      res.json(400, {error: 'Missing user or body'});
      return;
    }

    var email = req.body.email;
    var apartmentId = req.user.attributes.apartment_id;
    if (apartmentId === null) {
      res.json(404, {error: 'could not fetch id'});
      return;
    }

    new ApartmentModel({id : apartmentId})
      .fetch()
      .then(function(apartment) {
        var apartmentName = apartment.attributes.name;
        new InvitationModel({apartment_id: apartmentId, email: email})
          .save()
          .then(function(model) {
            var invitation = model.attributes;
            sendInvitation(invitation.id, invitation.email, apartmentName);
            res.json({id: invitation.id, email: invitation.email});
          })
          .otherwise(function(error) {
            console.log(error);
            res.json(503, {error: 'error creating invitation'});
          });
      })
      .otherwise(function() {
        res.json(404, {error: 'error getting apartment'});
      });
  });

  app.get('/invitations', function(req, res) {
    res.json({title: 'title'});
  });

  // Get invitation information
  app.get('/invitations/:invite', function(req, res) {
    var result;
    new InvitationModel({id: req.params.invite})
      .fetch()
      .then(function(model) {
        /*jshint camelcase: false*/
        new ApartmentModel({id: model.attributes.apartment_id})
          .fetch()
          .then(function(model2) {
            console.log(model);
            result = {title: 'Invitation',
                     invId: model.attributes.id,
                     aptName: model2.attributes.name,
                     aptAddress: model2.attributes.address};
            var user = req.user;
            if (user != null) {
              res.render('components/invitations/index.ejs', result);
            } else {
              res.render('components/invitations/login.html', result);
            }
          })
          .otherwise(function(error) {
            console.log(error);
            res.status(404);
            result = {error: 'failed to fetch aparment'};
          });
      })
      .otherwise(function(error) {
        console.log(error);
        res.status(404);
        result = {error: 'error getting invitation'};
      });

  });

  // Removes invitation from the database
  app.delete('/invitations/:invite', function(req, res) {
    res.end();
  });

};

module.exports = invitations;
