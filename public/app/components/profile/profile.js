'use strict';

angular.module('main.profile', []);

// Angular controller for user profile
angular.module('main.profile').controller('ProfileCtrl',
  function ($scope, $http) {

    $http.get('/profile').
      success(function(data) {
        $scope.title = data.title;
    });

});
