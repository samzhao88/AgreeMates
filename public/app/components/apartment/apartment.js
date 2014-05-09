'use strict';

angular.module('main.apartment', []);

// Angular controller for navigation bar
angular.module('main.apartment').controller('AptAddCtrl', function ($scope, $location) {

  $scope.master = {};

    $scope.update = function(apt) {
      $scope.master = angular.copy(apt);
    };

    $scope.reset = function() {
      $scope.apt = angular.copy($scope.master);
    };

    $http.post('/apartment/add', $scope.apt).
    success(function(data) {
      console.log(data);
    });

    $scope.reset();

});
