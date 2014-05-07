// Route for the front page

'use strict';

// load up the user model
var UserModel = require('../models/user').model;

var main = function(app) {

  app.get('/', function(req, res) {
  	
  	var usr = req.user;
  	if(usr!=null){

  		//user is logged in

  		if(usr.aparment_id!=null){

  			//user has an apartment
  			res.render('index');
  		} else {

  			//user has no apart yet
  			res.render('components/apartment/index');
  		}
  	} else {

  		//user is not logged in
  		res.render('components/login/index');
  	}
	
  });

};

module.exports = main;
