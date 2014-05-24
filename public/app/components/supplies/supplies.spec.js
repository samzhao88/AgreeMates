'use strict';

var expect = chai.expect;

describe('supplies module:', function() {
  var suppliesModule;
  beforeEach(function() {
    suppliesModule = module('main.supplies');
  });


  it('should be registered', function() {
    expect(suppliesModule).not.to.equal(null);
  });

  var supplies = {supplies: [
    {
      'id': 1, 
      'name': 'toilet paper', 
      'status': 1
    },
    {
      'id': 2, 
      'name': 'oranges', 
      'status': 0
    }
  ]};

  var supply = {
    'name': 'new chore',
    'status': 0
  };
  var supplyEditResponse = {}
  var supplyAddResponse = {
    'id': 3,
    'name': 'new chore',
    'status': 0
  };
  var supplyDeleteResponse = {
    'id': 2,
    'name': 'orange',
    'status': 0
  };
  describe('method', function() {
      var httpMock, scope, ctrl;
	    beforeEach(inject(function($controller, $rootScope, $httpBackend)  {
			httpMock = $httpBackend;

			  scope = $rootScope.$new();

			  ctrl = $controller;
			  ctrl('SuppliesCtrl', {
				$scope: scope
		  });
			httpMock.whenGET('/supplies').respond(function(method, url, data, headers) {
				return [200,supplies];
			});
			httpMock.whenPOST('/supplies', supply).respond(function(method, url, data, headers) {
				return [200,supplyAddResponse];
			});
			httpMock.whenPUT('/supplies/1', supplies.supplies[0]).respond(function(method, url, data, headers) {
				return [200,supplyEditResponse];
			});
			httpMock.whenDELETE('/supplies/1').respond(function(method, url, data, headers) {
				return [200,supplyDeleteResponse];
			});
		}));
	   
		afterEach(function() {
			httpMock.verifyNoOutstandingExpectation();
			httpMock.verifyNoOutstandingRequest();
        });
		
	    describe('get', function() { 
		  it('should fetch all supplies',function() {
			httpMock.expectGET('/supplies').respond(supplies);
			httpMock.flush();
			expect(scope.supplies.length).to.equal(2);
		  });
		});
	  
        describe('add', function() {
			beforeEach(function() {
				httpMock.expectPOST('/supplies',supply).respond(supplyAddResponse);
				scope.supply = supply; 
				scope.supplies = supplies;
				scope.addSupply();
				httpMock.flush();
				
			});
			it('should display success',function() {
				expect(scope.success).to.equal(true);
				
			});
			
			it('should display success message',function() {
				expect(scope.successmsg).to.equal('Supply "new chore" successfully added!');
			});
			
			it('should hava scope which include all chores',function() {
				expect(scope.supplies.length).to.equal(3);
			});
			
			it('should have correct status',function() {
				expect(scope.supplies[0].status).to.equal(0);
			});
			
			it('should have correct id',function() {
				expect(scope.supplies[0].id).to.equal(3);
			});
			
			it('should have correct name',function() {
				expect(scope.supplies[0].name).to.equal('new chore');
			});
	    });
	
		describe('update', function() {
			beforeEach(function() {
				httpMock.expectPUT('/supplies/1',supplies.supplies[0]).respond(supplyEditResponse);
				scope.supplies = supplies.supplies;
				scope.updateSupply(0);
				httpMock.flush();
				
			});
			it('should no longer be editing',function() {
				expect(scope.supplies[0].edit).to.equal(false);
			});
			
			it('should display success message',function() {
				expect(scope.successmsg).to.equal('Supply "toilet paper" successfully edited!');
			});
			
			it('should hava scope which include all chores',function() {
				expect(scope.supplies.length).to.equal(2);
			});
			
			it('should have correct status',function() {
				expect(scope.supplies[0].status).to.equal(1);
			});
			
			it('should have correct id',function() {
				expect(scope.supplies[0].id).to.equal(1);
			});
			
			it('should have correct name',function() {
				expect(scope.supplies[0].name).to.equal('toilet paper');
			});
		});
		
		describe('delete', function() {
			beforeEach(function() {
				httpMock.expectDELETE('/supplies/1').respond(supplyDeleteResponse);
				scope.supplies = supplies.supplies;
				scope.deleteSupply(0);
				httpMock.flush();
			});
			
			it('should display success message',function() {
				expect(scope.successmsg).to.equal('Supply "toilet paper" successfully deleted!');
			});
			
			it('should hava scope which include all chores',function() {
				expect(scope.supplies.length).to.equal(1);
			});
			
			it('should have correct status',function() {
				expect(scope.supplies[0].status).to.equal(0);
			});
			
			it('should have correct id',function() {
				expect(scope.supplies[0].id).to.equal(2);
			});
			
			it('should have correct name',function() {
				expect(scope.supplies[0].name).to.equal('oranges');
			});
		});
	});
});
