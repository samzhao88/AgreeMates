// Apartment routes

'use strict';

var ApartmentModel = require('../models/apartment').model;
var UserModel = require('../models/user').model;

var apartment = function(app) {

  // Add apartment to database
  app.post('/apartment', function(req, res) {
    var name = req.body.name;
    var address = req.body.address;

    new ApartmentModel({name: name, address: address})
      .save()
      .then(function(model) {
        new UserModel({id: req.user.id})
          .save({apartment_id: model.id}, {patch: true})
          .then(function(model) {
            res.json({result : 'success'});
          });
      })
      .otherwise(function(error) {
        res.json({result : 'error', error : error});
      });
  });

  // Get edit apartment page information
  app.get('/apartment/:apt', function(req, res) {
    res.end();
  });

  // Edit apartment in database
  app.put('/apartment/:apt', function(req, res) {
    res.end();
  });

  // Removes apartment from the database
  app.delete('/apartment/:apt', function(req, res) {
    res.end();
  });

};

module.exports = apartment;
