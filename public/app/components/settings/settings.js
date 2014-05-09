'use strict';

angular.module('main.settings', []);

// Angular controller for settings
angular.module('main.settings').controller('SettingsCtrl',
  function ($scope, $http) {

    $http.get('/settings').
      success(function(data) {
        $scope.title = data.title;
    });

});
