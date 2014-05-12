'use strict';

angular.module('main.chores', []);

// Angular controller for chores
angular.module('main.chores').controller('ChoresCtrl',
  function ($scope, $http) {
  	//holds all chores for apartment
    $scope.chores = [];


    //get chores
    // $http.get('/chores/').
    // 	success(function(data) {
    //     	$scope.title = data.title;
    //   	});

    $http.get('/chores').
    	success(function(data) {
        	$scope.chores = data.chores;
        	console.log(data);
        	console.log("hello");
			for( var i = 0; i < $scope.chores.length; i++ )
      		{
      			$scope.chores[i].isSelected = false;
      			console.log($scope.chores[i].name);
      		}

      	}).
      	error(function(data, status, headers, config){
        	console.log(data);

    });



  	//global variable to hold users in apartment
  	$scope.users = [];

	$http.get('/user/:user').
      	success(function(data) { 

      	//get users in apartment
      	$scope.users = data;

      	//dummy users
      	$scope.users = [ {name: "alice", isChecked: true } , {name: "bob", isChecked: false} 
      	, {name: "cameron", isChecked: false}];

      	// console.log($scope.users[0].name);
      	// for( var i = 0; i < $scope.users.length; i++ )
      	// {
      	// 	console.log($scope.users[i].name);
      	// 	$scope.users.newproperty = "hello";
      	// }	

      	// console.log($scope.users.newproperty);
      	// for(var i in $scope.users)
      	// {
      	// 	i.isChecked = true;
      	// 	console.log("test");
      	// 	console.log(i.name);
      	// }

        //console.log("grabbing users");
        //console.log($scope.users);
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

  		//console.log(chore);

      	$http.post('/chores', chore)
        .success(function(data) {


          if(data.result=="success"){
            console.log("success");
          }
          else
          {
          	console.log("error");
          	console.log(chore)
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


});
