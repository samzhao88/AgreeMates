
'use strict';

var expect = chai.expect;

describe('chores module', function() {
  //fake users
    var users = {users: [
    {
      'id': 6, 
      'first_name': 'alice', 
      'last_name': 'dole'
    },
    {
      'id': 3, 
      'first_name': 'Dennis', 
      'last_name': 'Ding'
    },
    {
      'id': 5,
      'first_name': 'bob',
      'last_name': 'dole'
    }
    ]};

    //fake user
    var user = {
      'id': 6, 
      'first_name': "alice", 
      'last_name': "dole"
    };

  //fake chores
  var chores = { chores: [ 
    {
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
    rotating: false,
    users: [{
      first_name: "Dennis",
      last_name: "Ding",
      order_index: 1,
      user_id: 3
    },{
      first_name: "bob",
      last_name: "dole",
      order_index: 0,
      user_id: 5
    }]
  } ] , users: '' };

  var new_chore = {
      apartment_id: 2,
      duedate: "2014-05-24",
      interval: 0,
      name: "vacuum",
      number_in_rotation: 1,
      roommates: [3],
      rotating: false,
      userId: 3
  };

  var editChoreResponse = {};

  var addChoreResponse = {chore: {
    apartment_id: 2,
    completed: false,
    createdate: "2014-05-23T23:39:01.878Z",
    duedate: "2014-05-24T07:00:00.000Z",
    id: 80,
    interval: 0,
    name: "dishes",
    number_in_rotation: 1,
    reocurring_id: 0,
    rotating: false,
    user_id: 3
  }, users: [{
      first_name: "Dennis",
      last_name: "Ding",
      order_index: 0,
      user_id: 3
  }] };

  var apartment = {
      id: 2,
      name: 'home',
      address: '123 lane st'
  };

  var deleteChoreResponse = {};

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

      ctrl = $controller;

      ctrl('ChoresCtrl', {
        $scope: scope
      });

      httpMock.whenGET('/chores').respond(function(method, url, data, headers) {
        return [200, chores];
      });

      httpMock.whenGET('/user').respond(function(method, url, data, headers) {
      return [200,user];
      });

      httpMock.whenGET('/apartment').respond(function(method, url, data, headers) {
      return [200,apartment];
      });

      httpMock.whenGET('/apartment/users').respond(function(method, url, data, headers) {
      return [200,users];
      });

      httpMock.whenPOST('/chores', new_chore).respond(function(method, url, data, headers) {
        return [200, addChoreResponse];
      });

      httpMock.whenPUT('/chores/:chore', chores[0]).respond(function(method, url, data, headers) {
        return [200, editChoreResponse];
      });
      httpMock.whenDELETE('/chores/:chore', 0).respond(function(method, url, data, headers) {
        return [200, deleteChoreResponse];
      });

    }));

    afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
        });

    describe('onload', function() {
    beforeEach(function() {
        httpMock.expectGET('/user').respond(user);
        httpMock.expectGET('/chores').respond(chores);
        httpMock.expectGET('/apartment/users').respond(users);
        httpMock.expectGET('/apartment').respond(apartment);
        httpMock.flush();   
      });

    describe('get user', function() {   
      it('should have correct id', function() {
        expect(scope.userId).to.equal(6);
      });
      it('should have correct first name', function() {
        expect(scope.userFirstName).to.equal('alice');
      });
      it('should have correct last name', function() {
        expect(scope.userLastName).to.equal('dole');
      });
    });


    // describe('get', function() { 
    //   it('should fetch all chores',function() {
    //   httpMock.expectGET('/chores').respond(chores);
    //   httpMock.flush();
    //   expect(scope.chores.length).to.equal(2);
    //   });
    // });

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
});
