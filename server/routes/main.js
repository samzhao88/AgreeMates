// Route for the front page

'use strict';

var main = function(app) {

  app.get('/', function(req, res) {
    /* jshint camelcase: false */

  	var user = req.user;
    console.log(req.session);

  	if (user != null) {
  		if (user.aparment_id != null) {
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
