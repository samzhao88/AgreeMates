// Comments routes

'use strict';

var comments = function(app) {

  app.get('/messages/:message/comments', function(req, res) {
    res.end();
  });

  app.get('/messages/:message/comments/:comment', function(req, res) {
    res.end();
  });

  app.post('/messages/:message/comments', function(req, res) {
    res.end();
  });

  app.put('/messages/:message/comments/:comment', function(req, res) {
    res.end();
  });

  app.delete('/messages/:message/comments/:comment', function(req, res) {
    res.end();
  });

};

module.exports = comments;
