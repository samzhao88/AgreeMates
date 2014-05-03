// This file register all modules to the app

// Define all the modules with no dependencies
angular.module('Calendar', []);
angular.module('Bills', []);
angular.module('Chores', []);
angular.module('Supplies',[]);
angular.module('Board', []);
angular.module('Settings', []);
angular.module('Profile', []);
angular.module('Nav', []);

// Define the "main" module and inject all other modules as dependencies
var app = angular.module('Main',
  [
    'Calendar',
    'Bills',
    'Chores',
    'Supplies',
    'Board',
    'Settings',
    'Profile',
    'Nav',
    'ngRoute'
  ]
);

// Register all routes
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/showCalendar.html',
        module: 'Calendar',
        controller: 'showCalendar'
      }).
      when('/bills', {
        templateUrl: 'views/showBills.html',
        module: 'Bills',
        controller: 'showBills'
      }).
      when('/chores', {
        templateUrl: 'views/showChores.html',
        module: 'Chores',
        controller: 'showChores'
      }).
      when('/supplies', {
        templateUrl: 'views/showSupplies.html',
        module: 'Supplies',
        controller: 'showSupplies'
      }).
      when('/board', {
        templateUrl: 'views/showBoard.html',
        module: 'Board',
        controller: 'showBoard'
      }).
      when('/settings', {
        templateUrl: 'views/settings.html',
        module: 'Settings',
        controller: 'settings'
      }).
      when('/profile', {
        templateUrl: 'views/profile.html',
        module: 'Profile',
        controller: 'profile'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
