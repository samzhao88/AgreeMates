// Route for the front page
// jshint camelcase: false

'use strict';

// Displays the right page to someone visiting the site
function getIndex(req, res) {
  if (req.user === undefined) {
    res.render('components/login/index');
    return;
  } else if (req.user.attributes.apartment_id === null) {
    res.render('components/apartment/index');
    return;
  }

  var profile_pic;

  if (req.user.attributes.facebook_id !== null) {
    profile_pic = 'https://graph.facebook.com/' +
      req.user.attributes.facebook_id +
      '/picture?height=300&width=300';
  } else if (req.user.attributes.google_id !== null) {
    profile_pic = 'img/default.png';
  } else {
    profile_pic = 'img/default.png';
  }

  res.render('index', {firstname: req.user.attributes.first_name,
    profile_pic: profile_pic});
}

// Sets up all routes
function setup(app) {
  app.get('/', getIndex);
}

module.exports.getIndex = getIndex;
module.exports.setup = setup;
