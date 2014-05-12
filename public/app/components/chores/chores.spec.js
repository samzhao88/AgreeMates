
'use strict';

var expect = chai.expect;

describe('chores module', function() {
  var choresModule;
  beforeEach(function() {
    choresModule = module('main.chores');
  });

  it('should be registered', function() {
    expect(choresModule).not.to.equal(null);
  });

  describe('ChoresCtrl', function() {
    var ctrl, scope, httpMock;

    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
      httpMock = $httpBackend;

      scope = $rootScope.$new();
      httpMock.when('GET', '/chores').respond({title: 'chores title'});

      ctrl = $controller;
      ctrl('ChoresCtrl', {
        $scope: scope
      });
    }));

    it('should exist', function() {
      expect(ctrl).not.to.equal(null);
    });

    it('gets the title from the api and assigns it to scope', function() {
      httpMock.expectGET('/chores');
      httpMock.flush();
      expect(scope.title).to.equal('chores title');
    });
  });
});
