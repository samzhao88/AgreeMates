// Supplies back end unit tests
// jshint camelcase: false
// jshint maxlen: false

'use strict';

var supplies = require('../../routes/supplies');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var succeedingStub = function(functionName, parameters) {
  return sinon.stub(supplies, functionName, function(id, thenFun) {
    thenFun(parameters);
  });
};

var failingStub = function(functionName, parameters) {
  return sinon.stub(supplies, functionName, function(id, thenFun, otherFun) {
    otherFun(parameters);
  });
};

var emptyStub = function(functionName) {
  return sinon.stub(supplies, functionName);
};

describe('Supplies', function() {

  var res, resMock;

  beforeEach(function() {
    res = {json: function() {}, send: function() {}};
    resMock = sinon.mock(res);
  });

  afterEach(function() {
    resMock.verify();
  });

  describe('getSupplies', function() {

    it('should return 401 if user is not defined', function() {
      var req = {};
      resMock.expects('json').once().
        withArgs(401, {error: 'Unauthorized user.'});
      supplies.getSupplies(req, res);
    });

    it('queries for all supplies in the apartment', function() {
      var querySuppliesStub = emptyStub('querySupplies');
      var req = {user: {attributes: {apartment_id: 11}}};

      supplies.getSupplies(req, res);

      expect(querySuppliesStub).to.have.been.calledOnce;
      expect(querySuppliesStub).to.have.been.calledWith(11);

      querySuppliesStub.restore();
    });

    it('returns 503 if the supply query failed', function() {
      var querySuppliesStub = failingStub('querySupplies');
      var req = {user: {attributes: {apartment_id: 11}}};

      resMock.expects('json').once().
        withArgs(503, {error: 'Database error.'});

      supplies.getSupplies(req, res);

      querySuppliesStub.restore();
    });

    it('returns all supplies in the database', function() {
      var fakeSupplies = [
        {attributes: {id: 5, name: 'test supply numero uno', status: 1}},
        {attributes: {id: 2, name: 'test supply 2', status: 2}},
        {attributes: {id: 4, name: 'test supply 3', status: 1}}];
      var expectedJson = {supplies: [
                          {id: 5, name: 'test supply numero uno', status: 1},
                          {id: 2, name: 'test supply 2', status: 2},
                          {id: 4, name: 'test supply 3', status: 1}]};

      var querySuppliesStub = succeedingStub('querySupplies',
        {length: 3, models: fakeSupplies});
      var req = {user: {attributes: {apartment_id: 11}}};

      resMock.expects('json').once().
        withArgs(expectedJson);

      supplies.getSupplies(req, res);

      querySuppliesStub.restore();
    });
  });

  describe('addSupply', function() {

    it('should return 401 if user is not defined', function() {
      var req = {};
      resMock.expects('json').once().
        withArgs(401, {error: 'Unauthorized user.'});
      supplies.addSupply(req, res);
    });

    it('should return 400 if a supply name is invalid', function() {
      var req1 = {user: {attributes:
        {apartment_id: 1}}, body: {name: undefined}};
      var req2 = {user: {attributes:
        {apartment_id: 1}}, body: {name: null}};
      var req3 = {user: {attributes:
        {apartment_id: 1}}, body: {name: ''}};
      resMock.expects('json').thrice().
        withArgs(400, {error: 'Invalid supply name.'});
      supplies.addSupply(req1, res);
      supplies.addSupply(req2, res);
      supplies.addSupply(req3, res);
    });

    it('should return 400 if a supply status is invalid', function() {
      var req1 = {user: {attributes: {apartment_id: 1}}, body: {name: '1', status: -1}};
      var req2 = {user: {attributes: {apartment_id: 1}}, body: {name: '1', status: 'hello'}};
      var req3 = {user: {attributes: {apartment_id: 1}}, body: {name: '1', status: 3}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid supply status.'});
      supplies.addSupply(req1, res);
      supplies.addSupply(req2, res);
      supplies.addSupply(req3, res);
    });

    it('should save the supply with name and status', function() {
      var saveSupplyStub = emptyStub('saveSupply');
      var req = {user: {attributes: {apartment_id: 4}},
                 body: {name: 'test name', status: 1}};

      supplies.addSupply(req, res);

      expect(saveSupplyStub).to.have.been.calledOnce;
      expect(saveSupplyStub).to.have.been.calledWith(4, 'test name', 1);
      saveSupplyStub.restore();
    });

    it('should trim the name saved to the supply', function() {
      var saveSupplyStub = emptyStub('saveSupply');
      var req = {user: {attributes: {apartment_id: 4}},
                 body: {name: '  test untrimmed name   ', status: 1}};

      supplies.addSupply(req, res);

      expect(saveSupplyStub).to.have.been.calledOnce;
      expect(saveSupplyStub).to.have.been.
        calledWith(4, 'test untrimmed name', 1);
      saveSupplyStub.restore();
    });

    it('should log the save to the history', function() {
      var saveSupplyStub = sinon.stub(supplies, 'saveSupply',
        function(id, name, status, thenFun) {
          thenFun({attributes: {id: 1, name: '', status: 1}});
        });
      var saveHistoryStub = emptyStub('saveHistory');
      var req = {user: {attributes: {first_name: 'test', last_name: 'user',
        apartment_id: 4}}, body: {name: 'test name', status: 1}};

      var expectedHistoryString = 'test user added supply "test name"';
      supplies.addSupply(req, res);

      expect(saveHistoryStub).to.have.been.calledOnce;
      expect(saveHistoryStub).to.have.been.calledWith(4, expectedHistoryString);
      saveSupplyStub.restore();
      saveHistoryStub.restore();
    });

    it('should return added supply', function() {
      var saveSupplyStub = sinon.stub(supplies, 'saveSupply',
        function(id, name, status, thenFun) {
          thenFun({attributes: {id: 1, name: 'test name', status: 1}});
        });
      var saveHistoryStub = emptyStub('saveHistory');
      var req = {user: {attributes: {first_name: 'test', last_name: 'user',
        apartment_id: 4}}, body: {name: 'test name', status: 1}};

      var expectedJson = {id: 1, name: 'test name', status: 1};
      resMock.expects('json').once().
        withArgs(expectedJson);

      supplies.addSupply(req, res);

      saveSupplyStub.restore();
      saveHistoryStub.restore();
    });

    it('should return 503 if failed to save supply', function() {
      var saveSupplyStub = sinon.stub(supplies, 'saveSupply',
        function(id, name, status, thenFun, otherwiseFun) {
          otherwiseFun();
        });
      var req = {user: {attributes: {first_name: 'test', last_name: 'user',
        apartment_id: 4}}, body: {name: 'test name', status: 1}};
      resMock.expects('json').once().
        withArgs(503, {error: 'Database error.'});
      supplies.addSupply(req, res);
      saveSupplyStub.restore();
    });
  });

  describe('updateSupply', function() {

    it('should return 401 if user is not defined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
      supplies.updateSupply(req, res);
    });

    it('should return 400 if a supply ID is invalid', function() {
      var req1 = {user: {attributes: {apartment_id: 1}}, params: {supply: 0.5}, body: {name: '1', status: 1}};
      var req2 = {user: {attributes: {apartment_id: 1}}, params: {supply: -1}, body: {name: '1', status: 1}};
      var req3 = {user: {attributes: {apartment_id: 1}}, params: {supply: 'hello'}, body: {name: '1', status: 1}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid supply ID.'});
      supplies.updateSupply(req1, res);
      supplies.updateSupply(req2, res);
      supplies.updateSupply(req3, res);
    });

    it('should return 400 if a supply name is invalid', function() {
      var req1 = {user: {attributes: {apartment_id: 1}}, params: {supply: 1}, body: {name: undefined}};
      var req2 = {user: {attributes: {apartment_id: 1}}, params: {supply: 1}, body: {name: null}};
      var req3 = {user: {attributes: {apartment_id: 1}}, params: {supply: 1}, body: {name: ''}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid supply name.'});
      supplies.updateSupply(req1, res);
      supplies.updateSupply(req2, res);
      supplies.updateSupply(req3, res);
    });

    it('should return 400 if a supply status is invalid', function() {
var req1 = {user: {attributes: {apartment_id: 1}}, params: {supply: 1}, body: {name: '1', status: -1}};
var req2 = {user: {attributes: {apartment_id: 1}}, params: {supply: 1}, body: {name: '1', status: 'hello'}};
var req3 = {user: {attributes: {apartment_id: 1}}, params: {supply: 1}, body: {name: '1', status: 3}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid supply status.'});
      supplies.updateSupply(req1, res);
      supplies.updateSupply(req2, res);
      supplies.updateSupply(req3, res);
    });

    it('should edit the supply with a new supply id, name, and status', function() {
      var editSupplyStub = emptyStub('editSupply');
      var req = {user: {attributes: {apartment_id: 1}},
        params: {supply: 11}, body: {name: 'test name', status: 2}};
      supplies.updateSupply(req, res);
      expect(editSupplyStub).to.have.been.calledOnce;
      expect(editSupplyStub).to.have.been.calledWith(11, 1, 'test name', 2);
      editSupplyStub.restore();
    });

    it('should log the edit to the history', function() {
      var editSupplyStub = sinon.stub(supplies, 'editSupply',
        function(supplyId, apartmentId, name, status, thenFun) {
          thenFun();
        });
      var saveHistoryStub = emptyStub('saveHistory');
      var req = {user:
        {attributes: {first_name: 'test', last_name: 'user', apartment_id: 4}},
        params: {supply: 11}, body: {name: 'test name', status: 2}};

      supplies.updateSupply(req, res);

      var expectedHistoryString = 'test user edited supply "test name"';
      expect(saveHistoryStub).to.have.been.calledOnce;
      expect(saveHistoryStub).to.have.been.calledWith(4, expectedHistoryString);

      editSupplyStub.restore();
      saveHistoryStub.restore();
    });

    it('should return 200 if supply edit succeeded', function() {
      var editSupplyStub = sinon.stub(supplies, 'editSupply',
        function(supplyId, apartmentId, name, status, thenFun) {
          thenFun();
        });
      var req = {user: {attributes: {apartment_id: 1}},
        params: {supply: 11}, body: {name: 'test name', status: 2}};

      resMock.expects('send').once().withArgs(200);
      supplies.updateSupply(req, res);

      editSupplyStub.restore();
    });

    it('should return 400 if failed to edit supply', function() {
      var editSupplyStub = sinon.stub(supplies, 'editSupply',
        function(supplyId, apartmentId, name, status, thenFun, otherwiseFun) {
          otherwiseFun();
        });
      var req = {user: {attributes: {apartment_id: 1}},
        params: {supply: 11}, body: {name: 'test name', status: 2}};

      resMock.expects('json').once().
        withArgs(400, {error: 'Invalid supply ID.'});
      supplies.updateSupply(req, res);

      editSupplyStub.restore();
    });
  });

  describe('deleteSupply', function() {

    it('should return 401 if user is not defined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
      supplies.deleteSupply(req, res);
    });

    it('should return 400 if a supply ID is invalid', function() {
      var req1 = {user: {attributes: {apartment_id: 1}}, params: {supply: 0.5}};
      var req2 = {user: {attributes: {apartment_id: 1}}, params: {supply: -1}};
      var req3 = {user: {attributes: {apartment_id: 1}}, params: {supply: 'hello'}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid supply ID.'});
      supplies.deleteSupply(req1, res);
      supplies.deleteSupply(req2, res);
      supplies.deleteSupply(req3, res);
    });

    it('should fetch the supply', function() {
      var req = {user: {attributes: {apartment_id: 1}}, params: {supply: 12}};
      var fetchSupplyStub = emptyStub('fetchSupply');
      supplies.deleteSupply(req, res);
      expect(fetchSupplyStub).to.have.been.calledOnce;
      expect(fetchSupplyStub).to.have.been.calledWith(12);
      fetchSupplyStub.restore();
    });

    it('should return 503 if failed to fetch the supply', function() {
      var req = {user: {attributes: {apartment_id: 1}}, params: {supply: 12}};
      var fetchSupplyStub = failingStub('fetchSupply');
      resMock.expects('json').once().
        withArgs(503, {error: 'Database error.'});
      supplies.deleteSupply(req, res);
      fetchSupplyStub.restore();
    });

    it('should destroy the supply that was fetched', function() {
      var req = {user: {attributes: {first_name: 'test', last_name: 'user', apartment_id: 1}},
        params: {supply: 12}};
      var fetchSupplyStub = succeedingStub('fetchSupply');
      var destroySupplyStub = emptyStub('destroySupply');
      supplies.deleteSupply(req, res);
      expect(destroySupplyStub).to.have.been.calledOnce;
      expect(destroySupplyStub).to.have.been.calledWith(12, 1);
      destroySupplyStub.restore();
      fetchSupplyStub.restore();
    });

    it('should log the destroy to the history if destroy succeeded', function() {
      var fetchSupplyStub = succeedingStub('fetchSupply', {attributes: {name: 'test supply'}});
      var destroySupplyStub = sinon.stub(supplies, 'destroySupply',
        function(supplyId, apartmentId, thenFun) {
          thenFun();
        });
      var saveHistoryStub = emptyStub('saveHistory');
      var req = {user: {attributes: {first_name: 'test', last_name: 'user', apartment_id: 1}},
        params: {supply: 12}};

      supplies.deleteSupply(req, res);
      var expectedHistoryString = 'test user deleted supply "test supply"';
      expect(saveHistoryStub).to.have.been.calledOnce;
      expect(saveHistoryStub).to.have.been.calledWith(1, expectedHistoryString);
      saveHistoryStub.restore();
      destroySupplyStub.restore();
      fetchSupplyStub.restore();
    });

    it('should return 200 if destroy succeeded', function() {
      var fetchSupplyStub = succeedingStub('fetchSupply', {attributes: {name: 'test supply'}});
      var destroySupplyStub = sinon.stub(supplies, 'destroySupply',
        function(supplyId, apartmentId, thenFun) {
          thenFun();
        });
      var saveHistoryStub = emptyStub('saveHistory');
      var req = {user: {attributes: {first_name: 'test', last_name: 'user', apartment_id: 1}},
        params: {supply: 12}};

      resMock.expects('send').once().withArgs(200);
      supplies.deleteSupply(req, res);

      fetchSupplyStub.restore();
      destroySupplyStub.restore();
      saveHistoryStub.restore();
    });

    it('should return 503 if destroy failed', function() {
      var fetchSupplyStub = succeedingStub('fetchSupply', {attributes: {name: 'test supply'}});
      var destroySupplyStub = sinon.stub(supplies, 'destroySupply',
        function(supplyId, apartmentId, thenFun, otherwiseFun) {
          otherwiseFun();
        });
      var saveHistoryStub = emptyStub('saveHistory');
      var req = {user: {attributes: {first_name: 'test', last_name: 'user', apartment_id: 1}},
        params: {supply: 12}};

      resMock.expects('json').once().withArgs(503, {error: 'Database error.'});
      supplies.deleteSupply(req, res);

      fetchSupplyStub.restore();
      destroySupplyStub.restore();
      saveHistoryStub.restore();
    });
  });
});
