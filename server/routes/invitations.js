// Invitation routes

'use strict';

var invitations = function(app) {

  // Add invitation to database
  app.post('/invitations', function(req, res) {
    res.end();
  });

  // Get invitation information
  app.get('/invitations/:invite', function(req, res) {
    res.end();
  });

  // Removes invitation from the database
  app.delete('/invitation/:invite', function(req, res) {
    res.end();
  });

};

module.exports = invitations;
