// Front end message board controller

'use strict';

angular.module('main.board', []);

angular.module('main.board').controller('BoardCtrl',
  function ($scope, $http, $timeout) {

    $scope.newMessage = {subject: '', body: ''};
    $scope.oldMessageBody = '';
    $scope.loaded = false;

    // Get all messages
    $http.get('/messages')
      .success(function(data) {
      	$scope.messages = data.messages;
        $scope.loaded = true;
    	});

    // Get this user
    $http.get('/user')
      .success(function(user){
         $scope.user = user;
      });

    // Add a message
    $scope.addMessage = function(){
    	var message = angular.copy($scope.newMessage);

    	$http.post('/messages', message)
	      .success(function(data) {
          data.comments = [];
          data.author = $scope.user.first_name;
	        $scope.messages.splice(0, 0, data);
	        $scope.reset();
	      })
        .error(function(data) {
          $scope.errormsg = data.error;
          $scope.error = true;
          $timeout(function() {
            $scope.error = false;
          }, 4000);
        });
    };

    // Delete a message
    $scope.deleteMessage = function(messageId, messageIndex) {
    	$http.delete('/messages/' + messageId)
	      .success(function() {
	        $scope.messages.splice(messageIndex, 1);
	      })
        .error(function(data) {
          $scope.errormsg = data.error;
          $scope.error = true;
          $timeout(function() {
            $scope.error = false;
          }, 4000);
        });
    };

    // Update a message
    $scope.updateMessage = function(messageId, messageIndex) {
    	$http.put('/messages/' + messageId, $scope.messages[messageIndex])
	      .success(function() {
	        $scope.messages[messageIndex].edit = false;
	       })
        .error(function(data) {
          $scope.errormsg = data.error;
          $scope.error = true;
          $timeout(function() {
            $scope.error = false;
          }, 4000);
        });
    };

    // Cancel a message update
    $scope.cancelUpdateMessage = function(messageIndex) {
      $scope.messages[messageIndex].body = $scope.oldMessageBody;
      $scope.messages[messageIndex].edit = false;
    };

    // Set old message body in case update is cancelled
    $scope.setOldMessageBody = function(messageIndex) {
      $scope.oldMessageBody = $scope.messages[messageIndex].body;
      $scope.messages[messageIndex].edit = true;
    };

    // Add a comment
    $scope.addComment = function(messageIndex) {
    	var comment = angular.copy($scope.messages[messageIndex].newComment);
    	comment.messageId = $scope.messages[messageIndex].id;

    	$http.post('/messages/' + comment.messageId + '/comments', comment)
	      .success(function(data) {
          data.author = $scope.user.first_name;
	        $scope.messages[messageIndex].comments.push(data);
          $scope.messages[messageIndex].newComment = {};
          $scope.messages[messageIndex].showComments = true;
	      })
        .error(function(data) {
          $scope.errormsg = data.error;
          $scope.error = true;
          $timeout(function() {
            $scope.error = false;
          }, 4000);
        });
    };

    // Delete a comment
    $scope.deleteComment = function(commentId, messageId,
      commentIndex, messageIndex) {

      $http.delete('messages/' + messageId + '/comments/' + commentId)
        .success(function() {
	        $scope.messages[messageIndex].comments.splice(commentIndex, 1);
	      })
        .error(function(data) {
          $scope.errormsg = data.error;
        });
    };

    // Reset the new message form
    $scope.reset = function() {
    	$scope.newMessage = {};
    };

    // Formats a date in 'time ago' format
    $scope.formatDate = function(date) {
      return moment(date).fromNow();
    };

});
