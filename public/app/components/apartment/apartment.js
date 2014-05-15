'use strict';

angular.module('main.apartment', []);

// Angular controller for navigation bar
angular.module('main.apartment').controller('AptAddCtrl',
  function ($http, $scope) {

    $scope.add = function(apartment, email) {
      $http.post('/apartment', apartment)
        .success(function() {
          $http.post('/invitations', {'email': email})
            .success(function() { })
            .error(function(data, status, headers, config) {
              console.log(status, headers, config);
            });
          window.location.href = './';

        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
      });
    };

});
