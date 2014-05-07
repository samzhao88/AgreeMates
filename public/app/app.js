// This file register all modules to the app

'use strict';

// Define the "main" module and inject all other modules as dependencies
var app = angular.module('main',
  [
    'main.calendar',
    'main.bills',
    'main.chores',
    'main.supplies',
    'main.board',
    'main.settings',
    'main.profile',
    'main.nav',
    'main.login',
    'ngRoute'
  ]
);

// Register all routes
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'components/calendar/calendar.html',
        module: 'main.calendar',
        controller: 'CalendarCtrl'
      }).
      when('/bills', {
        templateUrl: 'components/bills/bills.html',
        module: 'main.bills',
        controller: 'BillsCtrl'
      }).
      when('/chores', {
        templateUrl: 'components/chores/chores.html',
        module: 'main.chores',
        controller: 'ChoresCtrl'
      }).
      when('/supplies', {
        templateUrl: 'components/supplies/supplies.html',
        module: 'main.supplies',
        controller: 'SuppliesCtrl'
      }).
      when('/board', {
        templateUrl: 'components/board/board.html',
        module: 'main.board',
        controller: 'BoardCtrl'
      }).
      when('/settings', {
        templateUrl: 'components/settings/settings.html',
        module: 'main.settings',
        controller: 'SettingsCtrl'
      }).
      when('/profile', {
        templateUrl: 'components/profile/profile.html',
        module: 'main.profile',
        controller: 'ProfileCtrl'
      }).
       when('/login', {
        controller: 'LoginCtrl',
        template: '<div></div>'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
