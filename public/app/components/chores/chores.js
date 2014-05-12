'use strict';

angular.module('main.chores', []);

// Angular controller for chores
angular.module('main.chores').controller('ChoresCtrl',
  function ($http, $scope) {

    $scope.get('/chores').
      success(function(data) {
        $scope.title = data.title;
      });

});
