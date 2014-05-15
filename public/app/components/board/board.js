'use strict';

angular.module('main.board', []);

// Angular controller for message board
angular.module('main.board').controller('BoardCtrl',
  function ($scope, $http, $timeout) {

    $scope.newMessage = {};

  	var dummy = {"messages": [
  		{"id": 1, "subject": "subject1", "body": "body1", "author": "user1", "comments": [{"body": "comment1"},{"body": "comment1"}]}, 
  		{"id": 2, "subject": "subject1", "body": "body1", "author": "user2", "comments": []}, 
  	]};

    //$http.get('/board/0/10').
      $http.get('/').
      	success(function(data) {
        	$scope.messages = data.messages;
        	$scope.messages = dummy.messages;
      	});

    //add a message
    $scope.addMessage = function(){
    	
    	var message = angular.copy($scope.newMessage);

    	//$http.post('/messages', message).
      $http.get('/').
	      	success(function(data) {
            data = message;
            data.comments = [];
	        	$scope.messages.splice(0,0,data);
	        	$scope.reset();
	      	}).
        	error(function(data, status, headers, config){
          		console.log(data);
          		$scope.errormsg = data.error;
          		$scope.error = true;
          		$timeout(function(){$scope.error=false;},1000);
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
          		$scope.error = true;
          		$timeout(function(){$scope.error=false;},1000);
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

    //get previous comments: TODO
    $scope.getPrevious = function(){

    };

    //add a comment: TODO
    $scope.addComment = function(msg_ind, msg_id){

    	var comment = angular.copy($scope.messages[msg_ind].newComment);
    	comment.msg_id = $scope.messages[msg_ind].id;

    	//$http.post('/comment/', comment).
      $http.get('/').
	      	success(function(data) {
            data = comment;
	        	$scope.messages[msg_ind].comments.push(data);
            $scope.messages[msg_ind].newComment = {};
	      	}).
        	error(function(data, status, headers, config){
          		console.log(data);
          		$scope.errormsg = data.error;
        	});
    };

    //delete a comment: TODO
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

    $scope.postButton = function(){
      return 1;//return (($scope.newMessage.subject  == '') || ($scope.newMessage.body == '')) ? true : false;
    };

});
