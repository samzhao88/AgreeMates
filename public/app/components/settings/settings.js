'use strict';

angular.module('main.settings', []);

// Angular controller for settings
angular.module('main.settings').controller('SettingsCtrl',
  function ($scope, $http, $timeout) {

    // alert msg show length in ms
    var alertLength = 2000;

    $http.get('/apartment')
      .success(function(data) {
        $scope.apartment = data;
      });

    $http.get('/apartment/users')
      .success(function(data) {
        $scope.roommates = data.users;
      });

    $scope.sendInvite = function() {
      if ($scope.email === undefined || $scope.email.trim() === '') {
        showErr('You entered an invalid email address!');
        return;
      }

      $http.post('/invitations', {emails: [$scope.email]})
        .success(function() {
          showSucc('Invite sent to ' + $scope.email + '!');
        })
        .error(function() {
          showErr('You entered an invalid email address!');
        });
    };

    $scope.editApartment = function() {
      $http.put('/apartment', {name: $scope.name, address: $scope.address})
        .success(function() {
          showSucc('Apartment info successfully edited!');
          $scope.apartment.name = $scope.name;
          $scope.apartment.address = $scope.address;
        })
        .error(function() {
          showErr('Apartment info could not be edited!');
        });
    };

    $scope.populateInfo = function() {
      $scope.name = $scope.apartment.name;
      $scope.address = $scope.apartment.address;
    };

    //show and hide an error msg
    function showErr(msg){
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
