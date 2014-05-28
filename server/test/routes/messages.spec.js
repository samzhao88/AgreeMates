// Messages back end unit tests
// jshint camelcase: false
// jshint maxlen: false

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
    res = {json: function() {}, send: function() {}};
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
          comments: [],
          authorName: 'test author 1',
          messageDate: 1/1/14,
          user_id: 11},
         {messageId: 2,
          subject: 'test subject 2',
          body: 'test body 2',
          comments: [],
          authorName: 'test author 2',
          messageDate: 2/2/14,
          user_id: 22},
         {messageId: 3,
          subject: 'test subject 3',
          body: 'test body 3',
          comments: [],
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
             comments: [{author: undefined, body: undefined,
                date: undefined, id: undefined, user_id: undefined}],
             author: 'test author 1',
             date: 1/1/14,
             user_id: 11},
            {id: 2,
             subject: 'test subject 2',
             body: 'test body 2',
             comments: [{author: undefined, body: undefined,
                date: undefined, id: undefined, user_id: undefined}],
             author: 'test author 2',
             date: 2/2/14,
             user_id: 22},
            {id: 3,
             subject: 'test subject 3',
             body: 'test body 3',
             comments: [{author: undefined, body: undefined,
                date: undefined, id: undefined, user_id: undefined}],
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

    it('should create the message with the correct parameters', function() {
      var createMessageStub = emptyStub('createMessage');
      var req = {user: {attributes: {apartment_id: 123, id: 5}}, 
        body: {subject: 'test subject', body: 'test body'}};

      messages.addMessage(req, res);
      expect(createMessageStub).to.have.been.calledOnce;
      expect(createMessageStub).to.have.been.calledWith(123, 5, 'test subject', 'test body');
      createMessageStub.restore();
    });

    it('should save a successful create to the history', function() {
      var createMessageStub = sinon.stub(messages, 'createMessage',
        function(apartmentId, userId, subject, text, thenFun) { thenFun(); });
      var saveHistoryStub = emptyStub('saveHistory');
      var req = {user: {attributes: {first_name: 'test', last_name: 'user', 
        apartment_id: 123, id: 5}}, body: {subject: 'test subject', body: 'test body'}};

      messages.addMessage(req, res);
      expect(saveHistoryStub).to.have.been.calledOnce;
      expect(saveHistoryStub).to.have.been.
        calledWith(123, 'test user added a message "test subject"');
      createMessageStub.restore();
      saveHistoryStub.restore();
    });

    it('should return the created message', function() {
      var createMessageStub = sinon.stub(messages, 'createMessage',
        function(apartmentId, userId, subject, text, thenFun) {
          thenFun({apartment_id: apartmentId, user_id: userId, subject: subject, body: text});
        });
      var saveHistoryStub = emptyStub('saveHistory');
      var req = {user: {attributes: {first_name: 'test', last_name: 'user', 
        apartment_id: 123, id: 5}}, body: {subject: 'test subject', body: 'test body'}};

      resMock.expects('json').once().
        withArgs({apartment_id: 123, user_id: 5, subject: 'test subject', body: 'test body'});
      messages.addMessage(req, res);

      createMessageStub.restore();
      saveHistoryStub.restore();
    });
    it('should return 503 if failed to create message', function() {
      var createMessageStub = sinon.stub(messages, 'createMessage',
        function(apartmentId, userId, subject, text, thenFun, otherwiseFun) { otherwiseFun(); });
      var saveHistoryStub = emptyStub('saveHistory');
      var req = {user: {attributes: {first_name: 'test', last_name: 'user', 
        apartment_id: 123, id: 5}}, body: {subject: 'test subject', body: 'test body'}};

      resMock.expects('json').once().
        withArgs(503, {error: 'Database error.'});
      messages.addMessage(req, res);

      createMessageStub.restore();
      saveHistoryStub.restore();
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
      messages.editMessage(req, res);
    });

    it('should save the message with the valid parameters', function() {
      var req = {user: {attributes: {apartment_id: 5, id: 4}}, 
        params: {message: 1}, body: {subject: 'test subject', body: 'test text'}};
      var saveMessageStub = emptyStub('saveMessage');
      messages.editMessage(req, res);
      expect(saveMessageStub).to.have.been.calledOnce;
      expect(saveMessageStub).to.have.been.calledWith(1, 5, 4, 'test subject', 'test text');
      saveMessageStub.restore();
    });

    it('should log a successful edit to history', function() {
      var saveMessageStub = sinon.stub(messages, 'saveMessage',
        function(messageId, apartmentId, userId, subject, text, thenFun) { thenFun(); });
      var saveHistoryStub = emptyStub('saveHistory');
      var req = {user: {attributes: {apartment_id: 5, id: 4, first_name: 'test', 
        last_name: 'user'}}, params: {message: 1}, 
        body: {subject: 'test subject', body: 'test text'}};

      messages.editMessage(req, res);
      expect(saveHistoryStub).to.have.been.calledOnce;
      expect(saveHistoryStub).to.have.been.
        calledWith(5, 'test user edited their message "test subject"');
      saveMessageStub.restore();
      saveHistoryStub.restore();
    });

    it('should return 200 if the save was successful', function() {
      var saveMessageStub = sinon.stub(messages, 'saveMessage',
        function(messageId, apartmentId, userId, subject, text, thenFun) { thenFun(); });
      var saveHistoryStub = emptyStub('saveHistory');
      var req = {user: {attributes: {apartment_id: 5, id: 4, first_name: 'test', 
        last_name: 'user'}}, params: {message: 1}, 
        body: {subject: 'test subject', body: 'test text'}};

      resMock.expects('send').once().withArgs(200);
      messages.editMessage(req, res);
      saveMessageStub.restore();
      saveHistoryStub.restore();
    });

    it('should return 503 if the save failed', function() {
      var saveMessageStub = sinon.stub(messages, 'saveMessage',
        function(messageId, apartmentId, userId, subject, text, thenFun, otherwiseFun) {
          otherwiseFun();
        });
      var saveHistoryStub = emptyStub('saveHistory');
      var req = {user: {attributes: {apartment_id: 5, id: 4, first_name: 'test', 
        last_name: 'user'}}, params: {message: 1}, 
        body: {subject: 'test subject', body: 'test text'}};

      resMock.expects('json').once().withArgs(503, {error: 'Database error.'});
      messages.editMessage(req, res);
      saveMessageStub.restore();
      saveHistoryStub.restore();
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

    it('should fetch the message to be deleted', function() {
      var fetchMessageStub = emptyStub('fetchMessage');
      var req = {user: {attributes: {}}, body: {}, params: {message: 5}};
      messages.deleteMessage(req, res);
      expect(fetchMessageStub).to.have.been.calledOnce;
      expect(fetchMessageStub).to.have.been.calledWith(5);
      fetchMessageStub.restore();
    });

    it('should return 503 if message failed to be fetched', function() {
      var fetchMessageStub = failingStub('fetchMessage');
      var req = {user: {attributes: {}}, body: {}, params: {message: 5}};
      resMock.expects('json').once().
        withArgs(503, {error: 'Database error.'});
      messages.deleteMessage(req, res);
      fetchMessageStub.restore();
    });

    it('should destroy the comments of the message', function() {
      var fetchMessageStub = succeedingStub('fetchMessage');
      var destroyCommentsStub = emptyStub('destroyComments');
      var req = {user: {attributes: {apartment_id: 1, id: 2}}, body: {}, params: {message: 5}};
      messages.deleteMessage(req, res);
      expect(destroyCommentsStub).to.have.been.calledOnce;
      expect(destroyCommentsStub).to.have.been.calledWith(5, 2);
      fetchMessageStub.restore();
      destroyCommentsStub.restore();
    });

    it('should return 503 if failed to destroy comments', function() {
      var fetchMessageStub = succeedingStub('fetchMessage');
      var destroyCommentsStub = sinon.stub(messages, 'destroyComments',
        function(messageId, userId, thenFun, otherwiseFun) { otherwiseFun(); });
      var req = {user: {attributes: {apartment_id: 1, id: 2}}, body: {}, params: {message: 5}};
      resMock.expects('json').once().
        withArgs(503, {error: 'Error deleting comments'});
      messages.deleteMessage(req, res);
      fetchMessageStub.restore();
      destroyCommentsStub.restore();
    });

    it('should destroy the message after successfully destroying the comments', function() {
      var fetchMessageStub = succeedingStub('fetchMessage');
      var destroyCommentsStub = sinon.stub(messages, 'destroyComments',
        function(messageId, userId, thenFun) { thenFun(); });
      var destroyMessageStub = emptyStub('destroyMessage');
      var req = {user: {attributes: {apartment_id: 1, id: 2}}, body: {}, params: {message: 5}};
      messages.deleteMessage(req, res);
      expect(destroyMessageStub).to.have.been.calledOnce;
      expect(destroyMessageStub).to.have.been.calledWith(5, 1);
      fetchMessageStub.restore();
      destroyCommentsStub.restore();
      destroyMessageStub.restore();
    });

    it('should return 503 if failed to destroy message', function() {
      var fetchMessageStub = succeedingStub('fetchMessage');
      var destroyCommentsStub = sinon.stub(messages, 'destroyComments',
        function(messageId, userId, thenFun) { thenFun(); });
      var destroyMessageStub = sinon.stub(messages, 'destroyMessage',
        function(messageId, userId, thenFun, otherwiseFun) { otherwiseFun(); });
      var req = {user: {attributes: {apartment_id: 1, id: 2}}, body: {}, params: {message: 5}};
      resMock.expects('json').once().
        withArgs(503, {error: 'Error deleting message'});
      messages.deleteMessage(req, res);
      fetchMessageStub.restore();
      destroyCommentsStub.restore();
      destroyMessageStub.restore();
    });

    it('should save a successful message delete to history', function() {
      var fetchMessageStub = succeedingStub('fetchMessage', 
                       {attributes: {subject: 'test subject'}});
      var destroyCommentsStub = sinon.stub(messages, 'destroyComments',
        function(messageId, userId, thenFun) { thenFun(); });
      var destroyMessageStub = sinon.stub(messages, 'destroyMessage',
        function(messageId, userId, thenFun) { thenFun(); });
      var saveHistoryStub = emptyStub('saveHistory');
      var req = {user: {attributes: {apartment_id: 1, id: 2, 
        first_name: 'test', last_name: 'user'}}, body: {}, params: {message: 5}};

      messages.deleteMessage(req, res);
      expect(saveHistoryStub).to.have.been.calledOnce;
      expect(saveHistoryStub).to.have.been.
        calledWith(1, 'test user deleted the message "test subject"');
      fetchMessageStub.restore();
      destroyCommentsStub.restore();
      destroyMessageStub.restore();
      saveHistoryStub.restore();
    });

    it('should return 200 if the message was destroyed', function() {
      var fetchMessageStub = succeedingStub('fetchMessage', 
                       {attributes: {subject: 'test subject'}});
      var destroyCommentsStub = sinon.stub(messages, 'destroyComments',
        function(messageId, userId, thenFun) { thenFun(); });
      var destroyMessageStub = sinon.stub(messages, 'destroyMessage',
        function(messageId, userId, thenFun) { thenFun(); });
      var saveHistoryStub = emptyStub('saveHistory');
      var req = {user: {attributes: {apartment_id: 1, id: 2, 
        first_name: 'test', last_name: 'user'}}, body: {}, params: {message: 5}};

      resMock.expects('send').once().withArgs(200);
      messages.deleteMessage(req, res);
      fetchMessageStub.restore();
      destroyCommentsStub.restore();
      destroyMessageStub.restore();
      saveHistoryStub.restore();
    });
  });
});
