var express = require('express');
var bookshelf  = require('bookshelf');
var app = express();


//this should only be called once in the application -> backend put that somewhere in the configs pls :)
var bookshelf.pg = Bookshelf.initialize({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    user     : 'your_database_user',
    password : 'your_database_password',
    database : 'myapp_test',
    charset  : 'utf8'
  }
});