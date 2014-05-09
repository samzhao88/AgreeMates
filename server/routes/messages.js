// Messages routes

'use strict';

var messages = function(app) {

  app.get('/messages', function(req, res) {
    res.json({title: 'Message Board'});
  });

  // Get the information for a message
  app.get('/messages/:message', function(req, res) {
    res.end();
  });

  // Adds a message to the message board
  app.post('/messages', function(req, res) {
    res.end();
  });

  // Updates a messages content
  app.put('/messages/:message', function(req, res) {
    res.end();
  });

  // Deletes a message from the message board
  app.delete('/messages/:message', function(req, res) {
    res.end();
  });

};

module.exports = messages;
