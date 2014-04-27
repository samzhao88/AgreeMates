// Define all the modules with no dependencies
angular.module('Dashboard', []);
angular.module('User', []);
angular.module('Nav', []);

// Lastly, define your "main" module and inject all other modules as dependencies
var app = angular.module('Main',
  [
    'Dashboard',
    'User',
    'Nav',
    'ngRoute',
  ]
);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
       when('/user/edit', {
      	templateUrl: 'views/user.html',
      	module: 'User',
      	controller: 'editUser'
      }).
      when('/user', {
        templateUrl: 'views/user.html',
        module: 'User',
        controller: 'showUser'
      }).
      when('/bills', {
        templateUrl: 'views/user.html',
        module: 'User',
        controller: 'showUser'
      }).
      when('/contact', {
        templateUrl: 'views/user.html',
        module: 'User',
        controller: 'showUser'
      }).
      when('/about', {
        templateUrl: 'views/user.html',
        module: 'User',
        controller: 'showUser'
      }).
      when('/', {
        templateUrl: 'views/user.html',
        module: 'Dashboard',
        controller: 'showDashboard'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);