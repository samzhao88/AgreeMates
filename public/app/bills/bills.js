'use strict';

angular.module('main.bills', []);

// Angular controller for bills
angular.module('main.bills').controller('BillsCtrl', function ($scope, $http) {

	$http.get('/bills/all').
		success(function(data) {
			$scope.title = data.title;
		});

});
