// server/config.js
// Returns the configuration values of the application.

var path = require('path');
var root = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development'; //sets enviroment

//sets the configuration for development or production based upon env
var config = {
  development: {
    root: root,
    port: process.env.PORT || 3000,
    db: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'agreemaets',
      database: 'postgres',
      port: 5432,
    }
  },
  production: {
    root: root,
    port: process.env.PORT,
    db: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
    }
  }
};

module.exports = config[env];
