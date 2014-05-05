// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '286368104863121', // your App ID
		'clientSecret' 	: 'afe259278751cc567fa4a969e8c87fc5', // your App Secret
		'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback'
	},

	'googleAuth' : {
		'clientID' 		: '731732236492-0p1ngaeqevalm3c9fg95iht42obr4ojm.apps.googleusercontent.com',
		'clientSecret' 	: 's0iCD_xMDfwQlqEMzvdrZNcc',
		'callbackURL' 	: 'http://localhost:3000/auth/google/callback'
	}

};
