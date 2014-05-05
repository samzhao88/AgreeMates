// Supplies routes

'use strict';

var supplies = function(app) {

  // Adds a supply to be tracked by the app
  app.post('/supplies/add', function(req, res) {
    res.end();
  });

  // Gets information on a supply to edit it
  app.get('/supplies/edit/:supply', function(req, res) {
    res.end();
  });

  // Updates the changes to a supply
  app.post('/supplies/edit', function(req, res) {
    res.end();
  });

  // Deletes a supply so it is no longer tracked
  app.post('/supplies/delete', function(req, res) {
    res.end();
  });

  // Gets all supplies currently being tracked
  app.get('/supplies/all', function(req, res) {
    res.json({title: 'Supplies'});
  });

};

module.exports = supplies;
