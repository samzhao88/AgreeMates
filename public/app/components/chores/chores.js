'use strict';

angular.module('main.chores', []);

// Angular controller for chores
angular.module('main.chores').controller('ChoresCtrl',
  function ($scope, $http) {
  	//global variable to hold users in apartment
  	$scope.users = [];

	$http.get('/user/:user').
      	success(function(data) { 

      	//get users in apartment
      	$scope.users = data;

      	//dummy users
      	$scope.users = [ {name: "alice", isChecked: false } , {name: "bob", isChecked: false} 
      	, {name: "cameron", isChecked: false}];

        console.log("grabbing users");
        console.log($scope.users);
    });	

  	//adding a chore
  	$scope.add = function(chore) {
  		chore.responsible = [];

  		//add responsible persons
  		angular.forEach($scope.users, function(s){
			if (s.isChecked){chore.responsible.push(s.name)
			}
		});
  		//chore.interval = 10; 
  		//console.log(chores);

  		console.log(chore)

      	$http.post('/chores', chore)
        .success(function(data) {


          if(data.result=="success"){
            console.log("success");
          }
          else
          {
          	console.log("error");
          	console.log(chore.name);
          	console.log(chore.interval);
          	console.log(chore.responsible);
          }
        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
      });
    };

    $scope.cancel = function() {
    	console.log("cancel arggg");
    };



    $http.get('/chores').
      success(function(data) {
        $scope.title = data.title;
      });

    //grabbing all users in apartment


});
