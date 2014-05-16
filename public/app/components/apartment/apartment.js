'use strict';

angular.module('main.apartment', []);

// Angular controller for navigation bar
angular.module('main.apartment').controller('AptAddCtrl',
  function ($http, $scope) {

    $scope.add = function(apartment, emails) {
      $http.post('/apartment', apartment)
        .success(function() {
          function successHandler(){}
          function errorHandler(data, status, headers, config) {
            console.log(status, headers, config);
          }
          if (emails !== undefined) {
            var emailList = emails.split(',');
            angular.forEach(emailList, function(email) {
              $http.post('/invitations', {'email': email})
              .success(successHandler())
              .error(errorHandler());
            });
          }
          window.location.href = './';

        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
      });
    };

});
