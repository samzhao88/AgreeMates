// Supplies routes

'use strict';

var supplies = function(app) {

  app.get('/supplies', function(req, res) {
    res.json({title: 'Supplies'});
  });

  app.post('/supplies', function(req, res) {
    res.end();
  });

  app.get('/supplies/:supply', function(req, res) {
    res.end();
  });

  app.put('/supplies/:supply', function(req, res) {
    res.end();
  });

  app.delete('/supplies/:supply', function(req, res) {
    res.end();
  });

};

module.exports = supplies;
