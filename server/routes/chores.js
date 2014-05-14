// Chore routes

'use strict';
var ChoreModel = require('../models/chore').model;
var ChoreCollection = require('../models/chore').collection;
var UserChoreModel = require('../models/users_chores').model;
var UserChoreCollection = require('../models/users_chores').collection;
var Bookshelf = require('bookshelf'); 
var chores = function(app) {

  //Get all chores for an apartment
  app.get('/chores', function(req, res) {
	if (req.user === undefined) {
		res.json(401, {error: 'Unauthorized user.'});
		return;
	}
  
    var apartmentId = req.user.attributes.apartment_id;
	
	Bookshelf.DB.knex('chores')
		.join('users_chores', 'chores.id', '=', 'users_chores.chore_id')
		.join('users', 'users_chores.user_id', '=', 'users.id')
		.where('chores.apartment_id', '=', apartmentId)
		.select( 'chores.interval','chores.createdate', 
				'chores.duedate', 'users.first_name',
				'chores.name','chores.reocurring_id',
				'users_chores.user_id', 'users_chores.chore_id',
				'users_chores.order_index', 'chores.completed')
		.orderBy('users_chores.chore_id')
		.then(function(rows){
			var chores = [];
			var users_chores = [];
			if(rows.length === 0){
				res.json({chores: chores});
				return;
			}
			
			var lastChoreId = -1;
			var name, dueDate, createDate, interval, completed;
			for(var i = 0; i < rows.length; i++){
				//If choreid is differnet, then all users_chores for the current
				// chore have been pushed on users_chores. we push the chore then
				if(rows[i].chore_id != lastChoreId){
					if(lastChoreId !== -1){
						chores.push({
							id: lastChoreId,
							name: name,
							createDate: createDate,
							dueDate: dueDate,
							interval: interval,
							completed: completed,
							//reocurring_id: chore.reocurring_id,
							//user_id: chore.user_id,
							//apartment_id: chore.apartment_id,
							users_chores: users_chores
						});
					}
				//empty users_chores
				users_chores = [];
				lastChoreId = rows[i].chore_id;
				name = rows[i].name;
				createDate = rows[i].createdate;
				dueDate = rows[i].duedate;
				interval = rows[i].interval;
				completed = rows[i].completed;
				
				}
				
				users_chores.push({
					userId: rows[i].users_id,
					name: rows[i].first_name,
					order_index: rows[i].order_index
				});
			}
				chores.push({
					id: lastChoreId,
					name: name,
					createDate: createDate,
					dueDate: dueDate,
					interval: interval,
					completed: completed,
					users_chores: users_chores
				});
				res.json({chores: chores});
		})
		.otherwise(function(error){
			console.log(error);
			res.json(503, {error: 'Database error.'});
		});
  });
  
  
// Get the chore information
  app.get('/chores/:chore', function(req, res) {
  	if (req.user === undefined) {
		res.json(401, {error: 'Unauthorized user.'});
		return;
	}
    var apartmentId = req.user.attributes.apartment_id;
	var choreId = req.params.chore;
	
	if (!isValidId(choreId)) {
      res.json(400, {error: 'Invalid supply ID.'});
      return;
    }
	
	new ChoreModel({apartment_id: apartmentId, id: choreId})
		.fetch()
		.then(function(model){
			var chore = model.attributes;
			console.log(chore)
			var userChores = [];
			new UserChoreModel({chore_id: chore.id})
			.fetch()
			.then(function(ucModel){
			console.log(ucModel);
				for(var j = 0; j <ucModel.length; j++){
					var userChore = ucModel.models[i].attributes;
					console.log('sanity1');
					userChores.push({
						user_id: userChore.user_id,
						order_index: userChore.oder_index
					});
					if(j === ucModel.length - 1){
						res.json({chore: chore, users: userChores});
					}
				}
				console.log('fail');
			}).otherwise(function(){
				res.json(503, {error:'Database error'});
			});
		}).otherwise(function(){
			res.json(503,{error: 'Database error.'});
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
		//var roommates = req.body.roommates;
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
						new UserChoreModel({
							user_id: roommates[i].id,
							chore_id: model.id,
							order_index: i
						})
						.save()
						.then(function(choremodel){
						})
						.otherwise(function(){
							res.json(503, {error:'Database error'});
						});
						
						if(i === roommates.length-1){
							res.send(201);
						}
					}
					
					}).otherwise(function(){
					res.json(503,{error: 'DataBase error'});
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
					res.json(503,{error: 'Database error'});
				});
				
				if(i === roommates.length-1){
					res.send(201);
				}
			}
		}).otherwise(function(){
			res.json(503,{error: 'Database error'});
		});
	})
	.otherwise(function(){
		res.json(400, {error: 'Database error'});
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
	
	if (!isValidId(choreId)) {
      res.json(400, {error: 'Invalid supply ID.'});
      return;
    }
	
	new UserChoreModel().query('where', 'chore_id', '=', choreId)
		.destroy()
		.then(function(choremodel){
			new ChoreModel({id: choreId, apartment_id: apartmentId})
			.destroy()
			.then(function(){
				res.send(200);
			}).otherwise(function() {
				res.json(503, {error: 'Database error'});
			});				
		}).otherwise(function() {
			res.json(503, {error: 'Database error'})
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
