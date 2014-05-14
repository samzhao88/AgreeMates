'use strict';

angular.module('main.invitations', ['LocalStorageModule']);

angular.module('main.invitations').controller('InviteCtrl',
  ['$scope', '$http', '$routeParams', '$location', 'localStorageService', function($scope, $http, $routeParams, $location, localStorageService) {

    $http.get('/invitations/' + $routeParams.invite).
      success(function(data) {
      console.log('invitations route');
        $scope.title = data.title;
        $scope.aptName = data.aptName;
        $scope.aptAddr = data.aptAddress;
        $scope.invId = data.invId;
        localStorageService.clearAll();
        localStorageService.set('InviteID', data.id);
      });
}]);
