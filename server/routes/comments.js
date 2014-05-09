// Comments routes

'use strict';

var comments = function(app) {

  app.get('/comments/recent', function(req, res) {
    res.end();
  });

};

module.exports = comments;
