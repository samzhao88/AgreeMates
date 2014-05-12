'use strict';

angular.module('main.supplies', ['ui.bootstrap']);

// Angular controller for supplies
angular.module('main.supplies').controller('SuppliesCtrl',
  function ($scope, $http) {

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
  	        $scope.supplies.push(data);
  	       	$scope.reset();
  	      	$scope.hideAddBox = true;
  	      }).
          error(function(data, status, headers, config){
            console.log(data);
          });
      };

      //update a supply
      $scope.updateSupply = function(index){

      	$http.put('/supplies/'+$scope.supplies[index].id, $scope.supplies[index]).
  	      success(function(data) {
  	        //do nothing because radio has already changed
  	      }).
          error(function(data, status, headers, config){
            console.log(data);
          });
      };

      //delete a supply
      $scope.deleteSupply = function(id, index){
      	$http.delete('/supplies/'+id).
  	      success(function(data) {
  	        $scope.supplies.splice(index, 1);
  	      }).
          error(function(data, status, headers, config){
            console.log(data);
          });
      };

      $scope.reset = function(){
      	$scope.supply.name = '';
        $scope.hideAddBox = true;
      }

});
