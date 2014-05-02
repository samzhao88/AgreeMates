/** 
 * Located in server/routes/main.js
 * Route for the front page
 */
var main = function(app) {

  app.get('/', function(req, res) {
    res.render('index', {title: 'AgreeMates', firstname: 'John'});
  });

};

module.exports = main;
