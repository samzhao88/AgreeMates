var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var Bookshelf  = require('bookshelf');
var router = require('./routes');
var config = require('./config');

var app = express();

//this should only be called once in the application -> backend put that somewhere in the configs pls :)
Bookshelf.DB = Bookshelf.initialize({
  client: 'pg',
  connection: {
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.database,
    port	 : config.db.port,
    charset  : 'utf8'
  }
});

app.set('views', __dirname + './../public/app');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(logger());
app.use(compress());
app.use(bodyParser());
app.use(cookieParser());
router(app);
app.use(express.static(path.join(__dirname + './../public/app')));

app.listen(config.port, function() {
  console.log('Server running on port ' + config.port);

  /*
  //example code
  //get a specific user:
  var UserModel = require('./models/user').model;
  new UserModel({id: 0})
  .fetch()
  .then(function(user) {
  	console.log(user.first_name);
  });

  //get all users
  var UserCollection = require('./models/user').collection;

  new UserCollection()
  .fetch()
  .then(function(models) {
  	console.log(JSON.stringify(models));
  });

  //create a new user
  new UserModel({first_name: 'adf', last_name: 'asdf', email: 'adf', phone: '1111'})
  .save()
  .then(function(user){

  });

  //updating a user
  new UserModel({id: 0})
  .save({first_name: 'newname'}, {patch: true})
  .then(function(user){

  });
*/

});
