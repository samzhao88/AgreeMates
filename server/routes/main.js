// Route for the front page

'use strict';

var UserModel = require('../models/user').model;

var main = function(app) {

  app.get('/', function(req, res) {
    /* jshint camelcase: false */

  	var user = req.user;

  	if (user != null) {
  		if (user.attributes.apartment_id != null) {
        console.log(user);
        if(user.attributes.facebook_id!=null){
          var profile_pic = "https://graph.facebook.com/"+user.attributes.facebook_id+"/picture?type=large";
        } else if(user.attributes.google_id!=null){
          var profile_pic = "http://placehold.it/300x300";
          //var profile_pic = "http://picasaweb.google.com/data/entry/api/user/"+user.attributes.google_id+"?alt=json";
          //var profile_pic = "https://www.googleapis.com/plus/v1/people/"+user.attributes.google_id+"?fields=image&key={731732236492-0p1ngaeqevalm3c9fg95iht42obr4ojm.apps.googleusercontent.com}"
        } else {
          var profile_pic = "http://placehold.it/300x300";
        }
  			res.render('index', {firstname: user.attributes.first_name, profile_pic: profile_pic});
  		} else {
  			res.render('components/apartment/index');
  		}
  	} else {
  		res.render('components/login/index');
  	}
  });

};

module.exports = main;
