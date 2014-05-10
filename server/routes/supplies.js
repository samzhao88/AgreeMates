// Supplies routes

'use strict';

var SupplyModel = require('../models/supply').model;

var supplies = function(app) {

  app.get('/supplies', function(req, res) {
    // if (req.user !== undefined) {
    //   new SupplyModel({apartment_id: req.user.attributes.apartment_id})
    //     .fetch()
    //     .then(function(model) {
    //       console.log(model);
    //     });
    // } else {
    //   res.send(401);
    // }

    res.end();
  });

  app.post('/supplies', function(req, res) {
    /* jshint camelcase: false */

    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    var apartmentId = req.user.attributes.apartment_id;
    var name = req.body.name;
    var status = req.body.status;

    if (name === undefined || name === null || name === '') {
      res.json(400, {error: 'Invalid supply name.'});
      return;
    }

    if (['0', '1', '2'].indexOf(status) === -1) {
      console.log(req.body);
      res.json(400, {error: 'Invalid supply status.'});
      return;
    }

    new SupplyModel({apartment_id: apartmentId, name: name, status: status})
      .save()
      .then(function(model) {
        res.send(200);
      });
  });

  app.get('/supplies/:supply', function(req, res) {
    res.end();
  });

  app.put('/supplies/:supply', function(req, res) {
    res.end();
  });

  app.delete('/supplies/:supply', function(req, res) {
    res.end();
  });

};

module.exports = supplies;
