// Supplies routes
// jshint camelcase: false

'use strict';

var SupplyModel = require('../models/supply').model;
var SupplyCollection = require('../models/supply').collection;
var HistoryModel = require('../models/history').model;

// Checks if a value is an integer
function isInt(value) {
  return !isNaN(value) && parseInt(value) == value;
}

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
  return isInt(status) && [0, 1, 2].indexOf(parseInt(status)) !== -1;
}


var Supplies = {
  setup: function(app) {
    app.get('/supplies', Supplies.getSupplies);
    app.post('/supplies', Supplies.addSupply);
    app.put('/supplies/:supply', Supplies.updateSupply);
    app.delete('/supplies/:supply', Supplies.deleteSupply);
  },
  getSupplies: function(req, res) {
    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    var apartmentId = req.user.attributes.apartment_id;
    Supplies.querySupplies(apartmentId, 
      function then(model) {
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
      }, 
      function otherwise() {
        res.json(503, {error: 'Database error.'});
      }
    );
  },
  addSupply: function(req, res) {
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

    Supplies.saveSupply(apartmentId, name.trim(), status,
      function then(model) {
        var supply = model.attributes;

        var historyString = req.user.attributes.first_name + ' ' +
          req.user.attributes.last_name + ' added Supply "' +
          name.trim() + '"';

        Supplies.saveHistory(apartmentId, historyString);
        res.json({id: supply.id, name: supply.name, status: supply.status});
      },
      function otherwise(error) {
        console.log(error);
        res.json(503, {error: 'Database error.'});
      });
  },
  updateSupply: function(req, res) {
    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    var apartmentId = req.user.attributes.apartment_id;
    var supplyId = req.params.supply;
    var name = req.body.name;
    var status = req.body.status;

    if (!isValidId(supplyId)) {
      console.log('invalid supply id' + supplyId);
      res.json(400, {error: 'Invalid supply ID.'});
      return;
    } else if (!isValidName(name)) {
      res.json(400, {error: 'Invalid supply name.'});
      return;
    } else if (!isValidStatus(status)) {
      res.json(400, {error: 'Invalid supply status.'});
      return;
    }

    Supplies.editSupply(supplyId, apartmentId, name.trim(), status,
      function then() {
        res.send(200);
      },
      function otherwise() {
        res.json(400, {error: 'Invalid supply ID.'});
      });
  },
  deleteSupply: function(req, res) {
    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    var apartmentId = req.user.attributes.apartment_id;
    var supplyId = req.params.supply;

    if (!isValidId(supplyId)) {
      res.json(400, {error: 'Invalid supply ID.'});
      return;
    }

    Supplies.fetchSupply(supplyId,
      function then(model) {
        var historyString = req.user.attributes.first_name + ' ' +
          req.user.attributes.last_name + ' deleted Supply "' +
          model.attributes.name + '"';
        Supplies.destroySupply(supplyId, apartmentId,
          function then() {
            Supplies.saveHistory(apartmentId, historyString);
            res.send(200);
          },
          function otherwise() {
            res.json(503, {error: 'Database error.'});
          });
      },
      function otherwise() {
        res.json(503, {error: 'Database error.'});
      });
  },
  fetchSupply: function(supplyId, thenFun, otherwiseFun) {
    new SupplyModel({id: supplyId})
    .fetch()
    .then(thenFun)
    .otherwise(otherwiseFun);
  },
  destroySupply: function(supplyId, apartmentId, thenFun, otherwiseFun) {
    new SupplyModel({id: supplyId, apartment_id: apartmentId})
    .destroy()
    .then(thenFun)
    .otherwise(otherwiseFun);
  },
  editSupply: function(supplyId, apartmentId, name, 
                       status, thenFun, otherwiseFun) {
    new SupplyModel({id: supplyId, apartment_id: apartmentId})
      .save({name: name, status: status}, {path: true})
      .then(thenFun)
      .otherwise(otherwiseFun);
  },
  saveHistory: function(apartmentId, historyString) {
    new HistoryModel({apartment_id: apartmentId,
                     history_string: historyString, date: new Date()})
      .save()
      .then(function() {})
      .otherwise(function() {});
  },
  saveSupply: function(apartmentId, name, status, thenFun, otherwiseFun) {
    new SupplyModel({apartment_id: apartmentId, name: name, status: status})
      .save()
      .then(thenFun)
      .otherwise(otherwiseFun);
  },
  querySupplies: function(apartmentId, thenFun, otherwiseFun) {
    new SupplyCollection()
    .query(function(qb) {
      qb.where('apartment_id', '=', apartmentId);
      qb.orderBy('status', 'asc');
    })
    .fetch()
    .then(thenFun)
    .otherwise(otherwiseFun);
  }
};

// Sets up all routes
module.exports = Supplies;

