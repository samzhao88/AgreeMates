// Bill routes

'use strict';

var bills = function(app) {

  //Get all bills in apartment information
  app.get('/bills', function(req, res) {
    res.json({title: 'Bills'});
  });

  //Get the details of selected bill information
  app.get('/bills/:bill', function(req, res) {
    res.end();
  });

  // Add bill to the database
  app.post('/bills', function(req, res) {
    res.end();
  });

  // Process edit bill form, modify database
  app.put('/bills/:bill', function(req, res) {
    res.end();
  });

  app.delete('/bills/:bill', function(req, res) {
    res.end();
  });

};

module.exports = bills;
