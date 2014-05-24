// Calendar routes
// jshint camelcase: false

'use strict';

//var HistoryModel = require('../models/history').model;
//var HistoryCollection = require('../models/history').collection;

var Calendar = {
	setup: function(app) {
		app.get('/calendar', Calendar.GetIndex);
	},

	GetIndex: function(req, res) 
	{
		res.json(200, {title: 'hello'});
		return;
	}

}


module.exports = Calendar;