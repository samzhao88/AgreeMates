angular.module('Calendar').controller('showCalendar', function ($scope, $http) {

  $http.get('/calendar/show').
    success(function(data) {
      $scope.title = data.title;
    });

});
