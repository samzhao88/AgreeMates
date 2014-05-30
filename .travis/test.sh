#!/bin/bash

npm test

if [[ $TRAVIS_SECURE_ENV_VARS ]]
  protractor protractor.travis.js
fi

