var user = function(app) {

  app.get('/user/add', function(req, res) {
    res.end();
  });

  app.get('/user/edit/:user', function(req, res) {
    res.end();
  });

  app.post('/user/edit', function(req, res) {
    res.end();
  });

  app.get('/user/edit/preferences/:user', function(req, res) {
    res.end();
  });

  app.post('/user/edit/preferences', function(req, res) {
    res.end();
  });

};

module.exports = user;
