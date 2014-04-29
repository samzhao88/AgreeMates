var calendar = function(app) {
  
  app.get('/calendar/show', function(req, res) {
    res.end();
  });

};

module.exports = calendar;
