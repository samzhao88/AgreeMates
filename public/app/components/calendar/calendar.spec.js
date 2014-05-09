'use strict';

var expect = chai.expect;

describe('calendar module', function() {
  var calendarModule;
  beforeEach(function() {
    calendarModule = module('main.calendar');
  });

  it('should be registered', function() {
    expect(calendarModule).not.to.equal(null);
  });

  describe('CalendarCtrl', function() {
    var ctrl, scope, httpMock;

    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
      httpMock = $httpBackend;

      scope = $rootScope.$new();
      httpMock.when('GET', '/calendar/show').respond({title: 'calendar title'});

      ctrl = $controller;
      ctrl('CalendarCtrl', {
        $scope: scope
      });
    }));

    it('should exist', function() {
      expect(ctrl).not.to.equal(null);
    });

    it('gets the title from the api and assigns it to scope', function() {
      httpMock.expectGET('/calendar/show');
      httpMock.flush();
      expect(scope.title).to.equal('calendar title');
    });
  });
});
