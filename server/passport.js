// load all the things we need
var FacebookStrategy = require('passport-facebook').Strategy;
//var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var UserModel       = require('./models/user').model;

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

	// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
	done(null,user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
	/*
	Need a simple way to recreate a user without searching in database
	An example down below of idea
	*/
	new UserModel({id: id})
    	.fetch()
    	.then(function(user) {
    		done(null,user);
 	});
    });

	// code for facebook (use('facebook', new FacebookStrategy))
	// =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },

    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
	            // find the user in the database based on their facebook id
	            new UserModel({id: id})
    	.fetch()
    	.then(function(user){

	                // if there is an error, stop everything and return that
	                // ie an error connecting to the database
	               // if (err)
	                    //return done(err);

	                // if the user is found, then log them in
	                if (user) {
	                    return done(null, user); // user found, return that user
	                } else {
	                    // if there is no user found with that facebook id, create them
			    // set all of the facebook information in our user model
	                   new UserModel({first_name: profile.name.givenName, 
					last_name: profile.name.familyName, 
					email: profile.emails[0].value, 
					facebook_id: profile.id,
					facebook_token: token})
			   .save()
			   .then(function(user){
				return done(null, user);
 			  });
	                }

	            });
        });

    }));

   /* // =========================================================================
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
		
		if(!req.user){
	        // try to find the user based on their google id
	        User.findOne({ 'google.id' : profile.id }, function(err, user) {
	            if (err)
	                return done(err);

	            if (user) {
 			if (!user.google.token) {
                            user.google.token = token;
                            user.google.name  = profile.displayName;
                            user.google.email = profile.emails[0].value; // pull the first email

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }
	                // if a user is found, log them in
	                return done(null, user);
	            } else {
	                // if the user isnt in our database, create a new user
	                var newUser          = new User();

	                // set all of the relevant information
	                newUser.google.id    = profile.id;
	                newUser.google.token = token;
	                newUser.google.name  = profile.displayName;
	                newUser.google.email = profile.emails[0].value; // pull the first email

	                // save the user
	                newUser.save(function(err) {
	                    if (err)
	                        throw err;
	                    return done(null, newUser);
	                });
	            }
	        });
		}else{
			var user = req.user;

			user.google.id = profile.id;
			user.google.token = token;
			user.google.name = profile.displayName;
			user.google.email = profile.emails[0].value;

			//save the user
			user.save(function(err){
				if(err)
					throw err;
				return done(null,user);
			});
		
		}
	    });

    }));*/

};

