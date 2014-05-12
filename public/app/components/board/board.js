'use strict';

angular.module('main.board', []);

// Angular controller for message board
angular.module('main.board').controller('BoardCtrl',
  function ($scope, $http) {

  	var dummy = {"messages": [
  		{"subject": "subject1", "body": "body1", "author": "user1", "comments": [{"body": "comment1"},{"body": "comment1"}]}, 
  		{"subject": "subject1", "body": "body1", "author": "user2"}, 
  	]};

    $http.get('/messages').
      	success(function(data) {
        	$scope.messages = data.messages;
        	$scope.messages = dummy.messages;
      	});

    $scope.addMessage = function(){

    };

    $scope.deleteMessage = function(id, index){

    };

    $scope.updateMessage = function(id, index){

    };

    $scope.getPrevious = function(){

    };

    $scope.addComment = function(msg_ind){

    	var comment = angular.copy($scope.messages[msg_ind].newComment);

    	$http.post('/comment/', comment).
	      	success(function(data) {
	        	$scope.messages[msg_ind].push(data);
	      	}).
        	error(function(data, status, headers, config){
          		console.log(data);
          		$scope.errormsg = data.error;
        	});
    };

    $scope.deleteComment = function(id, index){

    	$http.delete('/comment/'+id).
	      	success(function(data) {
	        	$scope.messages[msg_ind].comments.splice(index, 1);
	      	}).
        	error(function(data, status, headers, config){
          		console.log(data);
          		$scope.errormsg = data.error;
        	});
    };

});
