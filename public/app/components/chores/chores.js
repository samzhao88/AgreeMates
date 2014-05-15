'use strict';

angular.module('main.chores', []);

// Angular controller for chores
angular.module('main.chores').controller('ChoresCtrl',

function ($scope, $http) {
  	//holds all chores for apartment
    $scope.chores = [];

    $scope.chore = {name: ''};

    //get chores
    $http.get('/chores').
    	success(function(data) {
        	$scope.chores = data.chores;
        	//console.log(data);
        	//console.log("hello");
			//for( var i = 0; i < $scope.chores.length; i++ )
      		//{
      		//	$scope.chores[i].isSelected = false;
      			//console.log($scope.chores[i].name);
      		//}

      	}).
      	error(function(data, status, headers, config){
        	//console.log(data);
    });



  	//global variable to hold users in apartment
  	$scope.users = [];

	$http.get('/user/:user').
      	success(function(data) { 

      	//get users in apartment
      	$scope.users = data;

      	//dummy users
      	$scope.users = [ {name: "alice", isChecked: false, id: 12} , {name: "bob", isChecked: false, id: 12} 
      	, {name: "cameron", isChecked: false}];

      	// console.log($scope.users[0].name);
    });	



  	//adding a chore
  	$scope.addChore = function() {
  	
   	var chore = angular.copy($scope.chore);

    chore.roommates = [3,4];
    chore.interval = 7;
    chore.duedate = "11/12/2000";
    chore.name = "hello";
    //chore.roomates[0].name = "name";
    console.log(chore);

      	$http.post('/chores/', chore)
        .success(function(data) {

          if(data.result=="success"){
            console.log("success");
          }
          else
          {
          	console.log("error");
          	console.log(chore);
          	console.log(chore.name);
          	console.log(chore.interval);
          	console.log(chore.user_id);
          	console.log(chore.duedate);
          }
        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
      	});
      	$scope.cancel;
    };

    //edit chore
    $scope.editChore = function(index) {
    	console.log($scope.chore);
    	console.log($scope.chore.users);
    	//$scope.chore.users = [].concat($scope.chore.users);
    	//$scope.chore.users = $scope.chore.users.map(function(any){return {name: any, isChecked: true }});


      for( var i = 0; i < $scope.chores.length; i++ )
      {
      if (!$scope.chore.users[i].isChecked)
      {
          $scope.chore.users[i].splice(index, 1);
      }
      //console.log($scope.chores[i].name);
      }


    	console.log($scope.chore.users);	

      	console.log($scope.chore);

      	$http.put('/supplies/'+$scope.chore[index], $scope.chore).
  	    success(function(data) {
  	    //console.log("hello");    //do nothing because radio has already changed
  	    }).
        error(function(data, status, headers, config){
        console.log(data);
        console.log($scope.chore);
        });
    	$scope.cancel;
    };

    //deletes chore
    $scope.deleteChore = function(index)
    {
    	$scope.chores.splice(index, 1);
    	$http.delete('/chores/').
  	    success(function(data) {
  	    $scope.chores.splice(index, 1);
  	    }).
        error(function(data, status, headers, config){
        console.log(data);
        });
    }

    $scope.cancel = function() {
    	console.log($scope.chore.name);
    	$scope.chore.name = '';
    	console.log("reset");
    };

    //sets the edit chore menu to the selected chore
    $scope.setChore = function(index){
    var chore = angular.copy($scope.chores[index]);
    chore.users = [].concat(chore.users);
    chore.users = chore.users.map(function(any){return {name: any, isChecked: true }});
    //$scope.chore.users = [].concat($scope.chore.users);
    //$scope.chore.users = $scope.chore.users.map(function(any){return {name: any, isChecked: true }});
    console.log(chore);
    $scope.chore = chore;
    
    console.log($scope.chore);
    };

});