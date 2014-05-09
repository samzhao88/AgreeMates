'use strict';

angular.module('main.calendar', []);

// Angular controller for calendar
angular.module('main.calendar').controller('CalendarCtrl',
  function ($scope, $http) {

    $http.get('/calendar').
      success(function(data) {
        $scope.title = data.title;
      });

});
