'use strict';

angular.module('main.apartment', []);

// Angular controller for navigation bar
angular.module('main.apartment').controller('AptAddCtrl',
  function ($http, $scope) {

    $scope.add = function(apartment) {
      $http.post('/apartment/add', apartment)
        .success(function(data, status, headers, config) {
          if(data.result=="success"){
            window.location.href = "./";
          }
        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
      });
    };

});
