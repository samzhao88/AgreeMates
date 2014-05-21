// Messages back end unit tests

'use strict';

var messages = require('../../routes/messages');
var sinon = require('sinon');

describe('Messages', function() {

  var res, resMock;

  beforeEach(function() {
    res = {json: function() {}};
    resMock = sinon.mock(res);
  });

  afterEach(function() {
    resMock.verify();
  });

  describe('getMessages', function() {

    it('should return 401 if user is not defined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
      messages.getMessages(req, res);
    });

  });

  describe('addMessage', function() {

    it('should return 401 if user is not defined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
      messages.addMessage(req, res);
    });

    it('should return 400 if the subject field is invalid', function() {
      var req = {user: {attributes: {}}, body: {}};
      resMock.expects('json').once().withArgs(400, {error: 'Invalid message subject.'});
      messages.addMessage(req, res);
    });

    it('should return 400 if the body field is invalid', function() {
      var req = {user: {attributes: {}}, body: {subject: '1'}};
      resMock.expects('json').once().withArgs(400, {error: 'Invalid message body.'});
      messages.addMessage(req, res);
    });

  });

  describe('editMessage', function() {

    it('should return 401 if user is not defined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
      messages.editMessage(req, res);
    });

    it('should return 400 if the message ID is invalid', function() {
      var req1 = {user: {attributes: {}}, body: {}, params: {message: 0.5}};
      var req2 = {user: {attributes: {}}, body: {}, params: {message: 'hello'}};
      var req3 = {user: {attributes: {}}, body: {}, params: {message: -1}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid message ID.'});
      messages.editMessage(req1, res);
      messages.editMessage(req2, res);
      messages.editMessage(req3, res);
    });

    it('should return 400 if the subject is invalid', function() {
      var req = {user: {attributes: {}}, params: {message: 1}, body: {}};
      resMock.expects('json').once().withArgs(400, {error: 'Invalid message subject.'});
      messages.editMessage(req, res);
    });

    it('should return 400 if the text is invalid', function() {
      var req = {user: {attributes: {}}, params: {message: 1}, body: {subject: '1'}};
      resMock.expects('json').once().withArgs(400, {error: 'Invalid message body.'});
      messages.addMessage(req, res);
    });

  });

  describe('deleteMessage', function() {

    it('should return 401 if user is not defined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
      messages.deleteMessage(req, res);
    });

    it('should return 400 if the message ID is invalid', function() {
      var req1 = {user: {attributes: {}}, body: {}, params: {message: 0.5}};
      var req2 = {user: {attributes: {}}, body: {}, params: {message: 'hello'}};
      var req3 = {user: {attributes: {}}, body: {}, params: {message: -1}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid message ID.'});
      messages.deleteMessage(req1, res);
      messages.deleteMessage(req2, res);
      messages.deleteMessage(req3, res);
    });

  });

});
