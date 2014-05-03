// Angular controller for supplies
angular.module('Supplies').controller('showSupplies', function ($scope, $http) {

  $http.get('/supplies/all').
    success(function(data) {
      $scope.title = data.title;
    });

});
