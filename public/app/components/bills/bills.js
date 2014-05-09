'use strict';

angular.module('main.bills', []);

// Angular controller for bills
angular.module('main.bills').controller('BillsCtrl',
  function($http, $scope) {

    $http.get('/bills').success(function(data) {
      $scope.title = data.title;
    });

});
