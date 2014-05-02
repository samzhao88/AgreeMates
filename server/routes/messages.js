var messages = function(app) {

  app.get('messages/add', function(req, res) {
    res.end();
  });

  app.get('/messages/edit/:message', function(req, res) {
    res.end();
  });

  app.post('/messages/edit', function(req, res) {
    res.end();
  });

  app.post('/messages/delete', function(req, res) {
    res.end();
  });

  app.get('/messages/recent', function(req, res) {
    res.json({title: 'Message Board'});
  });

};

module.exports = messages;
