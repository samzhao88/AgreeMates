'use strict';

var expect = chai.expect;

describe('board module', function() {
  var boardModule;
  beforeEach(function() {
    boardModule = module('main.board');
  });

  it('should be registered', function() {
    expect(boardModule).not.to.equal(null);
  });

  describe('BoardCtrl', function() {
    var ctrl, scope, httpMock;

    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
      httpMock = $httpBackend;

      scope = $rootScope.$new();
      httpMock.when('GET', '/messages').respond({title: 'board title'});

      ctrl = $controller;
      ctrl('BoardCtrl', {
        $scope: scope
      });
    }));

    it('should exist', function() {
      expect(ctrl).not.to.equal(null);
    });

    it('gets the title from the api and assigns it to scope', function() {
      //httpMock.expectGET('/messages');
      //httpMock.flush();
      //expect(scope.title).to.equal('board title');
    });
  });
});
