var path = require('path');
var root = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: root,
    port: 3000,
    db: {
      host: '127.0.0.1',
      user: 'USER',
      password: 'PASSWORD',
      database: 'DB_NAME'
    }
  },
  test: {
    root: root,
    port: process.env.TEST_PORT,
    db: {
      host: 'HOST',
      user: 'USER',
      password: 'PASSWORD',
      database: 'DB_NAME'
    }
  },
  production: {
    root: root,
    port: process.env.PRODUCTION_PORT,
    db: {
      host: 'HOST',
      user: 'USER',
      password: 'PASSWORD',
      database: 'DB_NAME'
    }
  }
};

module.exports = config[env];
