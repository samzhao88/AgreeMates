// Comments routes

'use strict';

var comments = function(app) {

  app.get('/comments', function(req, res) {
    res.end();
  });

};

module.exports = comments;
