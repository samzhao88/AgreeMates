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

    if (!isValidName(name)) {
      res.json(400, {error: 'Invalid supply name.'});
      return;
    } else if (!isValidStatus(status)) {
      res.json(400, {error: 'Invalid supply status.'});
      return;
    }

    new SupplyModel({apartment_id: apartmentId, name: name.trim(), status: status})
      .save()
      .then(function(model) {
        var supply = model.attributes;
        res.json({id: supply.id, name: supply.name, status: supply.status});
      }).otherwise(function(error) {
        res.json(503, {error: 'Database error.'});
      });
  });

  // Update a single supply
  app.put('/supplies/:supply', function(req, res) {
    /* jshint camelcase: false */

    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    var apartmentId = req.user.attributes.apartment_id;
    var supplyId = req.params.supply;
    var name = req.body.name;
    var status = req.body.status;

    if (!isValidId(supplyId)) {
      res.json(400, {error: 'Invalid supply ID.'});
      return;
    } else if (!isValidName(name)) {
      res.json(400, {error: 'Invalid supply name'});
      return;
    } else if (!isValidStatus) {
      res.json(400, {error: 'Invalid supply status.'});
      return;
    }

    new SupplyModel({id: supplyId, apartment_id: apartmentId})
      .save({name: name.trim(), status: status}, {patch: true})
      .then(function(model) {
        res.send(200);
      })
      .otherwise(function(error) {
        res.json(400, {error: 'Invalid supply ID.'});
      });
  });

  // Delete a single supply
  app.delete('/supplies/:supply', function(req, res) {
    /* jshint camelcase: false */

    res.end();
  });

  // Checks if a supply name is valid
  function isValidName(name) {
    return name !== undefined && name !== null && name !== '';
  }

  // Checks if a supply ID is valid
  function isValidId(id) {
    return isInt(id) && id > 0;
  }

  // Checks if a supply status is valid
  function isValidStatus(status) {
    return isInt(status) && (status == 0 || status == 1 || status == 2);
  }

  // Checks if a value is an integer
  function isInt(value) {
    return !isNaN(value) && parseInt(value) == value;
  }

};

module.exports = supplies;
