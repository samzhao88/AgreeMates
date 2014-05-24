// AngularJS controller for history

'use strict';

angular.module('main.calendar', []);

angular.module('main.calendar').controller('CalendarCtrl',
  function ($scope, $http) {

  	$http.get('/calendar').
    success(function(data) {
      $scope.title = data.title;
    }).
    error(function(data, status, headers, config){
        showErr(data.error);
    });

  });