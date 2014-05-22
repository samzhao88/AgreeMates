'use strict';

angular.module('main.apartment', []);

// Angular controller for the add apartment page
angular.module('main.apartment').controller('AptAddCtrl',
  function ($http, $scope) {

    $scope.addApartment = function() {
      $http.post('/apartment', $scope.apartment)
        .success(function() {
          window.location.href = './';

        })
        .error(function() {

        });
    };

});
