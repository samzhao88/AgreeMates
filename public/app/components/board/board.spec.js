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
      'id': 2,
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
      'id': 1,
      'subject': 'Subject2',
      'body': 'Body2',
      'date': '2014-05-23T00:20:42.949Z',
      'user_id': 1,
      'author': 'Lukas',
      'comments': [
        {
          'id': 4,
          'body': 'CommentBody1',
          'date': '2014-05-24T00:20:46.580Z',
          'user_id': 1,
          'author': 'Lukas'
        },
        {
          'id': 5,
          'body': 'CommentBody2',
          'date': '2014-05-24T00:20:48.580Z',
          'user_id': 1,
          'author': 'Lukas'
        }
        ]
    }
    ]
    };

    var message = {
      'subject': 'New subject',
      'body': 'new body'
    };

    var newMessageRes = {
      'id': 3,
      'subject': 'New subject',
      'body': 'new body'
    };

    var comment = {
      'subject': 'body',
      'msg_id': 1
    };

    var newCommentRes = {
      'id': 3,
      'subject': 'body',
      'msg_id': 1
    };

    //edited message
    var editMessage = {
      'subject': 'Subject1',
      'body': 'edited body',
      'id': 1,

    };

    //fake user
    var user = {
      'id': 6, 
      'first_name': "alice", 
      'last_name': "dole"
    };

  describe('BoardCtrl', function() {
    var ctrl, scope, httpMock;

    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
      httpMock = $httpBackend;

      scope = $rootScope.$new();

      ctrl = $controller;

      ctrl('BoardCtrl', {
        $scope: scope
      });

      httpMock.whenGET('/messages').respond(function(method, url, data, headers) {
        return [200,messages];
      });

      httpMock.whenGET('/user').respond(function(method, url, data, headers) {
        return [200,user];
      });

      httpMock.whenPOST('/messages', message).respond(function(method, url, data, headers) {
        return [200,newMessageRes];
      });

      httpMock.whenDELETE('/messages/1').respond(function(method, url, data, headers) {
        return [200];
      });

      httpMock.whenPUT('/messages/1', editMessage).respond(function(method, url, data, headers) {
        return [200];
      });

      httpMock.whenPOST('/messages/1/comments', comment).respond(function(method, url, data, headers) {
        return [200,newCommentRes];
      });

      httpMock.whenDELETE('/messages/1/comments/1').respond(function(method, url, data, headers) {
        return [200];
      });

    }));

    afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
    }); 

    describe('onload', function() {
      beforeEach(function() {
          httpMock.expectGET('/user').respond(user);
          httpMock.expectGET('/messages').respond(messages);
          httpMock.flush();   
        });

      describe('get messages', function() {
        it('should fetch all messages and comments',function() {
          expect(scope.messages.length).to.equal(2);
          expect(scope.messages[0].comments.length).to.equal(2);
        });
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

      describe('post message', function() {
        it('should post a new message',function() {
          httpMock.expectPOST('/messages', message).respond(newMessageRes);
          httpMock.flush();
          expect($scope.messages.length).to.be(3);
          expect($scope.messages[1].body).to.equal('new body');
        });
      });

      describe('update message', function() {
        it('should update a message',function() {
         
        });
      });

      describe('delete message', function() {
        it('should delete the message with id 1',function() {
          httpMock.expectDELETE('/messages/1').respond(200);
          expect($scope.messages[0].id).to.equal(2);
        });
      });

      describe('post comment', function() {
        it('should post a new comment',function() {
          //httpMock.expectPOST('/messages/:message/comments', comment).respond(newCommentRes);
        });
      });

      describe('delete comment', function() {
        it('should delete the comment with id 1',function() {
          //httpMock.expectDELETE('/messages', message).respond(200);
        });
      });

    });
  });
});
