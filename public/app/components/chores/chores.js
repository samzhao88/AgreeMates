'use strict';

angular.module('main.chores', []);

// Angular controller for chores
angular.module('main.chores').controller('ChoresCtrl',
  function ($scope, $http) {
  	$scope.add = function(apartment) {
      $http.post('/chores', apartment)
        .success(function(data, status, headers, config) {
          if(data.result=="success"){
            window.location.href = "./";
          }
        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
      });
    };





    $http.get('/chores').
      success(function(data) {
        $scope.title = data.title;
      });

});
