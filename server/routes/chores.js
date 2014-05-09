// Chore routes

'use strict';

var chores = function(app) {

  app.get('/chores', function(req, res) {
    res.end();
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
