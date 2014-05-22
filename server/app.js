// Contains the code to start the server

'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compress = require('compression');

var dotenv = require('dotenv');
dotenv.load();

var Bookshelf  = require('bookshelf');
var passport = require('passport');
var router = require('./routes');
var config = require('./config');
var session = require('express-session');

var app = express();

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

require('./passport')(passport);

app.set('views', __dirname + './../public/app');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(logger('dev'));
app.use(compress());
app.use(bodyParser());
app.use(cookieParser());
app.use(session({ secret: 'AgreeMatesSessionSecret' }));
app.use(passport.initialize());
app.use(passport.session());

router(app, passport);

app.use(express.static(path.join(__dirname + './../public/app')));

app.listen(config.port, function() {
  console.log('Server running on port ' + config.port);
});

module.exports = app;
