// This file register all modules to the app

'use strict';

// Remove the ugly Facebook appended hash
// <https://github.com/jaredhanson/passport-facebook/issues/12>
(function removeFacebookAppendedHash() {
  if (!window.location.hash || window.location.hash !== '#_=_')
    return;
  if (window.history && window.history.replaceState)
    return window.history.replaceState('', document.title,
      window.location.pathname);
  // Prevent scrolling by storing the page's current scroll offset
  var scroll = {
    top: document.body.scrollTop,
    left: document.body.scrollLeft
  };
  window.location.hash = '';
  // Restore the scroll offset, should be flicker free
  document.body.scrollTop = scroll.top;
  document.body.scrollLeft = scroll.left;
}());

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
    'main.apartment',
    'main.invitations',
    'ngRoute'
  ]
);

// Register all routes
app.config(function($routeProvider) {
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
    when('/invite', {
    templateUrl: 'components/invitations/invitations.html',
    module: 'main.invitations',
    controller: 'InviteCtrl'
  }).
    otherwise({
    redirectTo: '/'
  });

});
