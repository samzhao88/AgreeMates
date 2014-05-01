/*
function bills_controller($scope){

	// Define the model properties. The view will loop
	// through the services array and genreate a li
	// element for every one of its items.

	$scope.services = 
		{
			name: 'Web Development',
			price: 300,
			active:true
		}
	;
}


*/


angular.module('Bill')
	.controller('bills_controller', function ($scope, $location, $http) {
  		$scope.services = [
  		{
  			name: 'Web Development',
  			date: 'asdf',
  		},
  		{
  			name: 'Web Development 2',
  			date: 'asdf 2',
  		},
  		];

  		$scope.name = "ts";

  		$http.get({method: 'GET', url: '/someUrl'}).
		    success(function(data, status, headers, config) {
		      $scope.bills = data
		    }).
		    error(function(data, status, headers, config) {
		      // called asynchronously if an error occurs
		      // or server returns response with an error status.
		    });
	
  	});