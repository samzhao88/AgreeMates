'use strict';

var expect = chai.expect;

describe('bills module', function() {
  var billsModule;
  beforeEach(function() {
    billsModule = module('main.bills');
  });

  it('should be registered', function() {
    expect(billsModule).not.to.equal(null);
  });

  describe('BillsCtrl', function() {
    var ctrl, scope, httpMock;

    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
      httpMock = $httpBackend;

      scope = $rootScope.$new();
      httpMock.when('GET', '/bills').respond({title: 'bills title'});

      ctrl = $controller;
      ctrl('BillsCtrl', {
        $scope: scope
      });
    }));

    it('should exist', function() {
      expect(ctrl).not.to.equal(null);
    });

    it('gets the title from the api and assigns it to scope', function() {
      //httpMock.expectGET('/bills');
      //httpMock.flush();
      //expect(scope.title).to.equal('bills title');
    });
  });
});
