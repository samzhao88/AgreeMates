var main = function(app) {

  app.get('/', function(req, res) {
    res.render('index', {title: 'AgreeMates'});
  });

};

module.exports = main;
