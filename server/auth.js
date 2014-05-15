// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

  /* jslint maxlen: 130 */

  'facebookAuth' : {
    'clientID'      : process.env.FB_ID, // your App ID
    'clientSecret'  : process.env.FB_SECRET, // your App Secret
    'callbackURL'   : process.env.FB_CALLBACK
  },

  'googleAuth' : {
    'clientID'      : process.env.GOOG_ID,
    'clientSecret'  : process.env.GOOG_SECRET,
    'callbackURL'   : process.env.GOOG_CALLBACK
  }

};
