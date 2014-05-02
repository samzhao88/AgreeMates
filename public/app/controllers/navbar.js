//NavController for the entire app

app.controller('navCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.routeIs = function(routeName) {
    return $location.path() === routeName;
  };
}]);