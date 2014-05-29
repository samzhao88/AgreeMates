// History back end unit tests

'use strict'

var Bookshelf = require('bookshelf');
Bookshelf.DB = Bookshelf.initialize({
  client: 'pg',
  connection: {}
});

var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var history = require('../../routes/history');

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

describe('History', function() {

  var res, resMock;

  beforeEach(function() {
    res = {json: function() {}};
    resMock = sinon.mock(res);
  });

  afterEach(function() {
    resMock.verify();
  });

  describe('getLatestHistory', function() {

    it('should return 401 if user is unauthorized', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});

      history.getLatestHistory(req, res);
    });

    it('should call fetchLatestHistory if the user is authorized', function() {
      var historyStub = emptyStub('fetchLatestHistory');
      var req = {user: {attributes: {apartment_id: 1}}};

      history.getLatestHistory(req, res);
      expect(historyStub).to.have.been.calledWith(1);
      historyStub.restore();
    });

    it('should return history if the request is valid', function() {
      var historyStub = succeedingStub('fetchLatestHistory', {items: []});
        var req = {user: {attributes: {apartment_id: 1}}};

        resMock.expects('json').once().withArgs({history: {items: []}});
        history.getLatestHistory(req, res);
        historyStub.restore();
    });

    it('should return 503 if there is a database error', function() {
      var historyStub = failingStub('fetchLatestHistory');
      var req = {user: {attributes: {apartment_id: 1}}};

      resMock.expects('json').once().withArgs(503, {error: 'Database error.'});
      history.getLatestHistory(req, res);
      historyStub.restore();
    });

  });

  describe('getPastHistory', function() {

    it('should return 401 if user is unauthorized', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});

      history.getLatestHistory(req, res);
    });

    it('should return 400 if history ID is invalid', function() {
      var req1 = {user: {attributes: {apartment_id: 1}}, params: {id: 0.5}};
      var req2 = {user: {attributes: {apartment_id: 1}}, params: {id: 'hi'}};
      resMock.expects('json').twice().withArgs(400, {error: 'Invalid history ID.'});

      history.getPastHistory(req1, res);
      history.getPastHistory(req2, res);
    });

    it('should call fetchLatestHistory if the user is authorized', function() {
      var historyStub = emptyStub('fetchPastHistory');
      var req = {user: {attributes: {apartment_id: 1}}, params: {id: 2}};

      history.getPastHistory(req, res);
      expect(historyStub).to.have.been.calledWith(1, 2);
      historyStub.restore();
    });

    it('should return history if the request is valid', function() {
      var historyStub = sinon.stub(history, 'fetchPastHistory',
        function(apartmentId, historyId, thenFun) {
          thenFun({items: []});
        });
      var req = {user: {attributes: {apartment_id: 1}}, params: {id: 2}};

      resMock.expects('json').once().withArgs({history: {items: []}});
      history.getPastHistory(req, res);
      historyStub.restore();
    });

    it('should return 503 if there is a database error', function() {
      var historyStub = sinon.stub(history, 'fetchPastHistory',
        function(apartmentId, historyId, thenFun, otherFun) {
          otherFun({items: []});
        });
      var req = {user: {attributes: {apartment_id: 1}}, params: {id: 2}};

      resMock.expects('json').once().withArgs(503, {error: 'Database error.'});
      history.getPastHistory(req, res);
      historyStub.restore();
    });

  });

});
