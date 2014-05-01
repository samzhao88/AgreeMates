var path = require('path');
var root = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: root,
    port: process.env.PORT || 3000,
    db: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'agreemates',
      database: 'postgres',
      port: '5432',
    }
  },
  production: {
    root: root,
    port: process.env.PORT,
    db: {
      host: 'HOST',
      user: 'USER',
      password: 'PASSWORD',
      database: 'DB_NAME'
    }
  }
};

module.exports = config[env];
