// Define all the modules with no dependencies
angular.module('Calendar', []);
angular.module('Bills', []);
angular.module('Chores', []);
angular.module('Supplies',[]);
angular.module('Board', []);
angular.module('Settings', []);
angular.module('Profile', []);

// Lastly, define your "main" module and inject all other modules as dependencies
var app = angular.module('Main',
  [
    'Calendar',
    'Bills',
    'Chores',
    'Supplies',
    'Board',
    'Settings',
    'Profile',
    'ngRoute'
  ]
);

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
      otherwise({
        redirectTo: '/'
      });
  }]);
