// Invitations back end unit tests

'use strict';

var app = require('../../app');
var invitations = require('../../routes/invitations');
var sinon = require('sinon');

describe('Invitations', function() {

  var res, resMock;

  beforeEach(function() {
    res = {json: function() {}};
    resMock = sinon.mock(res);
  });

  afterEach(function() {
    resMock.verify();
  });

  describe('addInvitations', function() {

    it('returns 400 if no user', function() {
      var req = {body: 'blah'};
      resMock.expects('json').once().
        withArgs(400, {error: 'Missing user or body'});

      invitations.addInvitations(req, res);
    });

    it('returns 400 if no body', function() {
      var req = {user: 'Some User'};
      resMock.expects('json').once().
        withArgs(400, {error: 'Missing user or body'});

      invitations.addInvitations(req, res);
    });

  });

});
