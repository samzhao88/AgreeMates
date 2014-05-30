// Authentication set up

'use strict';

var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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


   // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
	passReqToCallback : true

    },
    function(req, token, refreshToken, profile, done) {

		// make the code asynchronous
		// User.findOne won't fire until we have all our data back from Google
		process.nextTick(function() {

			var name = profile.displayName.split(' ');
			
			if (!req.user) {
				new UserModel({google_id: profile.id})
					.fetch()
					.then(function(user) {
						if (user) {
							new UserModel({google_id: profile.id, first_name: name[0], last_name: name[1]})
											.save({google_picture: profile._json['picture'], email: profile.emails[0].value}, {patch: true})
											.then(function(model){
												new UserModel({google_id: profile.id, first_name: name[0]})
												.fetch()
												.then(function(userUpdate){
													return done(null,userUpdate);
												});
											});
							
						} else {
							new UserModel({
								first_name: name[0],
								last_name: name[1],
								email: profile.emails[0].value,
								google_id: profile.id,
								google_token: token
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
