var bills = function(app) {

  app.get('/bills/add', function(req, res) {
    res.end();
  });

  app.get('/bills/edit/:bill', function(req, res) {
    res.end();
  });

  app.post('/bills/edit', function(req, res) {
    res.end();
  });

  app.post('/bills/delete', function(req, res) {
    res.end();
  });

  app.get('/bills/all', function(req, res) {
    res.json({title: 'Bills'});
  });

  app.get('/bills/recent', function(req, res) {
    res.end();
  });

  app.get('/bills/:bill', function(req, res) {
    res.end();
  });

};

module.exports = bills;
