// Route for the front page

'use strict';

var main = function(app) {

  app.get('/', function(req, res) {
    /* jshint camelcase: false */

  	var user = req.user;

  	if (user != null) {
  		if (user.attributes.apartment_id != null) {
        var profile_pic;
        if (user.attributes.facebook_id!=null) {
          profile_pic = 'https://graph.facebook.com/' +
                         user.attributes.facebook_id  +
                           '/picture?height=300&width=300';
        } else if (user.attributes.google_id!=null) {
          profile_pic = 'http://placehold.it/300x300';
        } else {
          profile_pic = 'http://placehold.it/300x300';
        }
  			res.render('index', {firstname: user.attributes.first_name,
                   profile_pic: profile_pic});
  		} else {
  			res.render('components/apartment/index');
  		}
  	} else {
  		res.render('components/login/index');
  	}
  });

};

module.exports = main;
