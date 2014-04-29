var apartment = function(app) {

  app.get('/apartment/add', function(req, res) {
    res.end();
  });

  app.get('/apartment/edit/:apt', function(req, res) {
    res.end();
  });

  app.get('/apartment/edit', function(req, res) {
    res.end();
  });

  app.get('/apartment/delete', function(req, res) {
    res.end();
  });

  app.get('/apartment/info', function(req, res) {
    res.end();
  });

  app.get('/apartment/add/roommate', function(req, res) {
    res.end();
  });

};

module.exports = apartment;
