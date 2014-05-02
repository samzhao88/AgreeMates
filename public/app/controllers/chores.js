angular.module('Chores').controller('showChores', function ($scope, $http) {

  $http.get('/chores/all').
    success(function(data) {
      $scope.title = data.title;
    });

});
