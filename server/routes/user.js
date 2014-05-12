// User routes

'use strict';

var user = function(app) {

  // Get user
  app.get('/user/:user', function(req, res) {
    res.end();
  });

  // Adds a user to the database
  app.post('/user', function(req, res) {
    res.end();
  });

  // Edits a user
  app.put('/user/:user', function(req, res) {
    res.end();
  });

  // Delets a user
  app.delete('/user/:user', function(req, res) {
    res.end();
  });


};

module.exports = user;
