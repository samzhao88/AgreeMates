var chores = function(app) {

  app.get('chores/add', function(req, res) {
    res.end();
  });

  app.get('/chores/edit/:chore', function(req, res) {
    res.end();
  });

  app.post('/chores/edit', function(req, res) {
    res.end();
  });

  app.post('/chores/delete', function(req, res) {
    res.end();
  });

  app.get('/chores/all', function(req, res) {
    res.json({title: 'Chores'});
  });

  app.get('/chores/recent', function(req, res) {
    res.end();
  });

  app.get('/chores/:chore', function(req, res) {
    res.end();
  });

};

module.exports = chores;
