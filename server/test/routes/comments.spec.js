// Comments back end unit tests
// jshint camelcase: false
// jshint maxlen: false

'use strict';

var Bookshelf = require('bookshelf');
Bookshelf.DB = Bookshelf.initialize({
  client: 'pg',
  connection: {}
});

var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var comments = require('../../routes/comments');

var succeedingStub = function(functionName, parameters) {
  return sinon.stub(comments, functionName, function(id, thenFun) {
    thenFun(parameters);
  });
};

var failingStub = function(functionName, parameters) {
  return sinon.stub(comments, functionName, function(id, thenfun, otherFun) {
    otherFun(parameters);
  });
};

var emptyStub = function(functionName) {
  return sinon.stub(comments, functionName);
};

describe('Comments', function() {

  var res, resMock;

  beforeEach(function() {
    res = {json: function() {}, send: function() {}};
    resMock = sinon.mock(res);
  });

  afterEach(function() {
    resMock.verify();
  });

  describe('addComment', function() {

    it('should return 401 if the user is unauthorized', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});

      comments.addComment(req, res);
    });

    it('should return 400 if the message ID is invalid', function() {
      var req1 = {user: {attributes: {apartment_id: 1}}, params: {message: -1}, body: {}};
      var req2 = {user: {attributes: {apartment_id: 1}}, params: {message: 0.5}, body: {}};
      var req3 = {user: {attributes: {apartment_id: 1}}, params: {message: 'hi'}, body: {}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid message ID.'});

      comments.addComment(req1, res);
      comments.addComment(req2, res);
      comments.addComment(req3, res);
    });


    it('should return 400 if the comment content is undefined', function() {
      var req = {user: {attributes: {apartment_id: 1}},
        params: {message: 1}, body: {}};
      resMock.expects('json').once().withArgs(400, {error: 'Must have comment content'});
      comments.addComment(req, res);
    });

    it('should call createComment if the request is valid', function() {
      var req = {user: {attributes: {apartment_id: 1, id: 2}},
        params: {message: 1}, body: {body: 'test comment'}};
      var createCommentStub = emptyStub('createComment');
      comments.addComment(req, res);
      expect(createCommentStub).to.have.been.calledOnce;
      expect(createCommentStub).to.have.been.calledWith(2, 1, 'test comment');
      createCommentStub.restore();
    });

    it('should return 503 if failed to create comment', function() {
      var req = {user: {attributes: {apartment_id: 1, id: 2}},
        params: {message: 1}, body: {body: 'test comment'}};
      var createCommentStub = sinon.stub(comments, 'createComment',
        function(userId, messageId, text, date, thenFun, otherwiseFun) {
          otherwiseFun();
        });
      resMock.expects('json').once().
        withArgs(503, {error: 'Database error.'});
      comments.addComment(req, res);
      createCommentStub.restore();
    });

    it('should get the message after creating comment', function() {
      var req = {user: {attributes: {first_name: 'test', last_name: 'user',
        apartment_id: 1, id: 2}}, params: {message: 1}, body: {body: 'test comment'}};
      var createCommentStub = sinon.stub(comments, 'createComment',
        function(userId, messageId, text, date, thenFun) {
          thenFun({author: ''});
        });
      var getMessageStub = emptyStub('getMessage');
      comments.addComment(req, res);
      expect(getMessageStub).to.have.been.calledOnce;
      expect(getMessageStub).to.have.been.calledWith(1);
      createCommentStub.restore();
      getMessageStub.restore();
    });

    it('should return 503 if failed to get message', function() {
      var req = {user: {attributes: {first_name: 'test', last_name: 'user',
        apartment_id: 1, id: 2}}, params: {message: 1}, body: {body: 'test comment'}};
      var createCommentStub = sinon.stub(comments, 'createComment',
        function(userId, messageId, text, date, thenFun) {
          thenFun({author: ''});
        });
      var getMessageStub = failingStub('getMessage');
      resMock.expects('json').once().
        withArgs(503, {error: 'Database error.'});
      comments.addComment(req, res);
      createCommentStub.restore();
      getMessageStub.restore();
    });

    it('should save to history after getting the message', function() {
      var req = {user: {attributes: {first_name: 'test', last_name: 'user',
        apartment_id: 1, id: 2}}, params: {message: 1}, body: {body: 'test comment'}};
      var createCommentStub = sinon.stub(comments, 'createComment',
        function(userId, messageId, text, date, thenFun) {
          thenFun({author: ''});
        });
      var getMessageStub = succeedingStub('getMessage', {attributes:
                                          {subject: 'test message'}});
      var createHistoryStub = emptyStub('createHistory');
      comments.addComment(req, res);
      expect(createHistoryStub).to.have.been.calledOnce;
      expect(createHistoryStub).to.have.been.calledWith(1, 'test user commented on message "test message"');
      createCommentStub.restore();
      getMessageStub.restore();
      createHistoryStub.restore();
    });

  });

  describe('deleteComment', function() {

    it('should return 401 if the user is unauthorized', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});

      comments.deleteComment(req, res);
    });

    it('should return 400 if the message ID is invalid', function() {
      var req1 = {user: {attributes: {apartment_id: 1}}, params: {message: -1}, body: {}};
      var req2 = {user: {attributes: {apartment_id: 1}}, params: {message: 0.5}, body: {}};
      var req3 = {user: {attributes: {apartment_id: 1}}, params: {message: 'hi'}, body: {}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid message ID.'});

      comments.deleteComment(req1, res);
      comments.deleteComment(req2, res);
      comments.deleteComment(req3, res);
    });

    it('should return 400 if the comment ID is invalid', function() {
      var req1 = {user: {attributes: {apartment_id: 1}}, params: {message: 1, comment: -1}, body: {}};
      var req2 = {user: {attributes: {apartment_id: 1}}, params: {message: 1, comment: 0.5}, body: {}};
      var req3 = {user: {attributes: {apartment_id: 1}}, params: {message: 1, comment: 'hi'}, body: {}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid comment ID.'});

      comments.deleteComment(req1, res);
      comments.deleteComment(req2, res);
      comments.deleteComment(req3, res);
    });

    it('should get the message the comment is part of', function() {
      var getMessageStub = emptyStub('getMessage');
      var req = {user: {attributes: {apartment_id: 1}}, params: {message: 1, comment: 1}};
      comments.deleteComment(req, res);
      expect(getMessageStub).to.have.been.calledOnce;
      expect(getMessageStub).to.have.been.calledWith(1);
      getMessageStub.restore();
    });

    it('should return 503 if failed to get message', function() {
      var getMessageStub = failingStub('getMessage');
      var req = {user: {attributes: {apartment_id: 1}}, params: {message: 1, comment: 1}};
      resMock.expects('json').once().
        withArgs(503, {error: 'Database error.'});
      comments.deleteComment(req, res);
      getMessageStub.restore();
    });

    it('should destroy the comment if the message is fetched', function() {
      var getMessageStub = succeedingStub('getMessage');
      var destroyCommentStub = emptyStub('destroyComment');
      var req = {user: {attributes: {apartment_id: 1, id: 2}}, params: {message: 1, comment: 1}};
      comments.deleteComment(req, res);
      expect(destroyCommentStub).to.have.been.calledOnce;
      expect(destroyCommentStub).to.have.been.calledWith(1, 1, 2);
      getMessageStub.restore();
      destroyCommentStub.restore();
    });

    it('should save the delete to history and return 200 if destroy succeeded', function() {
      var getMessageStub = sinon.stub(comments, 'getMessage',
        function(messageId, thenFun) {
          thenFun({attributes: {subject: 'test message'}});
        });
      var destroyCommentStub = sinon.stub(comments, 'destroyComment',
        function(messageId, commentId, userId, thenFun) {
          thenFun();
        });
      var createHistoryStub = emptyStub('createHistory');
      var req = {user: {attributes: {apartment_id: 1, id: 2,
        first_name: 'test', last_name: 'user'}},
        params: {message: 1, comment: 1}};
      resMock.expects('send').once().withArgs(200);
      comments.deleteComment(req, res);
      expect(createHistoryStub).to.have.been.calledOnce;
      expect(createHistoryStub).to.have.been.calledWith(1, 'test user deleted their comment on message "test message"');
      getMessageStub.restore();
      destroyCommentStub.restore();
      createHistoryStub.restore();
    });

    it('should return 503 if failed to destroy comment', function() {
      var getMessageStub = succeedingStub('getMessage');
      var destroyCommentStub = sinon.stub(comments, 'destroyComment',
        function(messageId, commentId, userId, thenFun, otherwiseFun) {
          otherwiseFun();
        });
      var req = {user: {attributes: {apartment_id: 1, id: 2,
        first_name: 'test', last_name: 'user'}},
        params: {message: 1, comment: 1}};
      resMock.expects('json').once().withArgs(503, {error: 'Database error.'});
      comments.deleteComment(req, res);
      getMessageStub.restore();
      destroyCommentStub.restore();
    });

  });

});
