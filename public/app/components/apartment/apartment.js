'use strict';

angular.module('main.apartment', []);

angular.module('main.apartment').controller('AptAddCtrl',
  function ($http, $scope) {

    $scope.add = function(apartment) {
      $http.post('/apartment/add', apartment)
        .success(function(data, status, headers, config) {
          console.log(status, headers, config);
        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
      });
    };
    
});
