var router = function(app) {

  require('./main.js')(app);
  require('./bills.js')(app);
  require('./chores.js')(app);
  require('./supplies.js')(app);
  require('./calendar.js')(app);
  require('./messages.js')(app);
  require('./comments.js')(app);
  require('./user.js')(app);
  require('./apartment')(app);

};

module.exports = router;
