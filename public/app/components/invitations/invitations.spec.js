'use strict';

var expect = chai.expect;

describe('invitations module', function() {
  var invitationsModule;
  beforeEach(function() {
    invitationsModule = module('main.invitations');
  });

  it('should be registered', function() {
    expect(invitationsModule).not.to.equal(null);
  });

  describe('InviteIndexCtrl', function() {
    var ctrl, scope, httpMock;

    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
      httpMock = $httpBackend;

      scope = $rootScope.$new();
      httpMock.when('DEL', '/invitations/:invite').respond();

      ctrl = $controller;
      ctrl('InviteIndexCtrl', {
        $scope: scope
      });
    }));

    it('should exist', function() {
      expect(ctrl).not.to.equal(null);
    });
  });
});

