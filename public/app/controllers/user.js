// app/controllers/dashboard.js
angular.module('User')
.controller('showUser', function($scope, $location) {
 	$scope.text = $location.path();
})
.controller('editUser', function($scope) {
	$scope.text = "edit user";
})