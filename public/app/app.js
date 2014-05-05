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
    'ngRoute'
  ]
);

// Register all routes
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'calendar/calendar.html',
        module: 'main.calendar',
        controller: 'CalendarCtrl'
      }).
      when('/bills', {
        templateUrl: 'bills/bills.html',
        module: 'main.bills',
        controller: 'BillsCtrl'
      }).
      when('/chores', {
        templateUrl: 'chores/chores.html',
        module: 'main.chores',
        controller: 'ChoresCtrl'
      }).
      when('/supplies', {
        templateUrl: 'supplies/supplies.html',
        module: 'main.supplies',
        controller: 'SuppliesCtrl'
      }).
      when('/board', {
        templateUrl: 'board/board.html',
        module: 'main.board',
        controller: 'BoardCtrl'
      }).
      when('/settings', {
        templateUrl: 'settings/settings.html',
        module: 'main.settings',
        controller: 'SettingsCtrl'
      }).
      when('/profile', {
        templateUrl: 'profile/profile.html',
        module: 'main.profile',
        controller: 'ProfileCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
