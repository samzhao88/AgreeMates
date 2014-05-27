// Messages back end unit tests

'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var messages = require('../../routes/messages');
var sinon = require('sinon');

var succeedingStub = function(functionName, parameters) {
  return sinon.stub(messages, functionName, function(id, thenFun) {
    thenFun(parameters);
  });
};

var failingStub = function(functionName, parameters) {
  return sinon.stub(messages, functionName, function(id, thenFun, otherFun) {
    otherFun(parameters);
  });
};

var emptyStub = function(functionName) {
  return sinon.stub(messages, functionName);
};

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

    it('should query for all messages in apartment', function() {
      var queryMessagesStub = emptyStub('queryMessages');
      var req = {user: {attributes: {apartment_id: 1}}};
      messages.getMessages(req, res);
      expect(queryMessagesStub).to.have.been.calledOnce;
      expect(queryMessagesStub).to.have.been.calledWith(1);
      queryMessagesStub.restore();
    });

    it('should return 503 if failed to query messages', function() {
      var queryMessagesStub = failingStub('queryMessages');
      var req = {user: {attributes: {apartment_id: 1}}};

      resMock.expects('json').once().
        withArgs(503, {error: 'Database error.'});
      messages.getMessages(req, res);

      queryMessagesStub.restore();
    });

    it('should return empty messages array if no messages', function() {
      var queryMessagesStub = succeedingStub('queryMessages', 
        []);
      var req = {user: {attributes: {apartment_id: 1}}};

      resMock.expects('json').once().
        withArgs({messages: []});
      messages.getMessages(req, res);

      queryMessagesStub.restore();
    });

    it('should return all messages returned by the query', function() {
      var queryMessagesStub = succeedingStub('queryMessages', 
        [{messageId: 1, 
          subject: 'test subject 1',
          body: 'test body 1',
          comments: [{author: 'me'}],
          authorName: 'test author 1',
          messageDate: 1/1/14,
          user_id: 11}, 
         {messageId: 2,
          subject: 'test subject 2',
          body: 'test body 2',
          authorName: 'test author 2',
          messageDate: 2/2/14,
          user_id: 22}, 
         {messageId: 3,
          subject: 'test subject 3',
          body: 'test body 3',
          authorName: 'test author 3',
          messageDate: 3/3/14,
          user_id: 33}]);
      var req = {user: {attributes: {apartment_id: 1}}};

      resMock.expects('json').once().
        withArgs(
          {messages: [
            {id: 1,
             subject: 'test subject 1',
             body: 'test body 1',
             author: 'test author 1',
             date: 1/1/14,
             user_id: 11},
            {id: 2,
             subject: 'test subject 2',
             body: 'test body 2',
             author: 'test author 2',
             date: 2/2/14,
             user_id: 22},
            {id: 3,
             subject: 'test subject 3',
             body: 'test body 3',
             author: 'test author 3',
             date: 3/3/14,
             user_id: 33}]});
      messages.getMessages(req, res);

      queryMessagesStub.restore();
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
