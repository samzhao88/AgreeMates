// Chore routes

var chores = function(app) {

  // Process chore form and adds to database
  app.post('chores/add', function(req, res) {
    res.end();
  });

  // Get the edit chore page information
  app.get('/chores/edit/:chore', function(req, res) {
    res.end();
  });

  // Process edit chore form, edit chore datatbase
  app.post('/chores/edit', function(req, res) {
    res.end();
  });

  // Remove chore from database
  app.post('/chores/delete', function(req, res) {
    res.end();
  });

  // Get all chores associated with user's apartment
  app.get('/chores/all', function(req, res) {
    res.json({title: 'Chores'});
  });

  // Get recent chores associated with user's apartment
  app.get('/chores/recent', function(req, res) {
    res.end();
  });

  // Get selected chores information
  app.get('/chores/:chore', function(req, res) {
    res.end();
  });

};

module.exports = chores;
