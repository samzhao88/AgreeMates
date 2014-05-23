'use strict';

var expect = chai.expect;

describe('bills module', function() {
  var users = {users: [
    {
      'id': 69, 
      'first_name': 'Sue', 
      'last_name': 'PerHot'
    },
	{
      'id': 88, 
      'first_name': 'Michael', 
      'last_name': 'Irvin'
    },
	{
      'id': 1, 
      'first_name': 'George', 
      'last_name': 'Washington'
    }]};
  
  var unresolvedBills = {bills: [
	{
		'id': 0,
		'payments': [
					{
						'id': 69,
						'paid' : true
					},
					{
						'id': 88,
						'paid' : false
					}]
	},
	{
		'id': 1,
		'payments': [
					{
						'id': 1,
						'paid' : false
					},
					{
						'id': 88,
						'paid' : false
					}]
	}]};
	
	 var resolvedBills = {bills: [
	{
		'id': 2,
		'payments': [
					{
						'id': 69,
						'paid' : true
					},
					{
						'id': 88,
						'paid' : true
					}]
	},
	{
		'id': 3,
		'payments': [
					{
						'id': 1,
						'paid' : true
					},
					{
						'id': 88,
						'paid' : true
					}]
	}]};
	
  var user = {
      'id': 69, 
      'first_name': 'Sue', 
      'last_name': 'PerHot'
    };
  
  var billsModule;
  beforeEach(function() {
    billsModule = module('main.bills');
  });

  it('should be registered', function() {
    expect(billsModule).not.to.equal(null);
  });

  describe('method', function() {
    var ctrl, scope, httpMock;

    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
      httpMock = $httpBackend;

      scope = $rootScope.$new();

      ctrl = $controller;
      ctrl('BillsCtrl', {
        $scope: scope
      });
	  httpMock.whenGET('/user').respond(function(method, url, data, headers) {
			return [200,user];
	  });
	  httpMock.whenGET('/apartment/users').respond(function(method, url, data, headers) {
			return [200,users];
	  });
	  httpMock.whenGET('/bills?type=unresolved').respond(resolvedBills);
	  httpMock.whenGET('/bills?type=resolved').respond(unresolvedBills);
    }));

    afterEach(function() {
			httpMock.verifyNoOutstandingExpectation();
			httpMock.verifyNoOutstandingRequest();
    });	
	   
	describe('onload', function() {
		beforeEach(function() {
				httpMock.expectGET('/user').respond(user);
				httpMock.expectGET('/apartment/users').respond(users);
				httpMock.expectGET('/bills?type=unresolved').respond(unresolvedBills);
				httpMock.expectGET('/bills?type=resolved').respond(resolvedBills);
				httpMock.flush();		
			});
			
		describe('get user', function() {		
			it('should have correct id', function() {
				expect(scope.userId).to.equal(69);
			});
			it('should have correct first name', function() {
				expect(scope.userFirstName).to.equal('Sue');
			});
			it('should have correct last name', function() {
				expect(scope.userLastName).to.equal('PerHot');
			});
		});
		
		describe('get users',function() {
			it('should have logged in roomy', function() {
				expect(scope.roommates[0].id).to.equal(user.id);
				expect(scope.roommates[0].first_name).to.equal(user.first_name);
				expect(scope.roommates[0].last_name).to.equal(user.last_name);
			});
			it('should have correct length', function() {
				expect(scope.roommates.length).to.equal(3);
			});
		});
	
		describe('get resolved bills', function() {
			it('should have resolved set', function() {
			  expect(scope.resolvedBills.length).to.equal(resolvedBills.bills.length);
			  expect(scope.resolvedBills[0].id).to.equal(resolvedBills.bills[0].id);
			  expect(scope.resolvedBills[1].id).to.equal(resolvedBills.bills[1].id);
			});
			
			it('should checkboxes set', function() {
			  expect(scope.checkboxes.length).to.equal(5);
			});
		});
		
		describe('get unresolved bills', function() {
			it('should have unresolved set', function() {
			  expect(scope.unresolvedBills.length).to.equal(unresolvedBills.bills.length);
			  expect(scope.unresolvedBills[0].id).to.equal(unresolvedBills.bills[0].id);
			  expect(scope.unresolvedBills[1].id).to.equal(unresolvedBills.bills[1].id);
			});
			
			it('should have bills set', function() {
			  expect(scope.bills.length).to.equal(unresolvedBills.bills.length);
			  expect(scope.bills[0].id).to.equal(unresolvedBills.bills[0].id);
			  expect(scope.bills[1].id).to.equal(unresolvedBills.bills[1].id);
			});
		});
	
		describe('update balances', function() {
			it('should get all the bills', function() {
			  
			});
		});
	
		describe('select resolved', function() {
			it('should get all the bills', function() {
			  
			});
		});
		
		describe('select unrsolved', function() {
			it('should get all the bills', function() {
			  
			});
		});
		
		describe('add bill', function() {
			it('should get all the bills', function() {
			  
			});
		});
		
		describe('delete bill', function() {
			it('should get all the bills', function() {
			  
			});
		});
		
		describe('update bill', function() {
			it('should get all the bills', function() {
			  
			});
		});
		
		describe('pay bill', function() {
			it('should get all the bills', function() {
			  
			});
		});
		
		describe('is paid', function() {
			it('should get all the bills', function() {
			  
			});
		});
		
		describe('is responsible', function() {
			it('should get all the bills', function() {
			  
			});
		});
		
		describe('split bill', function() {
			it('should get all the bills', function() {
			  
			});
		});
	});
  });
});
