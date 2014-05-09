'use strict';

angular.module('main.chores', []);

// Angular controller for chores
angular.module('main.chores').controller('ChoresCtrl',
  function ($scope, $http) {

    $http.get('/chores').
      success(function(data) {
        $scope.title = data.title;
      });

});
