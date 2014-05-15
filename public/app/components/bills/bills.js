'use strict';

angular.module('main.bills', []);

// Angular controller for bills
angular.module('main.bills').controller('BillsCtrl',
  function($http, $scope) {
    //add bill form
  	$scope.hideAddBox = true;
    //new bill being added
  	$scope.bill = {};
    //balance when adding a bill
    $scope.balance = 0;
    //selected roommates and their amount when adding a bill
    $scope.selectedRoommates = [];

  	//get all unresolved bills
    $http.get('/bills', {params: {type: 'unresolved'}}).
    success(function(data) {
      $scope.unresolvedBills = data.bills;
      $scope.bills = $scope.unresolvedBills;
    }).
    error(function(data, status, headers, config){
        console.log(data);
    });;

    //get all resolved bills
    $http.get('/bills', {params: {type: 'resolved'}}).
    success(function(data) {
      $scope.resolvedBills = data.bills;
    }).
    error(function(data, status, headers, config){
        console.log(data);
    });

    //select unresolved bills or resolved bills
    $scope.setTable = function(table) {
    	if (table == 'resolved') {
    		$scope.bills = $scope.resolvedBills;
    	} else {
    		$scope.bills = $scope.unresolvedBills;
    	}   	
    }

    //get all roommates, need to get apt id!
    // $http.get('/apartment/' + 'apt' + '/users').
    // success(function(data) {
    //   $scope.roommates = data.roommates;
    // }).
    // error(function(data, status, headers, config){
    //     console.log(data);
    // });    
    $scope.roommates = [{id: 1, name: 'john'}, {id: 2, name: 'Jesse'}];

    //show the form when add button is clicked.
  	$scope.showAdd = function(){
  		$scope.hideAddBox = $scope.hideAddBox === false ? true: false;
  	};

    //add a new bill
    $scope.addBill = function() {
    	var bill = angular.copy($scope.bill);
      //process each roommate's payment amount
      bill.roommates = [];
      for (var i = 0; i < $scope.roommates.length; i++) {
        if ($scope.selectedRoommates.indexOf($scope.roommates[i].id) > -1) {
          bill.roommates.push($scope.roommates[i].id, $scope.roommates[i].amount);
        };       
      };
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

    $scope.toggleSelection = function toggleSelection(roommateID) {
      var idx = $scope.selectedRoommates.indexOf(roommateID);

      //is currently selected
      if (idx > -1) {
        $scope.selectedRoommates.splice(idx, 1);
      } else {
        $scope.selectedRoommates.push(roommateID);
      }
    }

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
      	$http.put('/bills/'+id).
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


