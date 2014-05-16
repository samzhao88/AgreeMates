'use strict';

angular.module('main.chores', ['ui.bootstrap']);

// Angular controller for chores
angular.module('main.chores').controller('ChoresCtrl',

function ($scope, $http, $timeout) {
    var alertLength = 4000;
  	//holds all chores for apartment
    //$scope.chores = [];

    //global variable for the current index of edit
    $scope.gindex = 0;

    $scope.chore = {name: ''};
    
    $scope.weekly = [];

    //get chores
    $http.get('/chores').
    	success(function(data) {
            console.log(data);

        	$scope.chores = data.chores;
            
      	}).
      	error(function(data, status, headers, config){

    });



  	//global variable to hold users in apartment
  	$scope.users = [];

	$http.get('/apartment/users').
      	success(function(data) { 
      	//get users in apartment
        console.log(data);
      	$scope.users = data.users;

      	// console.log($scope.users[0].name);
    }).error(function(data, status, headers, config){
        $scope.users = [ {name: "alice", id: 12} , {name: "bob", id: 13} 
        , {name: "cameron", id: 14}];
    }
    );	



  	//adding a chore
  	$scope.addChore = function() {
  	

    //uncheck all users

   	var chore = angular.copy($scope.chore);
    chore.roommates = [ ];
    chore.interval = parseInt(chore.interval);


    var any = {name: '', id: 0};
    var at_least_one_user = 0;

    //checks to see that at lesat one user is checked
    for(var x = 0; x < $scope.users.length; x++)
    {
        console.log($scope.users[x].isChecked);
        if($scope.users[x].isChecked)
        {

            at_least_one_user = at_least_one_user + 1;
        }
    }

    //check for date
    if(!chore.duedate)
    {
    }
    else
    {
    if(at_least_one_user == 0)
    {
        //some error here
    }
    else
    {
        for( var i = 0; i < $scope.users.length; i++ )
        {

            if($scope.users[i].isChecked)
            { 
            any.id = $scope.users[i].id;
            chore.roommates.push(any.id);
            }
        }

        console.log(chore);

      	$http.post('/chores', chore)
        .success(function(data) {


            chore = data.chore;
            chore.users = [];
            chore.users = data.users;

            for( var i = 0; i < chore.users.length; i++ )
            {
                chore.users[i].isChecked = true;
            }

            $scope.chores.push(chore);
            
            
            console.log($scope.chores);
            showSucc("Chore "+chore.name+" successfully added!");


        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
      	});
        }
        //resets the add chore modal to defaults
      	$scope.cancel;
    }  

    };

    //edits chore in db then updates the view
    $scope.editChore = function(index) {
    	
      	console.log($scope.chore);
        console.log($scope.gindex);
        
        $scope.chore.roommates = [];

        //console.log("hello");
        //console.log($scope.users);
        //console.log($scope.chore.users);
        var temp = [];
        
            //populate roommates field and remove unchecked users from view
            for( var i = 0; i < $scope.users.length; i++ )
            {
                //console.log($scope.users[i].isChecked);

                if($scope.users[i].isChecked)
                {
                    $scope.chore.roommates.push($scope.users[i].id);
                }
                else
                {
                    $scope.chore.users = $scope.chore.users.filter(function(user){
                        return !($scope.users[i].id == user.user_id);
                    });
                }
            }

            //check if checked user is in view, if not add checked user
            for( var i = 0; i < $scope.users.length; i++ )
            {
                console.log($scope.users[i].isChecked);
                if($scope.users[i].isChecked)
                    {
                        temp.push(angular.copy($scope.users[i]));
                    }
            }

            //console.log($scope.chore.users);
            $scope.chore.users = temp;
            //console.log($scope.chore.roommates);

            //console.log("hello");
            //console.log($scope.chore);
            $http.put('/chores/'+$scope.chore.id, $scope.chore).
            success(function(data) {
            console.log("OMFG");
            console.log(data);

                $scope.chores[$scope.gindex] = $scope.chore;
                //console.log($scope.chores[$scope.gindex]);
            }).
            error(function(data, status, headers, config){
            console.log(data);
            console.log($scope.chore);
            });

            $scope.cancel;
    };

    //deletes chore from the database then deletes chore from view
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

    //resets the add chore modal to defaults
    $scope.cancel = function() {
    	$scope.chore.name = '';
        $scope.chore.duedate = null;
    	console.log("reset");
        for( var i = 0; i < $scope.users.length; i++ )
        {
        $scope.users[i].isChecked = false;
        }
    };

    


    //sets the edit chore menu to the selected chore, maps all responsible as well
    $scope.setChore = function(index){
    $scope.gindex = index;
    var chore = angular.copy($scope.chores[index]);
    //console.log(chore);
    //console.log($scope.users);
    chore.duedate = $scope.convertdate(chore.duedate);

    //set everything to false
    for( var i = 0; i < $scope.users.length; i++ )
    {
        $scope.users[i].isChecked = false;
    }

    var temp2 = {};
    
    for( var i = 0; i < chore.users.length; i++ )
    {
        temp2 = $scope.users.filter(function(user){
            console.log(user.id);
            console.log(chore.users);
            console.log(chore.users[i].user_id);
            return user.id == chore.users[i].user_id;
        });
        temp2.map(function(user){user.isChecked = true;});
    }

    chore.users.map(function(user){user.isChecked = false});

    $scope.chore = chore;
    
    console.log($scope.chore);
    //console.log($scope.chore);
    };

    function showSucc(msg){
        console.log($timeout);
        console.log(msg);
        $scope.successmsg = msg;
        $scope.success = true;
        $timeout(function(){$scope.success=false;},alertLength);
    }

    $scope.convertdate = function(date){
        var x = date.split("T");
        return x[0];
    };

    $scope.convertfrequency = function(freq){
        if (freq == 0)
        {
            return "One-Time";
        }
        else
        {
            return "Weekly";
        }


    };

});
