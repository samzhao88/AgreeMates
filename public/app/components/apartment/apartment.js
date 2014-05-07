'use strict';

angular.module('main.apartment', []);

// Angular controller for navigation bar
angular.module('main.apartment').controller('AptAddCtrl', function ($scope, $location) {

  $scope.master = {};

    $scope.update = function(user) {
      $scope.master = angular.copy(user);
      console.log(user.email);
      console.log(user.name);
    };

    $scope.reset = function() {
      $scope.user = angular.copy($scope.master);
    };

    $http.post('/messages/recent', $scope.user).
    success(function(data) {
      console.log(data);
    });

    $scope.reset();

});
