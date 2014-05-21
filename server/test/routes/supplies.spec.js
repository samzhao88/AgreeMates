// Supplies back end unit tests

'use strict';

var supplies = require('../../routes/supplies');
var sinon = require('sinon');

describe('Supplies', function() {

  var res, resMock;

  beforeEach(function() {
    res = {json: function() {}};
    resMock = sinon.mock(res);
  });

  afterEach(function() {
    resMock.verify();
  });

  describe('getSupplies', function() {

    it('should return 401 if user is not defined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
      supplies.getSupplies(req, res);
    });

  });

  describe('addSupply', function() {

    it('should return 401 if user is not defined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
      supplies.addSupply(req, res);
    });

    it('should return 400 if a supply name is invalid', function() {
      var req1 = {user: {attributes: {apartment_id: 1}}, body: {name: undefined}};
      var req2 = {user: {attributes: {apartment_id: 1}}, body: {name: null}};
      var req3 = {user: {attributes: {apartment_id: 1}}, body: {name: ''}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid supply name.'});
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

  });

  describe('deleteSupply', function() {

    it('should return 401 if user is not defined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
      supplies.deleteSupply(req, res);
    });

    it('should return 400 if a supply ID is invalid', function() {
      var req1 = {user: {attributes: {apartment_id: 1}}, params: {supply: 0.5}, body: {name: '1', status: 1}};
      var req2 = {user: {attributes: {apartment_id: 1}}, params: {supply: -1}, body: {name: '1', status: 1}};
      var req3 = {user: {attributes: {apartment_id: 1}}, params: {supply: 'hello'}, body: {name: '1', status: 1}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid supply ID.'});
      supplies.deleteSupply(req1, res);
      supplies.deleteSupply(req2, res);
      supplies.deleteSupply(req3, res);
    });

  });

});
