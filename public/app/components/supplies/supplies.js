'use strict';

angular.module('main.supplies', ['ui.bootstrap']);

// Angular controller for supplies
angular.module('main.supplies').controller('SuppliesCtrl',
  function ($scope, $http, $timeout) {

    //alert msg show length in ms
    var alertLength = 2000;

    //hide supplies add box
  	$scope.hideAddBox = true;

    //empty model
    $scope.supply = {name: ''};

  	//get apll supplies
    $http.get('/supplies/').
      success(function(data) {
        console.log("hi");
        $scope.supplies = data.supplies;
      }).
      error(function(data, status, headers, config){
        showErr(data.error);
      });

    //show add fields
    $scope.showAdd = function(){
    	$scope.hideAddBox = $scope.hideAddBox === false ? true: false;
    };

    //disabled add button
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
          showSucc("Supply "+data.name+" successfully added!");
	      }).
        error(function(data, status, headers, config){
          showErr(data.error);
        });
    };

    //show input field instead of text for editing
    $scope.editSupply = function(ind){
      $scope.supplies[ind].edit = true;
    }

    //update a supply
    $scope.updateSupply = function(index){

    	$http.put('/supplies/'+$scope.supplies[index].id, $scope.supplies[index]).
	      success(function(data) {
          $scope.supplies[index].edit = false;
	      }).
        error(function(data, status, headers, config){
          showErr(data.error);
        });
    };

    //delete a supply
    $scope.deleteSupply = function(id, index){
    	$http.delete('/supplies/'+id).
	      success(function(data) {
          showSucc("Supply "+ $scope.supplies[index].name+" successfully deleted!");
          $scope.supplies.splice(index, 1);
	      }).
        error(function(data, status, headers, config){
          showErr(data.error);
        });
    };

    //reset the supplies add input field
    $scope.reset = function(){
    	$scope.supply.name = '';
      $scope.hideAddBox = true;
    };

    //show and hide an error msg
    function showErr(msg){
      console.log(data);
      $scope.errormsg = msg;
      $scope.error = true;
      $timeout(function(){$scope.error=false;},alertLength);
    }

    //show and hide a success msg
    function showSucc(msg){
      $scope.successmsg = msg;
      $scope.success = true;
      $timeout(function(){$scope.success=false;},alertLength);
    }

});
