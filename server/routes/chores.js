// Chore routes

'use strict';

var ChoreModel = require('../models/chore').model;
var ChoreCollection = require('../models/chore').collection;
var UserChoreModel = require('../models/users_chores').model;
var UserChoreCollection = require('../models/users_chores').collection;
var async = require("async");

var chores = function(app) {

  //Get all chores for an apartment
  app.get('/chores', function(req, res) {

    res.json({chores: [{name: "dishes", interval: 7, users: ["alice" , "bob" ] },
    {name: "garbage", interval: 1, users: "bob"} ] });

	if (req.user === undefined) {
		res.json(401, {error: 'Unauthorized user.'});
		return;
	}
  
    var apartmentId = req.user.attributes.apartment_id;
	
	new ChoreCollection({apartment_id: apartmentId})
	.fetch()
	.then(function(model) {
		var chores = [];
		
		for(var i = 0; i < model.length; i++){
			var chore = model.models[i].attributes;
			
			var userChores = [];
			/*var userChoreModels = model.models[i].relations.users_chores;
			console.log(userChoreModels);
			for (var j = 0; j < userChoreModels.length; j++){
				
				var userChore = userChoreModels.models[j].attributes;
				userChores.push({
					user_id: userChore.user_id,
					order_index: userChore.order_index
				});
			}*/
			new UserChoreCollection({chore_id: chore.id})
			.fetch()
			.then(function(ucModel){
			console.log('Sanity');
				for(var j = 0; j <ucModel.length; j++){
					var userChore = ucModel.models[i].attributes;
					userChores.push({
						user_id: userChore.user_id,
						order_index: userChore.oder_index
					});
				}
			}).otherwise(function(){
				res.json(503, 'Database error');
			});
			
			chores.push({
				id: chore.id,
				name: chore.name,
				createdate: chore.createdate,
				duedate: chore.duedate,
				interval: chore.interval,
				completed: chore.completed,
				reocurring_id: chore.reocurring_id,
				user_id: chore.user_id,
				apartment_id: chore.apartment_id,
				userChores: userChores
			});
		}
		res.json({chores: chores});
	}).otherwise(function(){
		res.json(503, 'Database error');
	});
  });

  // Process chore form and adds to database
  app.post('/chores', function(req, res) {
	if (req.user === undefined) {
		res.json(401, {error: 'Unauthorized user.'});
		return;
	}
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
					console.log('test');
					for(var i = 0; i  < roommates.length; i++){
					console.log('test');
						new UserChoreModel({
							user_id: roommates[i].id,
							chore_id: model.id,
							order_index: i
						})
						.save()
						.then(function(choremodel){
						})
						.otherwise(function(){
							res.json(503,'Database error');
						});
						
						if(i === roommates.length-1){
						res.send(200);
						}
					}
					
					}).otherwise(function(){
					res.json(503,'DataBase error');
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
	if (req.user === undefined) {
		res.json(401, {error: 'Unauthorized user.'});
		return;
	}
	
	
	var apartmentId = req.user.attributes.apartment_id;
	var choreId = req.params.chore;
	var name = req.body.name;
	var dueDate = req.body.duedate;
	var roommates = JSON.parse(req.body.roommates);
	
	new ChoreModel({apartment_id: apartmentId, id: choreId})
	.save({name: name.trim(), duedate: dueDate},{patch: true})
	.then(function(model) {
	// Go through users_chores assocaited with chore
		new UserChoreModel().query('where', 'chore_id', '=', choreId)
		.destroy()
		.then(function(choremodel){
			for(var i = 0; i  < roommates.length; i++){
	
				new UserChoreModel({
					user_id: roommates[i].id,
					chore_id: model.id,
					order_index: i
				})
				.save()
				.then(function(choremodel){
				})
				.otherwise(function(){
					res.json(503,'Database error');
				});
				
				if(i === roommates.length-1){
					res.send(200);
				}
			}
		}).otherwise(function(){
			res.json(503,'Database error');
		});
	})
	.otherwise(function(){
		res.json(400, 'Database error');
	});
  });

  // Remove chore from database
  app.delete('/chores/:chore', function(req, res) {
	if (req.user === undefined) {
		res.json(401, {error: 'Unauthorized user.'});
		return;
	}
	
    var apartmentId = req.user.attributes.apartment_id;
	
	var choreId = req.params.chore;
	
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
