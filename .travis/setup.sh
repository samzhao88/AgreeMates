#!/bin/bash

npm install -g bower
bower install

if [[ $TRAVIS_SECURE_ENV_VARS ]]
  npm install -g protractor
  sudo node server/app.js 80 & sleep 5
fi

