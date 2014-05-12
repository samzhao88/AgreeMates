'use strict';

angular.module('main.invitations', []);

angular.module('main.invitations').
  controller('InviteCtrl', function($scope, $http, localStorageService) {

  $http.get('/invitations/:invite').success(function(data) {
    localStorageService.set('InviteId', data.invite);

    var value = localStorageService.get('InviteId');
    console.log('' + data);
  });
});
