'use strict';

angular.module('main.supplies', []);

// Angular controller for supplies
angular.module('main.supplies').controller('SuppliesCtrl',
  function ($scope, $http) {

    $http.get('/supplies/all').
      success(function(data) {
        $scope.title = data.title;
    });

});
