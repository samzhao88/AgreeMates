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

    $scope.showInvite = function() {
        $scope.emails = [{email: ''}];
    };

    $scope.addNewEmail = function() {
      $scope.emails.push({email: ''});
    };

    $scope.sendInvite = function() {
      if ($scope.emails === undefined) {
        showErr('You entered invalid email addresses!');
        return;
      }

      var emails = [];
      for (var i = 0; i < $scope.emails.length; i++) {
        var email = $scope.emails[i].email;
        if (email !== undefined && email.trim() !== '') {
          emails.push(email.trim());
        }
      }
      if (emails.length === 0) {
        showErr('No Emails Entered');
        return;
      }

      $http.post('/invitations', {emails: emails})
        .success(function() {
          showSucc('Invite sent to ' + emails + '!');
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

    $scope.leaveApartment = function() {
      $http.post('/apartment/leave')
        .success(function() {
          window.location.href = '/';
        })
        .error(function() {
          showErr('Could not leave apartment!');
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
