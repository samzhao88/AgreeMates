var supplies = function(app) {

  app.get('/supplies/add', function(req, res) {
    res.end();
  });

  app.get('/supplies/edit/:supply', function(req, res) {
    res.end();
  });

  app.post('/supplies/edit', function(req, res) {
    res.end();
  });

  app.post('/supplies/delete', function(req, res) {
    res.end();
  });

  app.get('/supplies/all', function(req, res) {
    res.end();
  });

};

module.exports = supplies;
