'use strict';

var expect = chai.expect;

describe('supplies module', function() {

  var $httpMock, $scope, $controller;

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

  var supplyEdit = {
    'id': 3,
    'name': 'new chore just got renamed',
    'status': 0
  };

  var supplyAddResponse = {
    'id': 3,
    'name': 'new chore',
    'status': 0
  };

  var supplyEditResponse = {
    'status': 200
  };

  var supplyDeleteResponse = {
    'status': 200
  };

  beforeEach(inject(function($injector) {
    $httpMock = $injector.get('$httpBackend');
    $scope = $injector.get('$rootScope');
    var $controllerTemp = $injector.get('$controller');
    $controller = $controllerTemp('SuppliesCtrl', {'$scope': $scope});

    $httpMock.whenGET('/supplies').respond(supplies);
    $httpMock.whenPOST('/supplies', supply).respond(supplyAddResponse);
  }));

  //check controller available
  it('controller should exist', function() {
    expect($controller).not.to.equal(null);
  });

  it('should fail', function() {
    expect(false).to.equal(true);
  });

  it('should fetch all supplies',function() {
    $httpMock.expectGET('/supplies').respond(supplies);
    $httpMock.flush();

    expect($scope.supplies.length).to.equal(2);
  });

  it('should post and add a supply',function() {
    $httpMock.expectPOST('/supplies',supply).respond(supplyAddResponse);
    $httpMock.flush();

    expect($scope.supplies.length).to.equal(3);
  });

  it('should update a supply',function() {
    $httpMock.expectPUT('/supplies/3',supplyEdit).respond(supplyEditResponse);
    $httpMock.flush();
  });

  it('should delete a supply',function() {
    $httpMock.expectDELETE('/supplies/3').respond(supplyDeleteResponse);
    $httpMock.flush();

  });

});
