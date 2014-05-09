// Authentication set up

'use strict';

var FacebookStrategy = require('passport-facebook').Strategy;
// var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var UserModel = require('./models/user').model;
var configAuth = require('./auth');

module.exports = function(passport) {
	/* jshint camelcase: false */

	// used to serialize the user for the session
  passport.serializeUser(function(user, done) {
		done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
		new UserModel({id: id})
			.fetch()
			.then(function(user) {
				done(null, user);
			});
	});

	// facebook strategy
  passport.use(new FacebookStrategy({
  	clientID : configAuth.facebookAuth.clientID,
    clientSecret : configAuth.facebookAuth.clientSecret,
    callbackURL : configAuth.facebookAuth.callbackURL,
    passReqToCallback : true
  },
	function(req, token, refreshToken, profile, done) {
		process.nextTick(function() {
			if (!req.user) {
				new UserModel({facebook_id: profile.id})
					.fetch()
					.then(function(user) {
						if (user) {
							return done(null, user);
						} else {
							new UserModel({
								first_name: profile.name.givenName,
								last_name: profile.name.familyName,
								email: profile.emails[0].value,
								facebook_id: profile.id,
								facebook_token: token
							})
								.save()
								.then(function(user) {
									return done(null, user);
							});
						}
				});
			} else {

			}
		});
	}));

};
