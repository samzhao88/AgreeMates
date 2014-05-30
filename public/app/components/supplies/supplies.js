// Front end controller for supplies

'use strict';

angular.module('main.supplies', ['ui.bootstrap']);

angular.module('main.supplies').controller('SuppliesCtrl',
  function ($scope, $http, $timeout) {

    var alertLength = 4000;
    $scope.loaded = false;
  	$scope.hideAddBox = true;
    $scope.supply = {name: ''};
    $scope.supplies = {};


    // show and hide an error msg
    function showErr(msg) {
      $scope.errormsg = msg;
      $scope.error = true;
      $timeout(function() {
        $scope.error = false;
      }, alertLength);
    }

    // show and hide a success msg
    function showSucc(msg) {
      $scope.successmsg = msg;
      $scope.success = true;
      $timeout(function() {
        $scope.success = false;
      }, alertLength);
    }

  	// Get all supplies
    $http.get('/supplies')
      .success(function(data) {
        $scope.supplies = data.supplies;
        $scope.loaded = true;
        $('.hide').removeClass('hide');
      })
      .error(function(data) {
        showErr(data.error);
      });

    // show add fields
    $scope.showAdd = function() {
    	$scope.hideAddBox = !$scope.hideAddBox;
    };

    // disabled add button
    $scope.disabled = function() {
      return $scope.supply.name === '';
    };

    // add a supply
    $scope.addSupply = function() {
    	var supply = angular.copy($scope.supply);
    	supply.status = 0;

    	$http.post('/supplies',supply)
	      .success(function(data) {
	        $scope.supplies.splice(0, 0, data);
	        $scope.reset();
          showSucc('Supply "' + data.name + '" successfully added!');
	      })
        .error(function(data) {
          showErr(data.error);
        });
    };

    // show input field instead of text for editing
    $scope.editSupply = function(supplyIndex) {
      $scope.supplies[supplyIndex].edit = true;
    };

    // update a supply
    $scope.updateSupply = function(supplyIndex) {
    	$http.put('/supplies/' + $scope.supplies[supplyIndex].id,
        $scope.supplies[supplyIndex])
	      .success(function() {
          showSucc('Supply "' + $scope.supplies[supplyIndex].name +
            '" successfully edited!');
          $scope.supplies[supplyIndex].edit = false;
	      })
        .error(function(data) {
          showErr(data.error);
        });
    };

    // delete a supply
    $scope.deleteSupply = function(supplyIndex) {
    	$http.delete('/supplies/' + $scope.supplies[supplyIndex].id)
	      .success(function() {
          showSucc('Supply "' + $scope.supplies[supplyIndex].name +
            '" successfully deleted!');
          $scope.supplies.splice(supplyIndex, 1);
	      })
        .error(function(data) {
          showErr(data.error);
        });
    };

    // reset the supplies add input field
    $scope.reset = function() {
    	$scope.supply.name = '';
      $scope.hideAddBox = true;
    };

    $scope.emptySupplyList = function(){
      return $scope.loaded && $scope.supplies.length === 0 && $scope.hideAddBox;
    };

});
