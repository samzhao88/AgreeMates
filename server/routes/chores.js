// Chore routes

'use strict';
var ChoreModel = require('../models/chore').model;
var ChoreCollection = require('../models/chore').collection;
var AssignyModel = require('../models/assigny').model;
var AssignyCollection = require('../models/assigny').collection;


var chores = function(app) {

  //Get all chores for an apartment
  app.get('/chores', function(req, res) {
    var apartmentId = req.user.attributes.apartment_id;
	
	new ChoreCollection({apartment_id: apartmentId})
	.fetch().
	then(function(model) {
		var chores = [];
		
		for(var i = 0; i < model.length; i++){
			var chore = model.models[i].attributes;
			var assignys = [];
			
			
			new AssignyCollection({chore_id: chore.id})
			.fetch()
			.then(function(assignModel){
				for(var j = 0; j < assignModel.length; j++){
					var assignys = assignModel.models[j].attributes;
					
			
			
				}
			})
			chores.push({
				id: chore.id,
				name: chore.name,
				createdate: chore.createdate,
				duedate: chore.duedate,
				interval: chore.interval,
				completed: chore.completed,
				reocurring_id: chore.reocurring_id,
				user_id: chore.user_id,
				apartment_id: chore.apartment_id
			});
		}
		
		res.json({chores: chores});
	}).otherwise(function(){
		res.json(503,{error: 'Database error.'});
	});
  });

  // Process chore form and adds to database
  app.post('/chores', function(req, res) {
		var name = req.body.name;
		var apartmentId = req.user.attributes.apartment_id;
		var userId = req.user.attributes.id;
		var duedate = req.body.duedate;
		var date = new Date();
		var createDate = (date.getMonth() + 1) + '/' + date.getDate()
			+'/' + date.getFullYear();

		var interval = req.body.interval;
		var roommates = JSON.parse(req.body.roommates);
	  
		 if(!isValidName(name)){
			res.json(400, {error: 'Invalid chore name.'});
			return;
		}
		
		// Need to check that date is valid ie on or after date created
		
		
		new ChoreModel({apartment_id: apartmentId,
					name: name,
					duedate: duedate,
					createdate: createDate,
					user_id: userId,
					completed: false,
					interval: interval,
					})
					.save()
					.then(function(model){
					for(var i = 0; i  < roommates.length; i++){
						new AssignyModel({
							completed: false,
							user_id: roommates[i].id,
							chore_id: model.id
						})
						.save().then(function(model){})
						.otherwise(function(error){
							res.json(503,{error: error});
						});
					}
					res.send(200);
					}).otherwise(function(error){
					res.json(503,{error: error});
				});
  });

  // Get the chore information
  app.get('/chores/:chore', function(req, res) {
    var apartmentId = req.user.attributes.apartment_id;
	var choreId = req.params.chore;
	if (!isValidId(choreId)) {
      res.json(400, {error: 'Invalid supply ID.'});
      return;
    }
	
	new ChoreModel({apartment_id: apartmentId, id: choreId})
		.fetch().then(function(model){
			var chore = model.attributes;
			res.json(chore);
		}).otherwise(function(){
			res.json(503,{error: 'Database error.'});
		});
	
  });

  // Update the chore
  app.put('/chores/:chore', function(req, res) {
	var apartmentId = req.user.attributes.apartment_id;
	var choreId = req.params.chore;
	var name = req.body.name;
	//var dueDate: req.body.date;
  });

  // Remove chore from database
  app.delete('/chores/:chore', function(req, res) {
    var apartmentId = req.user.attributes.apartment_id;
	
	var input  = JSON.parse(req.body);
	
	if(!(input)){
		var input = {};
		input.id = req.params.id;
	}
	
	if (!isValidId(input.id)) {
      res.json(400, {error: 'Invalid supply ID.'});
      return;
    }
	
	new ChoreModel({id: input.id, apartment_id: apartmentId})
		.destry()
		.then(function(){
			res.send(200);
		}).otherwise(function() {
			res.json(503, {error: 'Database error.'});
		});
  });
  
  //Checks if a chore name is valid
  function isValidName(name) {
    return name !== undefined && name !== null && name !== '';
  }

  // Checks if a chore ID is valid
  function isValidId(id) {
    return isInt(id) && id > 0;
  }
  
  function isInt(value) {
    /* jshint eqeqeq: false */
    return !isNaN(value) && parseInt(value) == value;
  }
};

module.exports = chores;
