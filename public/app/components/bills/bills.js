'use strict';

angular.module('main.bills', []);

// Angular controller for bills
angular.module('main.bills').controller('BillsCtrl',
  function($http, $scope) {

    //new bill being added
  	$scope.bill = {};
    //balance when adding a bill
    $scope.balance = 0;
    //selected roommates and their amount when adding a bill
    $scope.selectedRoommates = [];
    //all checked bills
    $scope.checkboxes = [];
    //the bill being updated
    $scope.oldBill = {payments:[]};

    //get current user ID
    $http.get('/user').
    success(function(data) {
      $scope.userId = data.id;
      $scope.userFirstName = data.first_name;
      $scope.userLastNanme = data.last_name;
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
      	$http.post('/bills/', bill).
  	      success(function(data) {
            //stimulate the new bill into existing bills;
            var newBill = {}
            newBill.id = data.id;
            newBill.name = bill.name;
            newBill.amount = bill.total;
            newBill.dueDate = bill.date;
            newBill.frequency = bill.interval;
            newBill.resolved = false;
            newBill.creatorId = $scope.userId;
            newBill.payTo = $scope.userFirstName;
            newBill.payments = [];
            for (var i = 0; i < bill.roommates.length; i++) {
              newBill.payments.push({"uesrId": bill.roommates[i].id, "amount": bill.roommates[i].amount, "paid": false});
            };
  	        $scope.bills.push(newBill);
  	       	$scope.reset();
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
        console.log("remove");
      } else {
        $scope.selectedRoommates.push(roommateID);
        console.log("push");
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
        var tempBill = {};
        tempBill.name = $scope.oldBill.name;
        tempBill.total = $scope.oldBill.amount;
        tempBill.interval = $scope.oldBill.frequency;
        tempBill.date = $scope.oldBill.dueDate;
        tempBill.roommates = [];
        var tempPayments = [];
        for (var i = 0; i < $scope.oldBill.payments.length; i++) {
          if ($scope.selectedRoommates.indexOf($scope.oldBill.payments[i].userId) > -1) {
            tempBill.roommates.push({id: $scope.oldBill.payments[i].userId, amount: $scope.oldBill.payments[i].amount});
            tempPayments.push({userId: $scope.oldBill.payments[i].userId, amount: $scope.oldBill.payments[i].amount, paid: false});
          }
        };
        console.log(tempBill);
      	$http.put('/bills/'+$scope.oldBill.id, tempBill).
  	      success(function(data) {
            $scope.oldBill.payments = tempPayments;
            $scope.bills[index] = $scope.oldBill;
            console.log($scope.oldBill);
  	        $scope.reset();
  	      }).
          error(function(data, status, headers, config){
            console.log(data);
          });
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

    //set the oldBill to the bill that is selected to update
    $scope.prepareUpdate = function(id) {
      $scope.reset();
      for (var i = 0; i < $scope.bills.length; i++) {
        if ($scope.bills[i].id == id){
          $scope.oldBill = angular.copy($scope.bills[i]);
          for (var i = 0; i < $scope.oldBill.payments.length; i++) {
            $scope.selectedRoommates.push($scope.oldBill.payments[i].userId);
          };
          //change date formate
        }
      };
    }

    //return whether a roommate should be checked when update a bill
    $scope.isChecked = function(roommateId) {
      if ($scope.oldBill.payments === undefined) {
        return false;
      }
      for (var i = 0; i < $scope.oldBill.payments.length; i++) {
        if ($scope.oldBill.payments[i].userId = roommateId) {
          return true;
        } else {
          return false;
        }
      };
      return false;
    }

    //clear the bill
    $scope.reset = function() {
      $scope.bill = {};
      $scope.selectedRoommates = [];
      $scope.oldBill = {};
    };

});


