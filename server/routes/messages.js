/**
 * Located in server/routes/messages.js
 * Defines all the routes for messages
 */
var messages = function(app) {

  // Adds a message to the message board
  app.post('messages/add', function(req, res) {
    res.end();
  });

  // Get the information for a message to edit it
  app.get('/messages/edit/:message', function(req, res) {
    res.end();
  });

  // Updates a messages content
  app.post('/messages/edit', function(req, res) {
    res.end();
  });

  // Deletes a message from the message board
  app.post('/messages/delete', function(req, res) {
    res.end();
  });

  // Gets recent messages to display on the message board
  app.get('/messages/recent', function(req, res) {
    res.json({title: 'Message Board'});
  });

};

module.exports = messages;
