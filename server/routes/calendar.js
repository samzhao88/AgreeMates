/**
 * server/routes/calendar.js
 * Calendar Routes
 */
var calendar = function(app) {

 // Shows the apartment calendar
  app.get('/calendar/show', function(req, res) {
    res.json({title: 'Calendar'});
  });

};

module.exports = calendar;
