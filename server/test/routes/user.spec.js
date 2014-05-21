// User back end unit tests

'use strict';

var user = require('../../routes/user');
var sinon = require('sinon');

describe('User', function() {

  var res, resMock;

  beforeEach(function() {
    res = {json: function() {}};
    resMock = sinon.mock(res);
  });

  afterEach(function() {
    resMock.verify();
  });

  describe('getUserInfo', function() {

    it('should correctly return user info', function() {
      var req = {user: {attributes: {id: 1, first_name: 'first', last_name: 'last'}}};
      resMock.expects('json').once().withArgs({id: 1, first_name: 'first', last_name: 'last'});
      user.getUserInfo(req, res);
    });

  });

});
