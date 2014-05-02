angular.module('Board').controller('showBoard', function ($scope, $http) {

  $http.get('/messages/recent').
    success(function(data) {
      $scope.title = data.title;
    });

});
