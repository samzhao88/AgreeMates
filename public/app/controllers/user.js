// app/controllers/dashboard.js
angular.module('User')
.controller('showUser', function($scope) {
 	$scope.text = "show user";
})
.controller('editUser', function($scope) {
	$scope.text = "edit user";
})