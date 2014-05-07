'use strict';

angular.module('main.board', []);

// Angular controller for message board
angular.module('main.board').controller('BoardCtrl', function ($scope, $http) {

  $http.get('/messages/recent').
    success(function(data) {
      $scope.title = data.title;
    });

});
