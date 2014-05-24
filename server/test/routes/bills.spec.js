// Bills back end unit tests

'use strict';

var app = require('../../app');
var chai = require('chai');
var bills = require('../../routes/bills');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var succeedingStub = function(functionName, params) {
  return sinon.stub(bills, functionName, function(id, thenFun) {
    thenFun(params);
  });
};

var failingStub = function(functionName, parameters) {
  return sinon.stub(bills, functionName, function(id, thenFun, otherFun) {
    otherFun(parameters);
  });
};

var emptyStub = function(functionName) {
  return sinon.stub(bills, functionName);
};

describe('Bills', function() {

  var res, resMock;

  beforeEach(function() {
    res = {json: function() {}};
    resMock = sinon.mock(res);
  });

  afterEach(function() {
    resMock.verify();
  });

  describe('getBills', function() {

    it('returns a list of bills and their payments', function() {
    var fetchBillsStub =  sinon.stub(bills, 'fetchBills', 
      function(apartmentId, resolved, thenFun, otherwiseFun) {
        thenFun([ {total: '5', user_id: 3, billPaid: false, userPaid: false,
               name: 'Test Bill', interval: 0, first_name: 'Jordan', 
               id: 3, bill_id: 43, amount: '5', creatorId: 3, payTo: 'Jordan',
               createdate: '5/20/2014', duedate: '5/29/2014'} ]);
      });

      var req = {query: {type: 'resolved'}, user: {attributes: {apartment_id: 1}}};
      resMock.expects('json').once().withArgs(
        {bills: [{id: 43, name: 'Test Bill',  amount: '5', 
          createDate: '5/20/2014', dueDate: '5/29/2014', frequency: 0,
          resolved: false, creatorId: 3, payTo: 'Jordan', 
          payments: [{userId: 3, name: 'Jordan', amount: '5', paid: false}]}]});

      bills.getBills(req, res);

      fetchBillsStub.restore();
    });

    it('should return 401 if user is undefined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
      bills.getBills(req, res);
    });

    it('should return 400 if the type query is unexpected', function() {
      var req1 = {user: {attributes: {}}, query: {type: undefined}};
      var req2 = {user: {attributes: {}}, query: {type: 'hello'}};
      resMock.expects('json').twice().withArgs(400, {error: 'Unexpected type parameter.'});
      bills.getBills(req1, res);
      bills.getBills(req2, res);
    });

  });

  describe('addBill', function() {

    it('should return 401 if user is undefined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
      bills.addBill(req, res);
    });

    it('should return 400 if the bill name is invalid', function() {
      var req1 = {user: {attributes: {}}, body: {name: undefined}};
      var req2 = {user: {attributes: {}}, body: {name: null}};
      var req3 = {user: {attributes: {}}, body: {name: ''}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid bill name.'});
      bills.addBill(req1, res);
      bills.addBill(req2, res);
      bills.addBill(req3, res);
    });

    it('should return 400 if the bill total is undefined or negative', function() {
      var req1 = {user: {attributes: {}}, body: {name: '1', total: undefined}};
      var req2 = {user: {attributes: {}}, body: {name: '1', total: -1}};
      resMock.expects('json').twice().withArgs(400, {error: 'Invalid bill total.'});
      bills.addBill(req1, res);
      bills.addBill(req2, res);
    });

    it('should return 400 if the interval is undefined or negative', function() {
      var req1 = {user: {attributes: {}}, body: {name: '1', total: 1, interval: undefined}};
      var req2 = {user: {attributes: {}}, body: {name: '1', total: 1, interval: -1}};
      resMock.expects('json').twice().withArgs(400, {error: 'Invalid bill interval.'});
      bills.addBill(req1, res);
      bills.addBill(req2, res);
    });

    it('should return 400 if the duedate is undefined', function() {
      var req = {user: {attributes: {}}, body: {name: '1', total: 1, interval: 1, date: undefined}};
      resMock.expects('json').once().withArgs(400, {error: 'Invalid due date.'});
      bills.addBill(req, res);
    });

    it('should return 400 if roommates is undefined', function() {
      var req = {user: {attributes: {}}, body: {name: '1', total: 1, interval: 1, date: 1, roommates: undefined}};
      resMock.expects('json').once().withArgs(400, {error: 'Invalid roommates.'});
      bills.addBill(req, res);
    });

  });

  describe('updatePayment', function() {

    it('should return 401 if user is undefined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
      bills.updatePayment(req, res);
    });

    it('should return 400 if the bill ID is invalid', function() {
      var req1 = {user: {attributes: {}}, body: {}, params: {bill: 0.5}};
      var req2 = {user: {attributes: {}}, body: {}, params: {bill: 'hello'}};
      var req3 = {user: {attributes: {}}, body: {}, params: {bill: -1}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid bill ID.'});
      bills.updatePayment(req1, res);
      bills.updatePayment(req2, res);
      bills.updatePayment(req3, res);
    });

    it('should return 400 if paid is not a boolean string', function() {
      var req1 = {user: {attributes: {}}, body: {paid: true}, params: {bill: 1}};
      var req2 = {user: {attributes: {}}, body: {paid: false}, params: {bill: 1}};
      var req3 = {user: {attributes: {}}, body: {paid: 'hello'}, params: {bill: 1}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid paid parameter.'});
      bills.updatePayment(req1, res);
      bills.updatePayment(req2, res);
      bills.updatePayment(req3, res);
    });

  });

  describe('editBill', function() {

    it('should return 401 if user is undefined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
      bills.editBill(req, res);
    });

    it('should return 400 if the bill ID is invalid', function() {
      var req1 = {user: {attributes: {}}, body: {}, params: {bill: 0.5}};
      var req2 = {user: {attributes: {}}, body: {}, params: {bill: 'hello'}};
      var req3 = {user: {attributes: {}}, body: {}, params: {bill: -1}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid bill ID.'});
      bills.editBill(req1, res);
      bills.editBill(req2, res);
      bills.editBill(req3, res);
    });

    it('should return 400 if the bill name is invalid', function() {
      var req1 = {user: {attributes: {}}, body: {name: undefined}, params: {bill: 1}};
      var req2 = {user: {attributes: {}}, body: {name: null}, params: {bill: 1}};
      var req3 = {user: {attributes: {}}, body: {name: ''}, params: {bill: 1}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid bill name.'});
      bills.editBill(req1, res);
      bills.editBill(req2, res);
      bills.editBill(req3, res);
    });

  });

  describe('deleteBill', function() {

    beforeEach(function() {
      res = { json: function() {}, send: function() {} };
      resMock = sinon.mock(res);
    });

    afterEach(function() {
      resMock.verify();
    });

    it('should return 401 if user is undefined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
      bills.deleteBill(req, res);
    });
        
    it('should return 400 if the bill ID is invalid', function() {
      var req1 = {user: {attributes: {}}, body: {}, params: {bill: 0.5}};
      var req2 = {user: {attributes: {}}, body: {}, params: {bill: 'hello'}};
      var req3 = {user: {attributes: {}}, body: {}, params: {bill: -1}};
      resMock.expects('json').thrice().withArgs(400, {error: 'Invalid bill ID.'});
      bills.deleteBill(req1, res);
      bills.deleteBill(req2, res);
      bills.deleteBill(req3, res);
    });

  });

});
