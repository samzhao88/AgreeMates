'use strict';

angular.module('main.apartment', []);

// Angular controller for the add apartment page
angular.module('main.apartment').controller('AptAddCtrl',
  function ($http, $scope) {

    $scope.add = function(apartment) {
      $http.post('/apartment', apartment)
        .success(function() {
          window.location.href = './';
        })
        .error(function() {
          
        });
    };

});
