// Route for the front page

'use strict';

var UserModel = require('../models/user').model;

var main = function(app) {

  app.get('/', function(req, res) {
    /* jshint camelcase: false */

  	var user = req.user;

  	if (user != null) {
  		if (user.attributes.apartment_id != null) {
  			res.render('index');
  		} else {
  			res.render('components/apartment/index');
  		}
  	} else {
  		res.render('components/login/index');
  	}
  });

};

module.exports = main;
