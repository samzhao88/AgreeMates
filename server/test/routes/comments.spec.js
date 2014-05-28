// Comments back end unit tests

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
  return sinon.stub(history, functionName, function(id, thenFun) {
    thenFun(parameters);
  });
};

var failingStub = function(functionName, parameters) {
  return sinon.stub(history, functionName, function(id, thenfun, otherFun) {
    otherFun(parameters);
  });
};

var emptyStub = function(functionName) {
  return sinon.stub(history, functionName);
};

describe('Comments', function() {

  var res, resMock;

  beforeEach(function() {
    res = {json: function() {}};
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


    it('should return 400 if the comment content is null');

    it('should call createComment if the request is valid');

    it('should create a new comment and history item');

    it('should return 503 on a database error');

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

    it('should return 400 if the comment ID is invalid');

    it('should call destroyComment if the request is valid');

    it('should destroy the comment and create a history item');

    it('should return 504 on a database error');

  });

});
