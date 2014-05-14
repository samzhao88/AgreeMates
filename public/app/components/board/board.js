'use strict';

angular.module('main.board', []);

// Angular controller for message board
angular.module('main.board').controller('BoardCtrl',
  function ($scope, $http) {

  	var dummy = {"messages": [
  		{"id": 1, "subject": "subject1", "body": "body1", "author": "user1", "comments": [{"body": "comment1"},{"body": "comment1"}]}, 
  		{"id": 2, "subject": "subject1", "body": "body1", "author": "user2"}, 
  	]};

    //$http.get('/board/0/10').
      $http.get('/').
      	success(function(data) {
        	$scope.messages = data.messages;
        	$scope.messages = dummy.messages;
      	});

    $scope.addMessage = function(){
    	
    	var message = angular.copy($scope.newMessage);

    	$http.post('/', message).
	      	success(function(data) {
	        	$scope.messages.push(data);
	        	$scope.reset();
	      	}).
        	error(function(data, status, headers, config){
          		console.log(data);
          		$scope.errormsg = data.error;
        	});
    };

    $scope.deleteMessage = function(id, index){

    	$http.delete('/message/'+id).
	      	success(function(data) {
	        	$scope.splice(index, 1);
	      	}).
        	error(function(data, status, headers, config){
          		console.log(data);
          		$scope.errormsg = data.error;
        	});

    };

    $scope.updateMessage = function(id, index){

    	$http.put('/message/'+id, $scope.messages[index]).
	      	success(function(data) {
	        	//update msg
	      	}).
        	error(function(data, status, headers, config){
          		console.log(data);
          		$scope.errormsg = data.error;
        	});

    };

    $scope.getPrevious = function(){

    };

    $scope.addComment = function(msg_ind, msg_id){

    	var comment = angular.copy($scope.messages[msg_ind].newComment);
    	comment.msg_id = $scope.messages[msg_ind].id;

    	console.log(comment);

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

    $scope.reset = function(){
    	$scope.newMessage = {};
    };

});
