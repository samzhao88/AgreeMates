'use strict';

angular.module('main.supplies', ['ui.bootstrap']);

// Angular controller for supplies
angular.module('main.supplies').controller('SuppliesCtrl',
  function ($scope, $http) {

  	$scope.hideAddBox = true;

    var dummy = [{id: 1, name: 'toilet paper emtpy', status: 0},
  				{id: 2, name: 'toilet paper running low', status: 1},
  				{id: 3, name: 'toilet paper fully stocked', status: 2}];

  	//get apll supplies
    $http.get('/').
      success(function(data) {
        data = dummy;
        $scope.supplies = data;
      }).
      error(function(data, status, headers, config){
        console.log(data);
      });

      $scope.showAdd = function(){
      	$scope.hideAddBox = $scope.hideAddBox === false ? true: false;
      };

      //add a supply
      $scope.addSupply = function(){

      	var supply = angular.copy($scope.supply);
      	supply.status = 0;

      	$http.post('/supplies/',supply).
  	      success(function(data) {
  	        $scope.supplies.push(supply);
  	       	$scope.reset();
  	      	$scope.hideAddBox = true;
  	      }).
          error(function(data, status, headers, config){
            console.log(data);
          });
      };

      //update a supply
      $scope.updateSupply = function(index){

      	$http.put('/supplies/', $scope.supplies[index]).
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
      	$scope.supply.name = null;
      }

});
