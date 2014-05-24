// History routes
// jshint camelcase: false

'use strict';

var HistoryModel = require('../models/history').model;
var HistoryCollection = require('../models/history').collection;

var History = {

  // Sets up all routes
  setup: function(app) {
    app.get('/history', History.getLatestHistory);
    app.get('/history/:id', History.getPastHistory);
  },

  // Gets latest history
  getLatestHistory: function(req, res) {
    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    var apartmentId = req.user.attributes.apartment_id;

    History.fetchLatestHistory(apartmentId,
      function then(collection) {
        res.json({history: collection});
      },
      function otherwise() {
        res.json(503, {error: 'Database error.'});
      });
  },

  // Fetches latest history from DB
  fetchLatestHistory: function(apartmentId, thenFun, otherFun) {
    new HistoryCollection()
      .query(function(qb) {
        qb.where('apartment_id', '=', apartmentId);
        qb.orderBy('date', 'desc');
        qb.limit(10);
      })
      .fetch()
      .then(thenFun)
      .otherwise(otherFun);
  },

  // Gets past history
  getPastHistory: function(req, res) {
    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    var apartmentId = req.user.attributes.apartment_id;
    var historyId = req.params.id;

    if (!isInt(historyId)) {
      res.json(400, {error: 'Invalid history ID.'});
      return;
    }

    History.fetchPastHistory(apartmentId, historyId,
      function then(collection) {
        res.json({history: collection});
      },
      function otherwise() {
        res.json(503, {error: 'Database error.'});
      });
  },

  // Fetches past history from DB
  fetchPastHistory: function(apartmentId, historyId, thenFun, otherFun) {
    new HistoryCollection()
      .query(function(qb) {
        qb.where('apartment_id', '=', apartmentId);
        qb.where('id', '<', historyId);
        qb.orderBy('date', 'desc');
        qb.limit(10);
      })
      .fetch()
      .then(thenFun)
      .otherwise(otherFun);
  },

};

// Checks if a value is an integer
function isInt(value) {
  return !isNaN(value) && parseInt(value) == value;
}

module.exports = History;
