'use strict';

var expect = chai.expect;

describe('supplies module', function() {
  var suppliesModule;
  beforeEach(function() {
    suppliesModule = module('main.supplies');
  });

  it('should be registered', function() {
    expect(suppliesModule).not.to.equal(null);
  });

  describe('SuppliesCtrl', function() {
    var ctrl, scope, httpMock;

    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
      httpMock = $httpBackend;

      scope = $rootScope.$new();
      httpMock.when('GET', '/supplies').respond({supplies: [{'id': 1, 'name': 'toilet paper', 'status': 1},{'id': 2, 'name': 'oranges', 'status': 0}]});

      ctrl = $controller;
      ctrl('SuppliesCtrl', {
        $scope: scope
      });
    }));

    it('should exist', function() {
      expect(ctrl).not.to.equal(null);
    });

    it('gets the title from the api and assigns it to scope', function() {
      httpMock.expectGET('/supplies');
      httpMock.flush();
      expect(scope.title).to.equal('supplies title');
    });
  });
});
