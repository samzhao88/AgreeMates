// User routes

'use strict';

var user = function(app) {

  // Gets your user ID.
  app.get('/user', function(req, res) {
    if (req.user === undefined) {
      res.json(401, {error: 'Unauthorized user.'});
      return;
    }

    res.json({id: req.user.attributes.id});
  });

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
