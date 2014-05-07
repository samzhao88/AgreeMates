'use strict';

angular.module('main.nav', []);

// Angular controller for navigation bar
angular.module('main.nav').controller('NavCtrl', function ($scope, $location) {

  $scope.isActive = function(viewLocation) {
    return viewLocation === $location.path();
  };

});
