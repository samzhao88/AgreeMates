// Requires all the files containing routes for modularity

'use strict';

var router = function(app, passport) {

  require('./main.js')(app);
  require('./bills.js')(app);
  require('./chores.js')(app);
  require('./supplies.js')(app);
  require('./messages.js')(app);
  require('./comments.js')(app);
  require('./user.js')(app);
  require('./apartment.js')(app);
  require('./invitations.js')(app);
  require('./passport.js')(app, passport);

};

module.exports = router;
