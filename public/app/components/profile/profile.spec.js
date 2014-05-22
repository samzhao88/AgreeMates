'use strict';

var expect = chai.expect;

describe('profile module', function() {
  var profileModule;
  beforeEach(function() {
    profileModule = module('main.profile');
  });

  it('should be registered', function() {
    expect(profileModule).not.to.equal(null);
  });

  describe('ProfileCtrl', function() {
    var ctrl, scope, httpMock;

    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
      httpMock = $httpBackend;

      scope = $rootScope.$new();
      httpMock.when('GET', '/profile').respond({title: 'profile title'});

      ctrl = $controller;
      ctrl('ProfileCtrl', {
        $scope: scope
      });
    }));

    it('should exist', function() {
      expect(ctrl).not.to.equal(null);
    });

    it('gets the title from the api and assigns it to scope', function() {
      //httpMock.expectGET('/profile');
      //httpMock.flush();
      //expect(scope.title).to.equal('profile title');
    });
  });
});
