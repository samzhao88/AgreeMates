// Chore routes

'use strict';
var choreModel = require('../models/chore').model;
var choreCollection = require('../models/chore').collection;

var chores = function(app) {

  //Get all chores for an apartment
  app.get('/chores', function(req, res) {
    res.json({chores: [{name: "dishes", interval: 7, users: ["alice" , "bob" ] },
     {name: "garbage", interval: 1, users: "bob"} ] });


  });

  // Process chore form and adds to database
  app.post('/chores', function(req, res) {
    res.end();
  });

  // Get the chore information
  app.get('/chores/:chore', function(req, res) {
    res.end();
  });

  // Update the chore
  app.put('/chores/:chore', function(req, res) {
    res.end();
  });

  // Remove chore from database
  app.delete('/chores/:chore', function(req, res) {
    res.end();
  });

};

module.exports = chores;