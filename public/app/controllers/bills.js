angular.module('Bills').controller('showBills', function ($scope, $http) {

	$http.get('/bills/all').
		success(function(data) {
			$scope.title = data.title;
		});

});
