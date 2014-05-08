'use strict';

var expect = chai.expect;

describe('settings module', function() {
  var settingsModule;
  beforeEach(function() {
    settingsModule = module('main.settings');
  });

  it('should be registered', function() {
    expect(settingsModule).not.to.equal(null);
  });

  describe('SettingsCtrl', function() {
    var ctrl, scope, httpMock;

    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
      httpMock = $httpBackend;

      scope = $rootScope.$new();
      httpMock.when('GET', '/settings').respond({title: 'settings title'});

      ctrl = $controller;
      ctrl('SettingsCtrl', {
        $scope: scope
      });
    }));

    it('should exist', function() {
      expect(ctrl).not.to.equal(null);
    });

    it('gets the title from the api and assigns it to scope', function() {
      httpMock.expectGET('/settings');
      httpMock.flush();
      expect(scope.title).to.equal('settings title');
    });
  });
});
