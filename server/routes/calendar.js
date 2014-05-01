var calendar = function(app) {

  app.get('/calendar/show', function(req, res) {
    res.json({title: 'Calendar'});
  });

};

module.exports = calendar;
