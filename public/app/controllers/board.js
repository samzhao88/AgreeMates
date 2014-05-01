angular.module('Board').controller('showBoard', function ($scope, $http) {

  $http.get('/messages/all').
    success(function(data) {
      $scope.title = data.title;
    });

});
