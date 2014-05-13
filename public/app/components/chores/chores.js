'use strict';

angular.module('main.chores', []);

// Angular controller for chores
angular.module('main.chores').controller('ChoresCtrl',
  function ($scope, $http) {
  	//holds all chores for apartment
    $scope.chores = [];

    $scope.chore = {name: ''};
    //get chores
    // $http.get('/chores/').
    // 	success(function(data) {
    //     	$scope.title = data.title;
    //   	});

    $http.get('/chores').
    	success(function(data) {
        	$scope.chores = data.chores;
        	//console.log(data);
        	//console.log("hello");
			for( var i = 0; i < $scope.chores.length; i++ )
      		{
      			$scope.chores[i].isSelected = false;
      			//console.log($scope.chores[i].name);
      		}

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
  	$scope.addChore = function() {
  		//chore.user_id = [];
 	var chore = angular.copy($scope.chore);
  		//add responsible persons
  // 		angular.forEach($scope.users, function(s){
		// 	if (s.isChecked){chore.user_id.push(s.user_id)
		// 		console.log(chore);
		// 	}
		// });
  		//chore.interval = 10; 

  		//console.log(chore);

  		chore.createdate = "10-2-14";
  		chore.userid = 5;

  // 		var myDate= chore.duedate;
		// myDate=myDate.split("-");
		// var newDate=myDate[1]+"/"+myDate[0]+"/"+myDate[2];
		// chore.duedate = new Date(newDate).getTime();

		// console.log(chore.duedate);

      	$http.post('/chores', chore)
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
    	var chore = $scope.chores[index];
    	$scope.chore = angular.copy(chore);
    	console.log($scope.chore);
    	console.log($scope.chore.users);
    	$scope.chore.users = [].concat($scope.chore.users);
    	$scope.chore.users = $scope.chore.users.map(function(any){return {name: any, isChecked: true }});


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

});
