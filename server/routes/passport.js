// Authentication routes

'use strict';

module.exports = function(app, passport) {

	// facebook authentication
	app.get('/auth/facebook',
		passport.authenticate('facebook', {
			scope : 'email'
		})
	);


	// facebook authentication callback
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/',
			failureRedirect : '/'
		})
	);

  app.get('/auth/facebook/invite/:invite', function(req, res, next) {
    passport.authenticate('facebook', {
      callbackURL : '/auth/facebook/callback/'+req.params.invite,
      scope : 'email'
    })(req, res, next);
  });

  app.get('/auth/facebook/callback/:invite', function(req, res, next) {
    passport.authenticate('facebook', {
      callbackURL : '/auth/facebook/callback/'+req.params.invite,
      successRedirect : '/invitations/'+req.params.invite,
      failureRedirect : '/'
    })(req, res, next);
  });

	// log out
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// google authentication
  app.get('/auth/google',
		passport.authenticate('google', {
			scope: ['https://www.googleapis.com/auth/userinfo.profile',
							'https://www.googleapis.com/auth/userinfo.email']
		})
	);

  // google authentication callback
	app.get('/auth/google/callback',
		passport.authenticate('google', {
			successRedirect : '/',
			failureRedirect : '/'
		})
	);

	// unlink facebook
	app.get('/unlink/facebook', function(req, res) {
		var user = req.user;
	  user.facebook.token = undefined;
	  user.save(function(err) {
			if (err) {

			} else {
	  		res.redirect('/profile');
			}
	  });
	});

	// unlink google
  app.get('/unlink/google', function(req, res) {
		var user = req.user;
  	user.google.token = undefined;
    user.save(function(err) {
			if (err) {

			} else {
				res.redirect('/profile');
			}
    });
  });

};

// check if a user is logged in
// function isLoggedIn(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		return next();
// 	}
//
// 	res.redirect('/');
// }
