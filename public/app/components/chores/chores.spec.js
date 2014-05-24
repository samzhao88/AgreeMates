
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

  //fake chores
  var chores = [ {
    completed: true,
    createdate: "2014-05-23T18:16:23.236Z",
    duedate: "2014-07-19T07:00:00.000Z",
    id: 65,
    interval: 7,
    name: "Garbage",
    number_in_rotation: 1,
    rotating: true,
    users: [{
      first_name: "alice",
      last_name: "dole",
      order_index: 1,
      user_id: 6
    }]
  }, {
    completed: false,
    createdate: "2014-05-23T22:55:08.125Z",
    duedate: "2014-05-31T07:00:00.000Z",
    id: 71,
    interval: 7,
    name: "dishes",
    number_in_rotation: 2,
    rotating: false
  } ];

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
      //httpMock.expectGET('/chores');
      //httpMock.flush();
      //expect(scope.title).to.equal('chores title');
    });
  });
});
