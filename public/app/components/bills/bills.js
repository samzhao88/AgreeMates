'use strict';

angular.module('main.bills', []);

// Angular controller for bills
angular.module('main.bills').controller('BillsCtrl',
  function($http, $scope) {
  	$scope.hideAddBox = true;
  	$scope.bill = {};
    $scope.balance = 0;
    $scope.selectedRoommates = [];

  	//get all unresolved bills
    $http.get('/bills').
    success(function(data) {
      $scope.unresolvedBills = data.bills;
      $scope.bills = $scope.unresolvedBills;
      $scope.balance = $scope.bills.amount;
    }).
    error(function(data, status, headers, config){
        console.log(data);
    });;

    //get all unresolved bills
    // $http.get('/bills?type=resolved').
    // success(function(data) {
    //   $scope.resolvedBills = [{'name': 'water', 'total': 120, 'owned': 20, 'payto': 'John', 'date': '1/1', 'paid': 'yes'}]; //test data
    // }).
    // error(function(data, status, headers, config){
    //     console.log(data);
    // });

    //select unresolved bills or resolved bills
    $scope.setTable = function(table) {
    	if (table == 'resolved') {
    		$scope.bills = $scope.resolvedBills;
    	} else {
    		$scope.bills = $scope.unresolvedBills;
    	}   	
    }

    //get all roommates, need to update
    $http.get('/bills?type=template').
    success(function(data) {
      $scope.roommates = [{'id': 1, 'name': 'John'}, {'id': 2, 'name': 'Jessica'}]; //test data
    }).
    error(function(data, status, headers, config){
        console.log(data);
    });    

    //show the form when add button is clicked.
  	$scope.showAdd = function(){
  		$scope.hideAddBox = $scope.hideAddBox === false ? true: false;
  	};

    //add a new bill
    $scope.addBill = function() {
    	var bill = angular.copy($scope.bill);
      bill.roommates = [];
      console.log(bill);
      	$http.post('/bills/', bill).
  	      success(function(data) {
  	        //$scope.bills.push(data);
  	       	$scope.reset();
  	      	$scope.hideAddBox = true;
            console.log(data);
  	      }).
          error(function(data, status, headers, config){
            console.log(data);
          });
    };

    //delete a bill
    $scope.deleteBill = function(id, index) {
      	$http.delete('/bills/'+id). //need to test this with real API
  	      success(function(data) {
  	        $scope.supplies.splice(index, 1);
  	      }).
          error(function(data, status, headers, config){
            console.log(data);
          });
    };

    //update a bill, not done yet.
    $scope.updateBill = function(id, index) {
      	$http.put('/bills/', bill).
  	      success(function(data) {
  	        
  	      }).
          error(function(data, status, headers, config){
            console.log(data);
          });
    };

    //pay or unpay a bill
    $scope.payBill = function(id, index) {

    }

    $scope.reset = function() {
		$scope.hideAddBox = true;
    };

});


