'use strict';

angular.module('main.chores', []);

// Angular controller for chores
angular.module('main.chores').controller('ChoresCtrl',

function ($scope, $http) {
  	//holds all chores for apartment
    //$scope.chores = [];
    //global variable for the current index of edit
    $scope.gindex = 0;

    $scope.chore = {name: ''};
    $scope.choresDummy = [{name: "hello", users: ["bob", "alice"], interval: 7, duedate: "5/20/2014"}];
    $scope.weekly = [];

    //get chores
    $http.get('/chores').
    	success(function(data) {
            
            var tempchores = data.chores;

            for( var i = 0; i < tempchores.length; i++ )
            {
                var x = tempchores[i].duedate.split("T");
                tempchores[i].duedate = x[0];
                if (tempchores[i].interval == 0)
                {
                    tempchores[i].interval = "One-Time";
                }
                else
                {
                    tempchores[i].interval = "Weekly";
                }
            }
            //console.log($scope.chores);
        	$scope.chores = tempchores;
            console.log($scope.chores);
            //$scope.chores = $scope.choresDummy;
      	}).
      	error(function(data, status, headers, config){

    });



  	//global variable to hold users in apartment
  	$scope.users = [];

	$http.get('/user/:user').
      	success(function(data) { 


      	//get users in apartment
      	$scope.users = data;

      	//dummy users
      	$scope.users = [ {name: "alice", id: 12} , {name: "bob", id: 13} 
      	, {name: "cameron", id: 14}];

        for( var i = 0; i < $scope.users.length; i++ )
        {
            $scope.users[i].isChecked = false;
        }

      	// console.log($scope.users[0].name);
    });	



  	//adding a chore
  	$scope.addChore = function() {
  	
   	var chore = angular.copy($scope.chore);
    chore.roommates = [ ];
    chore.interval = parseInt(chore.interval);
    console.log(chore);

    var any = {name: '', id: 0};
    var at_least_one_user = 0;

    for(var x = 0; x < $scope.users.length; x++)
    {
        if($scope.users[x].isChecked)
        {
            at_least_one_user = at_least_one_user + 1;
        }
    }

    if(at_least_one_user == 0)
    {

    }
    else
    {
        for( var i = 0; i < $scope.users.length; i++ )
            {
            console.log($scope.users[i].isChecked);
            if($scope.users[i].isChecked)
            { 
            console.log($scope.users[i].name);
            //console.log($scope.users[i].id);

            any.name = $scope.users[i].name;
            any.id = $scope.users[i].id;
            chore.roommates.push(any);
            }
            }
         //chore.roomates[0].name = "name";
        console.log(chore);

      	$http.post('/chores', chore)
        .success(function(data) {
            console.log("hi");
           // console.log(data);
            //var mockdata = {};
            //mockdata.name = "hello";
            //mockdata.users = ["hello", "hello"];
            //mockdata.duedate = "5-21-2014";
            //mockdata.interval = 0;
            console.log(chore.interval);
            $scope.chores.push(chore);
            //$scope.chores.push(mockdata);
            //console.log(data);
        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
      	});

      	$scope.cancel;
    }  

    };

    //edit chore
    $scope.editChore = function(index) {
    	//console.log($scope.chore);
    	//console.log($scope.chore.users);
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


    	//console.log($scope.chore.users);	

      	console.log($scope.chore);
        console.log($scope.gindex);

      	$http.put('/chores/'+$scope.chore.id, $scope.chore).
  	    success(function(data) {

        $scope.chores[$scope.gindex] = $scope.chore;
  	    console.log($scope.chores[$scope.gindex]);

  	    }).
        error(function(data, status, headers, config){
        console.log(data);
        console.log($scope.chore);
        $scope.chores[$scope.gindex] = angular.copy($scope.chore);
        //$scope.$apply();
        console.log($scope.gindex);
        console.log($scope.chores[$scope.gindex]);
        });
    	$scope.cancel;
    };

    //deletes chore
    $scope.deleteChore = function(id, index)
    {
    	//$scope.chores.splice(index, 1);
    	$http.delete('/chores/'+id).
  	    success(function(data) {
  	    $scope.chores.splice(index, 1);
  	    }).
        error(function(data, status, headers, config){
        console.log(data);
        });
    }

    $scope.cancel = function() {
    	//console.log($scope.chore.name);
    	$scope.chore.name = '';
        $scope.chore.duedate = null;
    	console.log("reset");
    };

    //sets the edit chore menu to the selected chore, maps all responsible as well
    $scope.setChore = function(index){
    $scope.gindex = index;
    var chore = angular.copy($scope.chores[index]);
    chore.users = [].concat(chore.users);
    chore.users = chore.users.map(function(any){return {name: any, isChecked: true }});
    //$scope.chore.users = [].concat($scope.chore.users);
    //$scope.chore.users = $scope.chore.users.map(function(any){return {name: any, isChecked: true }});
    console.log(chore);
    if(chore.interval == "One-Time")
    {
        chore.interval = 0;
    }
    else
    {
        chore.interval = 7;
    }
    $scope.chore = chore;
    
    console.log($scope.chore);
    };

});
