// User routes
// jshint camelcase: false

'use strict';

// Gets your user information
function getUserInfo(req, res) {
  if (req.user === undefined) {
    res.json(401, {error: 'Unauthorized user.'});
    return;
  }

  var userId = req.user.attributes.id;
  var firstName = req.user.attributes.first_name;
  var lastName = req.user.attributes.last_name;

  res.json({id: userId, first_name: firstName, last_name: lastName});
}

// Sets up all routes
function setup(app) {
  app.get('/user', getUserInfo);
}

module.exports.getUserInfo = getUserInfo;
module.exports.setup = setup;
