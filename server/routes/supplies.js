// Supplies routes

'use strict';

var SupplyModel = require('../models/supply').model;
var SupplyCollection = require('../models/supply').collection;

var supplies = function(app) {

  // Get all supplies for an apartment
  app.get('/supplies', function(req, res) {
    /* jshint camelcase: false */

    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    var apartmentId = req.user.attributes.apartment_id;

    new SupplyCollection({apartment_id: apartmentId})
      .fetch()
      .then(function(model) {
        var supplies = [];

        for (var i = 0; i < model.length; i++) {
          var supply = model.models[i].attributes;
          supplies.push({
            id: supply.id,
            name: supply.name,
            status: supply.status
          });
        }

        res.json({supplies: supplies});
      }).otherwise(function(error) {
        res.json(503, {error: 'Database error.'});
      });
  });

  // Create a new supply
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

    if ([0, 1, 2].indexOf(parseInt(status)) === -1) {
      console.log(req.body);
      res.json(400, {error: 'Invalid supply status.'});
      return;
    }

    new SupplyModel({apartment_id: apartmentId, name: name, status: status})
      .save()
      .then(function(model) {
        res.send(200);
      }).otherwise(function(error) {
        res.json(503, {error: 'Database error.'});
      });
  });

  // Get a single supply
  app.get('/supplies/:supply', function(req, res) {
    /* jshint camelcase: false */

    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    var supplyId = parseInt(req.params.supply);

    if (isNaN(supplyId)) {
      res.json(400, {error: 'Invalid supply ID.'});
      return;
    }

    new SupplyModel({id: supplyId})
      .fetch()
      .then(function(model) {
        if (model === null) {
          res.json(400, {error: 'Invalid supply ID.'});
        } else {
          var supply = model.attributes;
          res.json({id: supply.id, name: supply.name, status: supply.status});
        }
      })
      .otherwise(function(error) {
        res.json(503, {error: 'Database error.'});
      });
  });

  // Update a single supply
  app.put('/supplies/:supply', function(req, res) {
    /* jshint camelcase: false */

    res.end();
  });

  // Delete a single supply
  app.delete('/supplies/:supply', function(req, res) {
    /* jshint camelcase: false */

    res.end();
  });

};

module.exports = supplies;
