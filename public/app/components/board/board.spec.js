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

  var messages = {messages: [
    {
      'id': 1,
      'subject': 'Subject1',
      'body': 'Body1',
      'date': '2014-05-24T00:20:42.949Z',
      'user_id': 1,
      'author': 'Lukas',
      'comments': [
        {
          'id': 1,
          'body': 'CommentBody1',
          'date': '2014-05-24T00:20:46.580Z',
          'user_id': 1,
          'author': 'Lukas'
        },
        {
          'id': 2,
          'body': 'CommentBody2',
          'date': '2014-05-24T00:20:48.580Z',
          'user_id': 1,
          'author': 'Lukas'
        },
        ]
    },
    {
      'id': 2,
      'subject': 'Subject2',
      'body': 'Body2',
      'date': '2014-05-23T00:20:42.949Z',
      'user_id': 1,
      'author': 'Lukas',
      'comments': [
        {
          'id': 1,
          'body': 'CommentBody1',
          'date': '2014-05-24T00:20:46.580Z',
          'user_id': 1,
          'author': 'Lukas'
        },
        {
          'id': 2,
          'body': 'CommentBody2',
          'date': '2014-05-24T00:20:48.580Z',
          'user_id': 1,
          'author': 'Lukas'
        },
      ]
    };

    var message = {
      'subject': 'New subject',
      'body': 'new body'
    };

    var comment = {
      'subject': 'body',
      'msg_id': 1
    };

    /*
    var editMessage = {
      'subject': 'Subject1',
      'body': 'edited body',
      'id': 1,

    }
    */


    ]};

  describe('method', function() {
    var ctrl, scope, httpMock;

    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
      httpMock = $httpBackend;

      scope = $rootScope.$new();

      ctrl = $controller;
      ctrl('BoardCtrl', {
        $scope: scope
      });

      httpMock.when('GET', '/messages').respond(function(method, url, data, headers) {
        return [200,messages];
      });

    }));

    afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
    }); 

    describe('get', function() {
      it('should fetch all messages and comments',function() {
        httpMock.expectGET('/messages').respond(messages);
        httpMock.flush();
        expect(scope.messages.length).to.equal(2);
      });
    });

  });
});
