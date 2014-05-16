'use strict';

angular.module('main.settings', ['ui.bootstrap']);

// Angular controller for settings
angular.module('main.settings').controller('SettingsCtrl',
  function ($scope, $http) {

    $http.get('/apartment')
      .success(function(data) {
        $scope.apartment = data;
      });

    $http.get('/apartment/users')
      .success(function(data) {
        $scope.roommates = data.users;
      });

});
