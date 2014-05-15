'use strict';

angular.module('main.invitations', []);

angular.module('main.invitations').controller('InviteIndexCtrl',
                                          function($scope, $http, $window) {

  $scope.accept = function(invId) {
    $http.delete('/invitations/' + invId).success(function() {
      $window.location.href = '/';
      console.log('Accepted');
    });
  };

});

