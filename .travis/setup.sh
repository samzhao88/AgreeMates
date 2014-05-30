#!/bin/bash

npm install -g bower
bower install

if $TRAVIS_SECURE_ENV_VARS ; then
  npm install -g protractor
  node server/app.js & sleep 5
fi

