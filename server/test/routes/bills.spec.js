// Bills back end unit tests

'use strict';

var Bookshelf = require('bookshelf');
Bookshelf.DB = Bookshelf.initialize({
  client: 'pg',
  connection: {}
});

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

var succeedDoubleStub = function(functionName, params) {
  return sinon.stub(bills, functionName,
    function(param1, param2, thenFun) {
      thenFun(params);
    });
};

var failDoubleStub = function (functionName, parameters) {
  return sinon.stub(bills, functionName,
    function (param1, param2, thenFun, otherFun) {
      otherFun(parameters);
    });
};

describe('Bills', function() {

  var res, resMock;

  beforeEach(function() {
    res = {json: function() {}, send: function() {}};
    resMock = sinon.mock(res);
  });

  afterEach(function() {
    resMock.verify();
  });

  describe('getBills', function() {

    it('fetches the bills', function() {
      var fetchBillsStub = emptyStub('fetchBills');
      var req = {query: {type: 'unresolved'},
        user: {attributes: {apartment_id: 1} } };
      bills.getBills(req, res);
      expect(fetchBillsStub).to.have.been.calledWith(1, 'unresolved');
      fetchBillsStub.restore();
    });

    it('should return empty json if rows in empty', function () {
      var fetchBillsStub = succeedDoubleStub('fetchBills', []);
      var req1 = {query: {type: 'resolved'},
        user: {attributes: {apartment_id: 1} } };
      resMock.expects('json').once().withArgs({bills: []});
      bills.getBills(req1, res);
      expect(fetchBillsStub).to.have.been.calledWith(1, 'resolved');
      fetchBillsStub.restore();
    });

    it('returns a list of bills and their payments', function() {
      var fetchBillsStub =  sinon.stub(bills, 'fetchBills',
        function(apartmentId, resolved, thenFun) {
          thenFun([ {total: '5', user_id: 3, billPaid: false, userPaid: false,
            name: 'Test Bill', interval: 0, first_name: 'Jordan',
            id: 3, bill_id: 43, amount: '5', creatorId: 3, payTo: 'Jordan',
            createdate: '5/20/2014', duedate: '5/29/2014'} ]);
        });

      var req = {query: {type: 'resolved'},
        user: {attributes: {apartment_id: 1}}};
      resMock.expects('json').once().withArgs(
        {bills: [{id: 43, name: 'Test Bill',  amount: '5',
          createDate: '5/20/2014', dueDate: '5/29/2014', frequency: 0,
          resolved: false, creatorId: 3, payTo: 'Jordan',
          payments: [{userId: 3, name: 'Jordan', amount: '5', paid: false}]}]});

      bills.getBills(req, res);
      fetchBillsStub.restore();
    });

    it('merges payments for the same bill together when returned', function() {
      var fetchBillsStub =  sinon.stub(bills, 'fetchBills',
        function(apartmentId, resolved, thenFun) {
          thenFun([
            {total: '5', user_id: 3, billPaid: false, userPaid: false,
            name: 'Test Bill', interval: 0, first_name: 'Jordan',
            id: 3, bill_id: 43, amount: '2', creatorId: 3, payTo: 'Jordan',
            createdate: '5/20/2014', duedate: '5/29/2014'},
            {total: '5', user_id: 6, billPaid: false, userPaid: true,
            name: 'Test Bill', interval: 0, first_name: 'Bob',
            id: 3, bill_id: 43, amount: '3', creatorId: 3, payTo: 'Jordan',
            createdate: '5/20/2014', duedate: '5/29/2014'}]);
        });

      var req = {query: {type: 'resolved'},
        user: {attributes: {apartment_id: 1}}};
      resMock.expects('json').once().withArgs(
        {bills: [{id: 43, name: 'Test Bill',  amount: '5',
          createDate: '5/20/2014', dueDate: '5/29/2014', frequency: 0,
          resolved: false, creatorId: 3, payTo: 'Jordan',
          payments: [{userId: 3, name: 'Jordan', amount: '2', paid: false},
                     {userId: 6, name: 'Bob', amount: '3', paid: true}]}]});

      bills.getBills(req, res);
      fetchBillsStub.restore();
    });

    it('should fail with 503 Database error', function () {
      var fetchBillsStub = failDoubleStub('fetchBills', null);
      var req1 = {query: {type: 'resolved'},
        user: {attributes: {apartment_id: 1}}};
      resMock.expects('json').once().withArgs(503, {error: 'Database error.'});
      bills.getBills(req1, res);
      expect(fetchBillsStub).to.have.been.calledWith(1, 'resolved');
      fetchBillsStub.restore();
    });

    it('should not merge bills with different ids together', function() {
      var fetchBillsStub =  sinon.stub(bills, 'fetchBills',
        function(apartmentId, resolved, thenFun) {
          thenFun([
            {total: '2', user_id: 3, billPaid: false, userPaid: false,
            name: 'Test Bill', interval: 0, first_name: 'Jordan',
            id: 3, bill_id: 43, amount: '2', creatorId: 3, payTo: 'Jordan',
            createdate: '5/20/2014', duedate: '5/29/2014'},
            {total: '3', user_id: 6, billPaid: false, userPaid: false,
            name: 'Test Bill2', interval: 0, first_name: 'Bob',
            id: 3, bill_id: 44, amount: '3', creatorId: 3, payTo: 'Jordan',
            createdate: '5/20/2014', duedate: '5/29/2014'}]);
        });

      var req = {query: {type: 'resolved'},
        user: {attributes: {apartment_id: 1}}};
      resMock.expects('json').once().withArgs(
        {bills: [{id: 43, name: 'Test Bill',  amount: '2',
          createDate: '5/20/2014', dueDate: '5/29/2014', frequency: 0,
          resolved: false, creatorId: 3, payTo: 'Jordan',
          payments: [{userId: 3, name: 'Jordan', amount: '2', paid: false}]},
          {id: 44, name: 'Test Bill2',  amount: '3',
          createDate: '5/20/2014', dueDate: '5/29/2014', frequency: 0,
          resolved: false, creatorId: 3, payTo: 'Jordan',
          payments: [{userId: 6, name: 'Bob', amount: '3', paid: false}]}]});

      bills.getBills(req, res);
      fetchBillsStub.restore();
    });

    it('should return 401 if user is undefined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401,
        {error: 'Unauthorized user.'});
      bills.getBills(req, res);
    });

    it('should return 400 if the type query is unexpected', function() {
      var req1 = {user: {attributes: {}}, query: {type: undefined}};
      var req2 = {user: {attributes: {}}, query: {type: 'hello'}};
      resMock.expects('json').twice().withArgs(400,
        {error: 'Unexpected type parameter.'});
      bills.getBills(req1, res);
      bills.getBills(req2, res);
    });

  });

  describe('addBill', function() {

    var billModel = {attributes: {
      apartment_id: 1,
      id: 3,
      name: 'Rent',
      interval: 0,
      duedate: '2020-05-08',
      paid: false
    }};

    it('should return 401 if user is undefined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401,
        {error: 'Unauthorized user.'});
      bills.addBill(req, res);
    });

    it('should return 400 if the bill name is invalid', function() {
      var req1 = {user: {attributes: {}}, body: {name: undefined}};
      var req2 = {user: {attributes: {}}, body: {name: null}};
      var req3 = {user: {attributes: {}}, body: {name: ''}};
      resMock.expects('json').thrice().withArgs(400,
        {error: 'Invalid bill name.'});
      bills.addBill(req1, res);
      bills.addBill(req2, res);
      bills.addBill(req3, res);
    });

    it('should return 400 if bill total is undefined or negative', function() {
      var req1 = {user: {attributes: {}}, body: {name: '1', total: undefined}};
      var req2 = {user: {attributes: {}}, body: {name: '1', total: -1}};
      resMock.expects('json').twice().withArgs(400,
        {error: 'Invalid bill total.'});
      bills.addBill(req1, res);
      bills.addBill(req2, res);
    });

    it('should return 400 if interval is undefined or negative', function() {
      var req1 = {user: {attributes: {}},
        body: {name: '1', total: 1, interval: undefined}};
      var req2 = {user: {attributes: {}},
        body: {name: '1', total: 1, interval: -1}};
      resMock.expects('json').twice().withArgs(400,
        {error: 'Invalid bill interval.'});
      bills.addBill(req1, res);
      bills.addBill(req2, res);
    });

    it('should return 400 if the duedate is undefined', function() {
      var req = {user: {attributes: {}},
        body: {name: '1', total: 1, interval: 1, date: undefined}};
      resMock.expects('json').once().withArgs(400,
        {error: 'Invalid due date.'});
      bills.addBill(req, res);
    });

    it('should return 400 if roommates is undefined', function() {
      var req = {user: {attributes: {}},
        body: {name: '1', total: 1, interval: 1,
        date: '2100-05-08', roommates: undefined}};
      resMock.expects('json').once().withArgs(400,
        {error: 'Invalid roommates.'});
      bills.addBill(req, res);
    });

    it('should return 400 if due date is before current date', function() {
      var req1 = {user: {attributes: {}},
        body: {name: 'test', interval: 0, total: 1,  date: '2014-05-08'}};
      var req2 = {user: {attributes: {}},
        body: {name: 'test', interval: 0, total: 1, date: '2013-05-08'}};
      var req3 = {user: {attributes: {}},
        body: {name: 'test', interval: 0, total: 1, date: '2013-06-08'}};
      resMock.expects('json').thrice().withArgs(400,
        {error: 'Invalid due date'});
      bills.addBill(req1, res);
      bills.addBill(req2, res);
      bills.addBill(req3, res);
    });

    it('should return 503 if creating bill causes database error', function() {
      var req1 = {user: {attributes: {apartment_id: 1}},
        body: {name: 'test', interval: 0, date: '2020-05-08', total: 1,
        roommates: [{id: 1, amount: 1}, {id: 2, amount: 1}]}};
      var saveBillStub = failingStub('saveBill', null);
      resMock.expects('json').once().withArgs(503,
        {error: 'Database error.'});
      bills.addBill(req1, res);
      expect(saveBillStub).to.have.been.calledOnce;
      saveBillStub.restore();
    });

    it('should return 503 if problem saving payments to the bill', function() {
      var req1 = {user: {attributes: {apartment_id: 1}},
        body: {name: 'test', interval: 0, date: '2020-05-08', total: 1,
        roommates: [{id: 1, amount: 1}, {id: 2, amount: 1}]}};
      var saveBillStub = succeedingStub('saveBill', billModel);
      var savePaymentsStub = failingStub('savePayments', null);
      resMock.expects('json').once().withArgs(503,
        {error: 'Database error.'});
      resMock.expects('json').once().withArgs({id: 3});
      bills.addBill(req1, res);
      expect(saveBillStub).to.have.been.calledWith();
      expect(savePaymentsStub).to.have.been.calledWith(3,
        [{id: 1, amount: 1}, {id: 2, amount: 1}]);

      savePaymentsStub.restore();
      saveBillStub.restore();
    });

    it('should update the history', function() {
      var req1 = {user: {attributes: {apartment_id: 1}},
          body: {name: 'test', interval: 0, date: '2020-05-08', total: 1,
            roommates: [{id: 1, amount: 1}, {id: 2, amount: 1}]}};
      var saveBillStub = succeedingStub('saveBill', billModel);
      var savePaymentsStub = emptyStub('savePayments');
      var saveHistoryStub = emptyStub('saveHistory');

      resMock.expects('json').once().withArgs({id: 3});

      bills.addBill(req1, res);
      expect(saveBillStub).to.have.been.calledWith();
      expect(saveHistoryStub).to.have.been.calledWith();

      saveBillStub.restore();
      savePaymentsStub.restore();
      saveHistoryStub.restore();
    });
  });

  describe('updatePayment', function() {

    it('should return 401 if user is undefined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401,
        {error: 'Unauthorized user.'});
      bills.updatePayment(req, res);
    });

    it('should return 400 if the bill ID is invalid', function() {
      var req1 = {user: {attributes: {}}, body: {}, params: {bill: 0.5}};
      var req2 = {user: {attributes: {}}, body: {}, params: {bill: 'hello'}};
      var req3 = {user: {attributes: {}}, body: {}, params: {bill: -1}};
      resMock.expects('json').thrice().withArgs(400,
        {error: 'Invalid bill ID.'});
      bills.updatePayment(req1, res);
      bills.updatePayment(req2, res);
      bills.updatePayment(req3, res);
    });

    it('should return 400 if paid is not a boolean string', function() {
      var req1 = {user: {attributes: {}},
        body: {paid: true}, params: {bill: 1}};
      var req2 = {user: {attributes: {}},
        body: {paid: false}, params: {bill: 1}};
      var req3 = {user: {attributes: {}},
        body: {paid: 'hello'}, params: {bill: 1}};
      resMock.expects('json').thrice().withArgs(400,
        {error: 'Invalid paid parameter.'});
      bills.updatePayment(req1, res);
      bills.updatePayment(req2, res);
      bills.updatePayment(req3, res);
    });

    it('should fetch and save payment', function() {
      var fetchPaymentStub = succeedDoubleStub('fetchPayment',
        {attributes: {bill_id: 1, user_id: 1, paid: false}});
      var savePaymentStub = succeedingStub('savePayment');
      var req1 = {user: {attributes: {apartment_id: 2, id: 1}},
        body: {paid: 'true'}, params: {bill: 1}};

      bills.updatePayment(req1, res);

      expect(fetchPaymentStub).to.have.been.calledWith(1, 1);
      expect(savePaymentStub).to.have.been.calledWith(
        {attributes: {bill_id: 1, user_id:1, paid: 'true'}});

      fetchPaymentStub.restore();
      savePaymentStub.restore();
    });

    it('should resolve a bill if needed', function() {
      var fetchPaymentStub = succeedDoubleStub('fetchPayment',
        {attributes: {bill_id: 1, user_id: 1, paid: false}});
      var savePaymentStub = succeedingStub('savePayment');
      var fetchPaymentsStub = succeedingStub('fetchPayments',
        {models: [{attributes: {paid: true}}, {attributes: {paid: true}}]});
      var fetchBillStub = succeedDoubleStub('fetchBill',
        {attributes: {paid: false}});
      var updatePaymentHistoryStub = emptyStub('updatePaymentHistory');
      var saveBillStub = emptyStub('saveBill');

      var req1 = {user: {attributes: {apartment_id: 2, id: 1}},
        body: {paid: 'true'}, params: {bill: 1}};
      bills.updatePayment(req1, res);

      expect(fetchPaymentsStub).to.have.been.calledWith(1);
      expect(fetchBillStub).to.have.been.calledWith(1, 2);
      expect(saveBillStub).to.have.been.calledWith({attributes: {paid: true}});

      fetchPaymentStub.restore();
      savePaymentStub.restore();
      fetchPaymentsStub.restore();
      fetchBillStub.restore();
      updatePaymentHistoryStub.restore();
      saveBillStub.restore();

    });

    it('should call createNewReocurring if bill becomes resolved', function() {
      var fetchPaymentStub = succeedDoubleStub('fetchPayment',
        {attributes: {bill_id: 1, user_id: 1, paid: false}});
      var savePaymentStub = succeedingStub('savePayment');
      var fetchPaymentsStub = succeedingStub('fetchPayments',
        {models: [{attributes: {paid: true}}, {attributes: {paid: true}}]});
      var fetchBillStub = succeedDoubleStub('fetchBill',
        {attributes: {paid: false}});
      var updatePaymentHistoryStub = emptyStub('updatePaymentHistory');
      var saveBillStub = emptyStub('saveBill');
      var fetchBillWithPaymentsStub = succeedDoubleStub('fetchBillWithPayments',
        {attributes: {name: 'Test', interval: 3}});
      var createNewReocurringStub = emptyStub('createNewReocurring');

      var req1 = {user: {attributes: {apartment_id: 2, id: 1}},
        body: {paid: 'true'}, params: {bill: 1}};

      bills.updatePayment(req1, res);

      expect(fetchPaymentsStub).to.have.been.calledWith(1);
      expect(fetchBillStub).to.have.been.calledWith(1, 2);
      expect(saveBillStub).to.have.been.calledWith({attributes: {paid: true}});
      expect(createNewReocurringStub).to.have.been.calledWith(
        {attributes: {name: 'Test', interval: 3}});

      fetchPaymentStub.restore();
      savePaymentStub.restore();
      fetchPaymentsStub.restore();
      fetchBillStub.restore();
      updatePaymentHistoryStub.restore();
      saveBillStub.restore();
      fetchBillWithPaymentsStub.restore();
      createNewReocurringStub.restore();
    });

    it('should update the history', function() {
      var fetchPaymentStub = succeedDoubleStub('fetchPayment',
        {attributes: {bill_id: 1, user_id: 1, paid: false}});
      var savePaymentStub = succeedingStub('savePayment');
      var updatePaymentHistoryStub = emptyStub('updatePaymentHistory');

      var req1 = {user: {attributes: {apartment_id: 2, id: 1}},
        body: {paid: 'true'}, params: {bill: 1}};

      bills.updatePayment(req1, res);

      expect(updatePaymentHistoryStub).to.have.been
        .calledWith(req1, 1, 2, 'true');
      fetchPaymentStub.restore();
      savePaymentStub.restore();
      updatePaymentHistoryStub.restore();

    });

    it('should unresolve a bill if needed', function() {
      var fetchPaymentStub = succeedDoubleStub('fetchPayment',
        {attributes: {bill_id: 1, user_id: 1, paid: false}});
      var savePaymentStub = succeedingStub('savePayment');
      var updatePaymentHistoryStub = emptyStub('updatePaymentHistory');
      var fetchPaymentsStub = succeedingStub('fetchPayments',
        {models: [{attributes: {paid: false}}, {attributes: {paid: false}}]});
      var fetchBillStub = succeedDoubleStub('fetchBill',
        {attributes: {paid: true}});
      var saveBillStub = emptyStub('saveBill');

      var req1 = {user: {attributes: {apartment_id: 2, id: 1}},
        body: {paid: 'true'}, params: {bill: 1}};

      bills.updatePayment(req1, res);

      expect(fetchBillStub).to.have.been.calledWith(1, 2);
      expect(saveBillStub).to.have.been.calledWith({attributes: {paid: false}});
      fetchPaymentStub.restore();
      savePaymentStub.restore();
      fetchPaymentsStub.restore();
      fetchBillStub.restore();
      updatePaymentHistoryStub.restore();
      saveBillStub.restore();
    });

    it('should return 503 if fails to fetch payment', function() {
      var fetchPaymentStub = failDoubleStub('fetchPayment');

      var req1 = {user: {attributes: {apartment_id: 2, id: 1}},
        body: {paid: 'true'}, params: {bill: 1}};

      resMock.expects('json').once().withArgs(503,
        {error: 'Database error.'});

      bills.updatePayment(req1, res);
      fetchPaymentStub.restore();
    });

  });

  describe('editBill', function() {

    it('should return 401 if user is undefined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401,
        {error: 'Unauthorized user.'});
      bills.editBill(req, res);
    });

    it('should return 400 if the bill ID is invalid', function() {
      var req1 = {user: {attributes: {}}, body: {}, params: {bill: 0.5}};
      var req2 = {user: {attributes: {}}, body: {}, params: {bill: 'hello'}};
      var req3 = {user: {attributes: {}}, body: {}, params: {bill: -1}};
      resMock.expects('json').thrice().withArgs(400,
        {error: 'Invalid bill ID.'});
      bills.editBill(req1, res);
      bills.editBill(req2, res);
      bills.editBill(req3, res);
    });

    it('should return 400 if the bill name is invalid', function() {
      var req1 = {user: {attributes: {}},
        body: {name: undefined}, params: {bill: 1}};
      var req2 = {user: {attributes: {}},
        body: {name: null}, params: {bill: 1}};
      var req3 = {user: {attributes: {}},
        body: {name: ''}, params: {bill: 1}};
      resMock.expects('json').thrice().withArgs(400,
        {error: 'Invalid bill name.'});
      bills.editBill(req1, res);
      bills.editBill(req2, res);
      bills.editBill(req3, res);
    });

    it('should destroy payments', function() {
      var req1 = {user: {attributes: {}},
        body: {name: 'Bill', total: 5, interval: 3, date: '2016-09-20'},
        params: {bill: 1}};
      var destroyPaymentsStub = emptyStub('destroyPayments');

      bills.editBill(req1, res);

      expect(destroyPaymentsStub).to.have.been.calledWith(1);
      destroyPaymentsStub.restore();
    });

    it('should fetch and update all fields of the bill', function() {
      var req1 = {user: {attributes: {apartment_id: 5}},
        body: {name: 'Bill', total: 5, interval: 3, date: '2016-09-20'},
        params: {bill: 1}};
      var destroyPaymentsStub = succeedingStub('destroyPayments');
      var fetchBillStub = succeedDoubleStub('fetchBill',
        {attributes: {name: 'Test', amount: 500, duedate: '2016-09-09',
          interval: 0}});
      var saveBillStub = emptyStub('saveBill');

      bills.editBill(req1, res);

      expect(destroyPaymentsStub).to.have.been.calledWith(1);
      expect(fetchBillStub).to.have.been.calledWith(1, 5);
      expect(saveBillStub).to.have.been.calledWith({attributes:
        {name: 'Bill', amount: 5, duedate: '2016-09-20', interval: 3}});

      destroyPaymentsStub.restore();
      fetchBillStub.restore();
      saveBillStub.restore();
    });

    it('should add the new payments back in', function() {
      var req1 = {user: {attributes: {apartment_id: 5}},
        body: {name: 'Bill', total: 5, interval: 3, date: '2016-09-20',
          roommates: [{id: 1, amount: 1}, {id: 2, amount: 1}]},
        params: {bill: 1}};
      var destroyPaymentsStub = succeedingStub('destroyPayments');
      var fetchBillStub = succeedDoubleStub('fetchBill',
        {attributes: {name: 'Test', amount: 500, duedate: '2016-09-09',
          interval: 0}});
      var saveBillStub = succeedingStub('saveBill');
      var savePaymentsStub = emptyStub('savePayments');

      bills.editBill(req1, res);

      expect(destroyPaymentsStub).to.have.been.calledWith();
      expect(fetchBillStub).to.have.been.calledWith();
      expect(saveBillStub).to.have.been.calledWith();
      expect(savePaymentsStub).to.have.been.calledWith(1,
         [{id: 1, amount: 1}, {id: 2, amount: 1}]);

      destroyPaymentsStub.restore();
      fetchBillStub.restore();
      saveBillStub.restore();
      savePaymentsStub.restore();
    });

   it('should return 400 if bill total is undefined or negative', function() {
      var req1 = {user: {attributes: {}}, body: {name: '1', total: undefined},
        params: {bill: 1}};
      var req2 = {user: {attributes: {}}, body: {name: '1', total: -1},
        params: {bill: 1}};
      resMock.expects('json').twice().withArgs(400,
        {error: 'Invalid bill total.'});
      bills.editBill(req1, res);
      bills.editBill(req2, res);
    });

    it('should return 400 if due date is before current date', function() {
      var req1 = {user: {attributes: {}},
        body: {name: 'test', interval: 0, date: '2014-05-08', total: 1},
        params: {bill: 1}};
      var req2 = {user: {attributes: {}},
        body: {name: 'test', interval: 0, date: '2013-05-08', total: 1},
        params: {bill: 1}};
	    var req3 = {user: {attributes: {}},
        body: {name: 'test', interval: 0, date: '2013-06-08', total: 1},
        params: {bill: 1}};

	    resMock.expects('json').thrice().withArgs(400,
        {error: 'Invalid due date'});
			bills.editBill(req1, res);
			bills.editBill(req2, res);
			bills.editBill(req3, res);
    });


    it('should return 503 if there is a database error', function() {
      var req1 = {user: {attributes: {}},
        body: {name: 'Bill', total: 5, interval: 3, date: '2016-09-20'},
        params: {bill: 1}};
      var destroyPaymentsStub = failingStub('destroyPayments');

      resMock.expects('json').once().withArgs(503,
        {error: 'Database error.'});
      bills.editBill(req1, res);

      expect(destroyPaymentsStub).to.have.been.calledWith(1);
      destroyPaymentsStub.restore();
    });

    it('should send 200 on success', function() {
     var req1 = {user: {attributes: {apartment_id: 5}},
        body: {name: 'Bill', total: 5, interval: 3, date: '2016-09-20',
          roommates: [{id: 1, amount: 1}, {id: 2, amount: 1}]},
        params: {bill: 1}};
      var destroyPaymentsStub = succeedingStub('destroyPayments');
      var fetchBillStub = succeedDoubleStub('fetchBill',
        {attributes: {name: 'Test', amount: 500, duedate: '2016-09-09',
          interval: 0}});
      var saveBillStub = succeedingStub('saveBill');
      var savePaymentsStub = emptyStub('savePayments');

      resMock.expects('send').once().withArgs(200);
      bills.editBill(req1, res);

      expect(destroyPaymentsStub).to.have.been.calledWith();
      expect(fetchBillStub).to.have.been.calledWith();
      expect(saveBillStub).to.have.been.calledWith();
      expect(savePaymentsStub).to.have.been.calledWith(1,
         [{id: 1, amount: 1}, {id: 2, amount: 1}]);

      destroyPaymentsStub.restore();
      fetchBillStub.restore();
      saveBillStub.restore();
      savePaymentsStub.restore();
    });

  });

  describe('deleteBill', function() {

    it('should return 401 if user is undefined', function() {
      var req = {};
      resMock.expects('json').once().withArgs(401,
        {error: 'Unauthorized user.'});
      bills.deleteBill(req, res);
    });

    it('should update the history', function() {
      var req = {user: {attributes: {first_name: 'Bob', last_name: 'Smith'}},
        body: {}, params: {bill: 1}};
      var fetchBillStub = succeedDoubleStub('fetchBill', {attributes:
        {name: 'Bill'}});
      var saveHistoryStub = emptyStub('saveHistory');
      var destroyPaymentsStub = failingStub('destroyPayments');

      bills.deleteBill(req, res);

      expect(saveHistoryStub).to.have.been.calledWith();

      fetchBillStub.restore();
      saveHistoryStub.restore();
      destroyPaymentsStub.restore();
    });

    it('should destroy payments', function() {
      var req1 = {user: {attributes: {}},
        body: {name: 'Bill', total: 5, interval: 3, date: '2016-09-20'},
        params: {bill: 1}};
      var destroyPaymentsStub = emptyStub('destroyPayments');

      bills.editBill(req1, res);

      expect(destroyPaymentsStub).to.have.been.calledWith(1);
      destroyPaymentsStub.restore();
    });

    it('should delete the bill and return 200 on success', function() {
      var req = {user: {attributes: {first_name: 'Bob', last_name: 'Smith',
          apartment_id: 6}},
        body: {}, params: {bill: 1}};
      var fetchBillStub = succeedDoubleStub('fetchBill', {attributes:
        {name: 'Bill'}});
      var saveHistoryStub = emptyStub('saveHistory');
      var destroyPaymentsStub = succeedingStub('destroyPayments');
      var destroyBillStub = succeedDoubleStub('destroyBill');

      resMock.expects('send').once().withArgs(200);

      bills.deleteBill(req, res);

      expect(saveHistoryStub).to.have.been.calledWith();
      expect(destroyBillStub).to.have.been.calledWith(1, 6);

      fetchBillStub.restore();
      saveHistoryStub.restore();
      destroyPaymentsStub.restore();
      destroyBillStub.restore();
    });

    it('should return 503 if there is an error fetching bill', function() {
      var req = {user: {attributes: {first_name: 'Bob', last_name: 'Smith',
          apartment_id: 6}},
        body: {}, params: {bill: 1}};
      var fetchBillStub = failDoubleStub('fetchBill');

      resMock.expects('json').once().withArgs(503,
        {error: 'Database error.'});

      bills.deleteBill(req, res);

      fetchBillStub.restore();
    });

    it('should return 503 if error destroying payments', function() {
      var req = {user: {attributes: {first_name: 'Bob', last_name: 'Smith',
          apartment_id: 6}},
        body: {}, params: {bill: 1}};
      var fetchBillStub = succeedDoubleStub('fetchBill', {attributes:
        {name: 'Bill'}});
      var saveHistoryStub = emptyStub('saveHistory');
      var destroyPaymentsStub = failingStub('destroyPayments');

      resMock.expects('json').once().withArgs(503,
        {error: 'Database error.'});

      bills.deleteBill(req, res);

      fetchBillStub.restore();
      saveHistoryStub.restore();
      destroyPaymentsStub.restore();
    });

    it('should return 503 if there is an error destroying bil', function() {
      var req = {user: {attributes: {first_name: 'Bob', last_name: 'Smith',
          apartment_id: 6}},
        body: {}, params: {bill: 1}};
      var fetchBillStub = succeedDoubleStub('fetchBill', {attributes:
        {name: 'Bill'}});
      var saveHistoryStub = emptyStub('saveHistory');
      var destroyPaymentsStub = succeedingStub('destroyPayments');
      var destroyBillStub = failDoubleStub('destroyBill');

      resMock.expects('json').once().withArgs(503,
        {error: 'Database error.'});

      bills.deleteBill(req, res);

      fetchBillStub.restore();
      saveHistoryStub.restore();
      destroyPaymentsStub.restore();
      destroyBillStub.restore();
    });

    it('should return 400 if the bill ID is invalid', function() {
      var req1 = {user: {attributes: {}}, body: {}, params: {bill: 0.5}};
      var req2 = {user: {attributes: {}}, body: {}, params: {bill: 'hello'}};
      var req3 = {user: {attributes: {}}, body: {}, params: {bill: -1}};
      resMock.expects('json').thrice().withArgs(400,
        {error: 'Invalid bill ID.'});
      bills.deleteBill(req1, res);
      bills.deleteBill(req2, res);
      bills.deleteBill(req3, res);
    });

  });

});
