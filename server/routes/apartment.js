// Apartment routes

'use strict';

var ApartmentModel = require('../models/apartment').model;

var apartment = function(app) {

  // Add apartment to database
  app.post('/apartment/add', function(req, res) {
    var name = req.body.name;
    var address = req.body.address;

    new ApartmentModel({name: name, address: address})
      .save()
      .then(function(model) {
        console.log(model);
        res.json({result : 'success'});
      })
      .otherwise(function(error) {
        res.json({result : 'error', error : error});
      });
  });

  // Get edit apartment page information
  app.get('/apartment/edit/:apt', function(req, res) {
    res.end();
  });

  // Edit apartment in database
  app.post('/apartment/edit', function(req, res) {
    res.end();
  });

  // Removes apartment from the database
  app.post('/apartment/delete', function(req, res) {
    res.end();
  });

  // Get the apartment settings page information
  app.get('/apartment', function(req, res) {
    res.end();
  });

  // Get the add roommate form information
  app.get('/apartment/add/roommate', function(req, res) {
    res.end();
  });

  // Receive add roommate form, process in database, and send email
  app.post('/apartment/add/roommate', function(req, res) {
    res.end();
  });

};

module.exports = apartment;
