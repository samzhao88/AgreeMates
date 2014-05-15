'use strict';

angular.module('main.invitations', []);

angular.module('main.invitations').controller('InviteIndexCtrl',
                                              function($scope, $http) {

  $scope.accept = function(invId) {
    $http.delete('/invitations/' + invId);
    console.log('Accepted');
  };

});

