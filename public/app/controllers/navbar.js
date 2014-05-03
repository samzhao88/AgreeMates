// Angular controller for navigation bar
angular.module('Nav').controller('navbarController', function ($scope, $location) {

  $scope.isActive = function(viewLocation) {
    return viewLocation === $location.path();
  };

});
