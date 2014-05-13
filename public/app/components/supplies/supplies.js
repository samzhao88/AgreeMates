'use strict';

angular.module('main.supplies', ['ui.bootstrap']);

// Angular controller for supplies
angular.module('main.supplies').controller('SuppliesCtrl',
  function ($scope, $http, $timeout) {

  	$scope.hideAddBox = true;

    $scope.supply = {name: ''};

  	//get apll supplies
    $http.get('/supplies/').
      success(function(data) {
        $scope.supplies = data.supplies;
      }).
      error(function(data, status, headers, config){
        console.log(data);
      });

    $scope.showAdd = function(){
    	$scope.hideAddBox = $scope.hideAddBox === false ? true: false;
    };

    $scope.disabled = function(){
      return $scope.supply.name == '' ? true : false;
    }

    //add a supply
    $scope.addSupply = function(){

    	var supply = angular.copy($scope.supply);
    	supply.status = 0;

    	$http.post('/supplies/',supply).
	      success(function(data) {
	        $scope.supplies.splice(0,0,data);
	       	$scope.reset();
	      	$scope.hideAddBox = true;
          $scope.successmsg = "Supply "+data.name+" successfully added!";
          $scope.success = true;
          $timeout(function(){$scope.success=false;},1000);
	      }).
        error(function(data, status, headers, config){
          console.log(data);
          $scope.errormsg = data.error;
          $scope.error = true;
          $timeout(function(){$scope.error=false;},1000);
        });
    };

    $scope.editSupply = function(ind){
      console.log(ind);
      $scope.supplies[ind].edit = true;
    }

    //update a supply
    $scope.updateSupply = function(index){

    	$http.put('/supplies/'+$scope.supplies[index].id, $scope.supplies[index]).
	      success(function(data) {
	        //do nothing because radio has already changed
          console.log(data);
          $scope.supplies[index].edit = false;
	      }).
        error(function(data, status, headers, config){
          console.log(data);
          $scope.errormsg = data.error;
          $scope.error = true;
          $timeout(function(){$scope.error=false;},1000);
        });
    };

    //delete a supply
    $scope.deleteSupply = function(id, index){
    	$http.delete('/supplies/'+id).
	      success(function(data) {
          $scope.successmsg = "Supply "+ $scope.supplies[index].name+" successfully deleted!";
	        $scope.success = true;
          $timeout(function(){$scope.success=false;},1000);
          $scope.supplies.splice(index, 1);
	      }).
        error(function(data, status, headers, config){
          console.log(data);
          $scope.errormsg = data.error;
          $scope.error = true;
          $timeout(function(){$scope.error=false;},1000);
        });
    };

    $scope.reset = function(){
    	$scope.supply.name = '';
      $scope.hideAddBox = true;
    };

});
