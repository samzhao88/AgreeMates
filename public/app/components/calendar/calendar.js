// AngularJS controller for history

'use strict';

angular.module('main.calendar', ['ui.bootstrap','ui.calendar']);

angular.module('main.calendar').controller('CalendarCtrl', 
    function ($scope, $http, $modal) {

    //get request didn't return yet   
    $scope.loaded = false;
    $scope.chores = [];
    $scope.chores_uncompleted = [];
    $scope.chores_completed = [];

    //variable for events
    $scope.events = [];

  	$http.get('/calendar').
    success(function(data) {
    $scope.title = data.title;
      
    }).
    error(function(data, status, headers, config){
        showErr(data.error);
    });


    $http.get('/chores')
    .success(function(data) {
        console.log("hello");
        console.log(data);
        for (var x = 0; x < $scope.chores.length; x++) {
            for (var i = 0; i < $scope.chores[x].users[i].length; i++) {
            $scope.chores[x].users[i].user_id = $scope.chores[x].users[i].id;
            }
        }
        
        for (var x = 0; x < data.chores.length; x++){
            if(data.chores[x].completed == true)
            {
                $scope.chores_completed.unshift(data.chores[x]);
            }
            else
            {
                $scope.chores_uncompleted.unshift(data.chores[x]);
            }
        }
        $scope.chores = $scope.chores_uncompleted;

        var date = new Date($scope.chores[0].duedate);
        console.log(date);

        for(var x = 0; x < $scope.chores.length; x++)
        {
        $scope.events.push(chore_to_event($scope.chores[x]));

        }

        $scope.loaded = true;
    })
    .error(function(error) {
        $scope.chores = $scope.chores_uncompleted;
        $scope.table = 'unresolved';
        console.log(error);
    });

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    console.log(d);
    console.log(m);
    console.log(y);
    console.log(date);
    var currentView = "month";
    
    // $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    // $scope.eventSource = {
    //         url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
    //         className: 'gcal-event',           // an option!
    //         currentTimezone: 'America/Chicago' // an option!
    // };
    /* event source that contains custom events on the scope */
    // $scope.events = [
    //   {title: 'All Day Event',start: new Date(y, m, 1)},
    //   {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
    //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
    //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
    //   {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
    //   {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    // ];
    // /* event source that calls a function on every view switch */
    // $scope.eventsF = function (start, end, callback) {
    //   var s = new Date(start).getTime() / 1000;
    //   var e = new Date(end).getTime() / 1000;
    //   var m = new Date(start).getMonth();
    //   //console.log(m);
    //   //console.log(e);

    //   var events = [{title: 'Feed Me ', start: new Date(y, m, d, 6, 0) , end: new Date(y, m, d, 24, 0), allDay: false, 
    //   className: ['customFeed'], editable: false}];
    //   callback(events);
    // };

    $scope.openModal = function () {

    var modalInstance = $modal.open({
      templateUrl: 'chores_edit_modal.html'
      });
    };

    $scope.alertOnEventClick = function( event, allDay, jsEvent, view ){

        $scope.alertMessage = (event.title + ' was clicked ');
        //$scope.openModal();
    };

    $scope.alertOnMouseHover = function(event, jsEvent, view){
        event.backgroundColor = 'yellow';
        $('#mycalendar').fullCalendar( 'rerenderEvents' );
    };

    // $scope.calEventsExt = {
    //    color: '#f00',
    //    textColor: 'yellow',
    //    events: [ 
    //       {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
    //       {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
    //       {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    //     ]
    // };
    /* alert on eventClick */



    // /* alert on Drop */
    //  $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
    //    $scope.alertMessage = ('Event Droped to make dayDelta ' + dayDelta);
    // };
    // /* alert on Resize */
    // $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
    //    $scope.alertMessage = ('Event Resized to make dayDelta ' + minuteDelta);
    // };
    /* add and removes an event source of choice */
    // $scope.addRemoveEventSource = function(sources,source) {
    //   var canAdd = 0;
    //   angular.forEach(sources,function(value, key){
    //     if(sources[key] === source){
    //       sources.splice(key,1);
    //       canAdd = 1;
    //     }
    //   });
    //   if(canAdd === 0){
    //     sources.push(source);
    //   }
    // };
    // /* add custom event*/
    // $scope.addEvent = function() {
    //   $scope.events.push({
    //     title: 'Open Sesame',
    //     start: new Date(y, m, 28),
    //     end: new Date(y, m, 29),
    //     className: ['openSesame']
    //   });
    // };
    // /* remove event */
    // $scope.remove = function(index) {
    //   $scope.events.splice(index,1);
    // };
    // /* Change View */
    // $scope.changeView = function(view,calendar) {
    //   calendar.fullCalendar('changeView',view);
    // };
    // /* Change View */
    // $scope.renderCalender = function(calendar) {
    //   calendar.fullCalendar('render');
    // };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick
        // eventDrop: $scope.alertOnDrop,
        // eventResize: $scope.alertOnResize
      }
    };

    //with this you can handle the events that generated when we change the view i.e. Month, Week and Day
    $scope.changeView = function(view,calendar) {
        currentView = view;
        calendar.fullCalendar('changeView',view);
        // $scope.$apply(function(){
        //   $scope.alertMessage = ('You are looking at '+ currentView);
        // });
    };

    // $scope.changeLang = function() {
    //   if($scope.changeTo === 'Hungarian'){
    //     $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
    //     $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
    //     $scope.changeTo= 'English';
    //   } else {
    //     $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    //     $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    //     $scope.changeTo = 'Hungarian';
    //   }
    // };
    /* event sources array*/
    // $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    // $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
    $scope.eventSources = [$scope.events];

    function chore_to_event(chore)
    {
        var a_event = {};
        var date = new Date(chore.duedate);
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        a_event.title = 'You are responsible for the chore "' + chore.name + '" by today!';
        a_event.start = new Date(y, m, d, 6, 0);
        a_event.end = new Date(y, m, d, 24, 0);
        a_event.allDay = false;
        a_event.editable = false;
        return a_event;
    }
	
	});

