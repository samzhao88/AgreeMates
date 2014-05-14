'use strict';

angular.module('main.invitations', []);

angular.module('main.invitations').controller('InviteIndexCtrl', function($scope, $http) {

  $scope.accept = function() {
    console.log('Accepted');
  };

});

