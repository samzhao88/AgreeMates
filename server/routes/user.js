/**
 * Located in server/routes/user.js
 * Defines all the routes for users
 */
var user = function(app) {

  // Adds a user to the database
  app.get('/user/add', function(req, res) {
    res.end();
  });

  // Gets the users current information so they can edit it
  app.get('/user/edit/:user', function(req, res) {
    res.end();
  });

  // Updates the users information changes
  app.post('/user/edit', function(req, res) {
    res.end();
  });

  // Gets the users current notification preferences so they can edit it
  app.get('/user/edit/preferences/:user', function(req, res) {
    res.end();
  });

  // Updates the users preferences changes
  app.post('/user/edit/preferences', function(req, res) {
    res.end();
  });

};

module.exports = user;
