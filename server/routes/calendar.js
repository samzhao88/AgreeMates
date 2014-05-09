// Calendar routes

'use strict';

var calendar = function(app) {

 // Shows the apartment calendar
  app.get('/calendar/:calendar', function(req, res) {
    res.json({title: 'Calendar'});
  });

};

module.exports = calendar;
