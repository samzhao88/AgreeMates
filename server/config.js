// server/config.js
// Returns the configuration values of the application.

var path = require('path');
var root = path.normalize(__dirname + '/..');

//sets the configuration for development or production based upon env
var config = {
  root: root,
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  }
};

module.exports = config;
