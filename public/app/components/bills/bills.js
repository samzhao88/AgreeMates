'use strict';

angular.module('main.bills', []);

// Angular controller for bills
angular.module('main.bills').controller('BillsCtrl',
  function($http, $scope) {

    //new bill being added or updated
  	$scope.bill = {};
    //balance when adding a bill
    $scope.balance = 0;
    //selected roommates and their amount when adding a bill
    $scope.selectedRoommates = [];
    //
    $scope.checkboxes = [];

    //get current user ID
    $http.get('/user').
    success(function(data) {
      $scope.userId = data.id;
    }).
    error(function(data, status, headers, config){
        console.log(data);
    });    

  	//get all unresolved bills
    $http.get('/bills', {params: {type: 'unresolved'}}).
    success(function(data) {
      $scope.unresolvedBills = data.bills;
      $scope.bills = $scope.unresolvedBills;
    }).
    error(function(data, status, headers, config){
        console.log(data);
    });

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
    };

    //get all roommates
    $http.get('/apartment/users').
    success(function(data) {
      $scope.roommates = data.users;
    }).
    error(function(data, status, headers, config){
        console.log(data);
    });    

    //add a new bill
    $scope.addBill = function() {
    	var bill = angular.copy($scope.bill);
      //process each roommate's payment amount
      bill.roommates = [];
      for (var i = 0; i < $scope.roommates.length; i++) {
        if ($scope.selectedRoommates.indexOf($scope.roommates[i].id) > -1) {
          bill.roommates.push({"id": $scope.roommates[i].id, "amount": $scope.roommates[i].amount});
        };       
      };
      console.log(bill.roommates);
      console.log(bill);
      	$http.post('/bills/', bill).
  	      success(function(data) {
  	        //$scope.bills.push(data);
  	       	$scope.reset();
            //need to show new bill on the page, need to get id of new bill
            console.log(data);
  	      }).
          error(function(data, status, headers, config){
            console.log(data);
          });
    };

    //select all roommates who are checked
    $scope.toggleSelection = function toggleSelection(roommateID) {
      var idx = $scope.selectedRoommates.indexOf(roommateID);

      //is currently selected
      if (idx > -1) {
        $scope.selectedRoommates.splice(idx, 1);
      } else {
        $scope.selectedRoommates.push(roommateID);
      }
    };

    //delete a bill
    $scope.deleteBill = function(id, index) {
      	$http.delete('/bills/'+id). //need to test this with real API
  	      success(function(data) {
  	        $scope.bills.splice(index, 1);
  	      }).
          error(function(data, status, headers, config){
            console.log(data);
          });
    };

    //update a bill, not done yet.
    $scope.updateBill = function(id, index) {
        console.log($scope.bill);      
      	// $http.put('/bills/'+id).
  	    //   success(function(data) {
  	    //     //refresh?
  	    //   }).
       //    error(function(data, status, headers, config){
       //      console.log(data);
       //    });
    };

    //mark a bill as paid or not paid
    $scope.payBill = function(id, index) {
      var paid = "false";
      //check or uncheck
      var idx = $scope.checkboxes.indexOf(id);
      //if is currently selected
      if (idx > -1) {
        $scope.checkboxes.splice(idx, 1);
      } else {
        $scope.checkboxes.push(id);
        paid = "true";
      }
      $http.put('/bills/'+id+"/payment", {paid: paid}).
        success(function(data) {
          //doesn't need to do anything because the checkbox is already checked/unchecked
        }).
        error(function(data, status, headers, config){
          console.log(data);
        });
    };

    //return a boolean indictaing whether the bill is paid or not by the user
    $scope.isPaid = function(id, index) {
      var paid = false;
      for (var i = 0; i < $scope.bills[index].payments.length; i++) {
        if ($scope.bills[index].payments[i].userId == $scope.userId) {
          paid = $scope.bills[index].payments[i].paid;
          if ($scope.bills[index].payments[i].paid) {
            //if this bill is not checked
            if ($scope.checkboxes.indexOf(id) < 0) {
              $scope.checkboxes.push(id);
            }
          }         
        }
      };
      return paid;
    };

    //return the amount owned by the current user for a bill
    $scope.amountOwned = function(id, index) {  
      for (var i = 0; i < $scope.bills[index].payments.length; i++) {
        if ($scope.bills[index].payments[i].userId == $scope.userId) {
          return $scope.bills[index].payments[i].amount;        
        }
      };      
      return 0;
    };

    //convert date to yyyy-mm-dd format
    $scope.convertDate = function(date) {
      return date.split("T")[0];
    }

    $scope.prepareUpdate = function(id) {
      $scope.oldBill = {};
      for (var i = 0; i < $scope.bills.length; i++) {
        if ($scope.bills[i].id == id){
          $scope.oldBill = angular.copy($scope.bills[i]);
        }
      };
      console.log("prepare");
      console.log($scope.oldBill);
    }

    //clear the bill
    $scope.reset = function() {
      $scope.bill = {};
    };

});


