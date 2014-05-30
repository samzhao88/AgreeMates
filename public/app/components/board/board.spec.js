'use strict';

var expect = chai.expect;

describe('board module', function () {
    var boardModule;
    beforeEach(function () {
        boardModule = module('main.board');
    });

    it('should be registered', function () {
        expect(boardModule).not.to.equal(null);
    });


    var messages = {
        'messages': [{
            'id': 2,
            'subject': 'Subject1',
            'body': 'Body1',
            'date': '2014-05-24T00:20:42.949Z',
            'user_id': 1,
            'author': 'alice',
            'comments': [{
                'id': 1,
                'body': 'CommentBody1',
                'date': '2014-05-24T00:20:46.580Z',
                'user_id': 1,
                'author': 'Lukas'
            }, {
                'id': 2,
                'body': 'CommentBody2',
                'date': '2014-05-24T00:20:48.580Z',
                'user_id': 1,
                'author': 'Lukas'
            }, ]
        }, {
            'id': 1,
            'subject': 'Subject2',
            'body': 'Body2',
            'date': '2014-05-23T00:20:42.949Z',
            'user_id': 1,
            'author': 'Lukas',
            'comments': [{
                'id': 4,
                'body': 'CommentBody1',
                'date': '2014-05-24T00:20:46.580Z',
                'user_id': 1,
                'author': 'Lukas'
            }, {
                'id': 5,
                'body': 'CommentBody2',
                'date': '2014-05-24T00:20:48.580Z',
                'user_id': 1,
                'author': 'Lukas'
            }]
        }]
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
        'body': 'comment body',
        'messageId': 1
    };

    var newCommentRes = {
        'id': 3,
        'subject': 'body',
        'messageId': 1
    };

    //edited message
    var editMessage = {
        'subject': 'Subject1',
        'body': 'edited body',
        'id': 1

    };

    //fake user
    var user = {
        'id': 6,
        'first_name': "alice",
        'last_name': "dole"
    };

    describe('BoardCtrl', function () {
        var httpMock, scope, ctrl;

        beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
            httpMock = $httpBackend;

            scope = $rootScope.$new();

            ctrl = $controller;

            ctrl('BoardCtrl', {
                $scope: scope
            });

            httpMock.whenGET('/messages').respond(function (method, url, data, headers) {
                return [200, messages];
            });

            httpMock.whenGET('/user').respond(function (method, url, data, headers) {
                return [200, user];
            });

            httpMock.whenPOST('/messages', message).respond(function (method, url, data, headers) {
                return [200, newMessageRes];
            });

            httpMock.whenDELETE('/messages/1').respond(function (method, url, data, headers) {
                return [200];
            });

            httpMock.whenPUT('/messages/2', editMessage).respond(function (method, url, data, headers) {
                return [200];
            });

            httpMock.whenPOST('/messages/1/comments', comment).respond(function (method, url, data, headers) {
                return [200, newCommentRes];
            });

            httpMock.whenDELETE('/messages/1/comments/4').respond(function (method, url, data, headers) {
                return [200];
            });

        }));

        afterEach(function () {
            httpMock.verifyNoOutstandingExpectation();
            httpMock.verifyNoOutstandingRequest();
        });

        describe('onload', function () {
            beforeEach(function () {
                httpMock.expectGET('/messages').respond(messages);
                httpMock.expectGET('/user').respond(user);
                httpMock.flush();
            });

            describe('get messages', function () {
                it('should fetch all messages and comments', function () {
                    expect(scope.messages.length).to.equal(2);
                    expect(scope.messages[0].comments.length).to.equal(2);
                });
            });

            describe('get user', function () {
                it('should have correct id', function () {
                    expect(scope.user.id).to.equal(6);
                });
                it('should have correct first name', function () {
                    expect(scope.user.first_name).to.equal('alice');
                });
                it('should have correct last name', function () {
                    expect(scope.user.last_name).to.equal('dole');
                });
            });

            describe('post message', function () {

                beforeEach(function () {
                    httpMock.expectPOST('/messages', message).respond(newMessageRes);
                    scope.newMessage = message;
                    scope.addMessage();
                    httpMock.flush();
                });

                it('should be added to the scope', function () {
                    expect(scope.messages.length).to.equal(3);
                    expect(scope.messages[0].body).to.equal('new body');
                    expect(scope.messages[0].author).to.equal(user.first_name);
                });

                it('should not have any comments yet', function() {
                  expect(scope.messages[0].comments.length).to.equal(0);
                });
            });

            describe('update message', function () {

                it('should update first message', function () {
                    httpMock.expectPUT('/messages/2', editMessage).respond(200);
                    scope.messages[0] = editMessage;
                    scope.updateMessage(2,0);
                    httpMock.flush();
                    expect(scope.messages[0].body).to.equal('edited body');
                });

                it('should only be updateable is users match', function(){
                    expect(scope.messages[0].author).to.equal(user.first_name);
                });
            });

            describe('delete message', function () {

                it('should delete the message with id 2', function () {
                    httpMock.expectDELETE('/messages/2').respond(200);
                    scope.deleteMessage(2,0);
                    httpMock.flush();
                    expect(scope.messages.length).to.equal(1);
                });

            });

            describe('post comment', function () {

                it('should post a new comment to message id: 1', function () {
                    httpMock.expectPOST('/messages/1/comments', comment).respond(newCommentRes);
                    scope.messages[1].newComment = comment;
                    scope.addComment(1);
                    httpMock.flush();
                    expect(scope.messages[1].comments.length).to.equal(3);
                });

                it('should be the correct content in the comment', function(){
                    expect(scope.messages[1].comments[2].body).to.equal(comment.body);
                })

            });

            describe('delete comment', function () {

                it('should delete the comment with id 4', function () {
                    httpMock.expectDELETE('/messages/1/comments/4').respond(200);
                    scope.deleteComment(4,1,0,1);
                    httpMock.flush();
                    expect(scope.messages[1].comments.length).to.equal(1);
                });

            });
        });
    });
});