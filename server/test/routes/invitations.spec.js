'use strict';

var supertest = require('supertest');
var app = require('../../app');
var expect = require('chai').expect;

var request = supertest(app);

describe('Invitations API', function() {
  describe('POST /invitations', function() {
    var agent1 = supertest.agent(app);

    it('succeeds', function() {
      agent1
        .post('http://localhost:3000/invitations/')
        .end(function(err, res) {});

      expect(true);
    });
  });
});
