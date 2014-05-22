// Chore routes

'use strict';
var ChoreModel = require('../models/chore').model;
var ChoreCollection = require('../models/chore').collection;
var UserChoreModel = require('../models/users_chores').model;
var UserChoreCollection = require('../models/users_chores').collection;
var UserModel = require('../models/user').model;
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
				'chores.duedate', 'users.first_name','users.last_name',
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
				//If choreid is differt, then all users_chores for the current
				// chore have been pushed on users_chores. we push the chore then
				if(rows[i].chore_id != lastChoreId){
					if(lastChoreId !== -1){
						chores.push({
							id: lastChoreId,
							name: name,
							createdate: createDate,
							duedate: dueDate,
							interval: interval,
							completed: completed,
							//reocurring_id: chore.reocurring_id,
							//user_id: chore.user_id,
							//apartment_id: chore.apartment_id,
							users: users_chores
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
					user_id: rows[i].user_id,
					first_name: rows[i].first_name,
					last_name: rows[i].last_name,
					order_index: rows[i].order_index
				});
			}
				chores.push({
					id: lastChoreId,
					name: name,
					createdate: createDate,
					duedate: dueDate,
					interval: interval,
					completed: completed,
					users: users_chores
				});
				res.json({chores: chores});
		})
		.otherwise(function(error){
			res.json(503, {error: 'Database error.'});
		});
  });


<<<<<<< Updated upstream
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
			var userChores = [];
			new UserChoreModel({chore_id: chore.id})
			.fetch()
			.then(function(ucModel){
				for(var j = 0; j <ucModel.length; j++){
					var userChore = ucModel.models[i].attributes;
					userChores.push({
						user_id: userChore.user_id,
						order_index: userChore.oder_index
					});
					if(j === ucModel.length - 1){
						res.json({chore: chore, users: userChores});
					}
				}
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
=======
	function addChore(req,res){

>>>>>>> Stashed changes
		var name = req.body.name;
		var apartmentId = req.body.apartment_id;
		var userId = req.body.userId;
		var duedate = req.body.duedate;
<<<<<<< Updated upstream
		var date = new Date();
		var createDate = (date.getMonth() + 1) + '/' + date.getDate()
			+'/' + date.getFullYear();

=======
		var createdate = new Date();
>>>>>>> Stashed changes
		var interval = req.body.interval;


		var roommates = req.body.roommates;
		//var roommates = req.body.roommates;
		if(!isValidName(name)){
			res.json(400, {error: 'Invalid chore name.'});
			return;
		}
		// Call service class here that creates new chore (chore service)
		// choreservice.create(params)
		// returns a response

		// Need to check that date is valid ie on or after date created

		new ChoreModel({apartment_id: apartmentId,
					name: name,
					duedate: duedate,
					createdate: createDate,
					user_id: userId,
					completed: false,
					interval: interval,
<<<<<<< Updated upstream
					})
					.save()
					.then(function(choreModel){
					var userChore = [];
					// Build up user to chore mapping to write to the database
					// work around do to model representation not working
					for(var i = 0; i  < roommates.length; i++){
						userChore[i] = new UserChoreModel({
								user_id: roommates[i],
								chore_id: choreModel.id,
								order_index: i
							});

					}
					/*Save away our array of users to new chore
					mapThen :Function to call for each element in the collection
					Collects the return value of all of the function calls into a single response
					then(function(resp)): takes the response built by the mapThen and verify
					that the size of the array is equal to the number of user ids giving in the request.
					*/
					new UserChoreCollection(userChore)
					.mapThen(function(model){
						return model.save()
						.then(function(){
							return new UserModel({id: model.get('user_id')})
							.fetch()
							.then(function(userM){
								return modelToUser(userM, model.get('order_index'));
							});
						});
					}).then(function(resp){

						var response = {chore: choreModel.attributes, users: resp};
						if(resp.length !== userChore.length){
							res.json(503,{error: 'DataBase error'});
						}else{
=======
					rotating: rotating,
					number_in_rotation: number_in_rotation};
		console.log(newChore);
		ChoreDao.createChore(newChore, roommates, null,
						function(choreModel, userResp){
						var response = {chore: choreModel.attributes, users: userResp};
						if(userResp.length !== roommates.length){
							res.json(503,{error: 'DataBase error'});
						}
						else
						{
							new UserModel({id: choreModel.get('user_id')}).
							fetch()
							.then(function(userModel){ 
							
								var historyString = userModel.get('first_name') + ' ' +
								userModel.get('last_name')+ ' created chore ' + choreModel.get('name');
								
								new HistoryModel({apartment_id: choreModel.get('apartment_id'),
													history_string: historyString,
													date: new Date()})
													.save()
													.then(function(){})
													.otherwise(function(error){console.log(error)});
							});
>>>>>>> Stashed changes
							res.send(200, response);
						}
					})

					}).otherwise(function(){
						res.json(503,{error: 'DataBaser error'});
				});
  });

 function modelToUser(userModel, order_index){
	return {user_id: userModel.get('id'), first_name: userModel.get('first_name'),
			last_name: userModel.get('last_name'), order_index: order_index};
 }


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
	var roommates = req.body.roommates;
  var interval = req.body.interval;


	new ChoreModel({apartment_id: apartmentId, id: choreId})
	.save({name: name.trim(), duedate: dueDate, interval: interval},{patch: true})
	.then(function(choreModel) {
	// Go through users_chores assocaited with chore
		new UserChoreModel().query('where', 'chore_id', '=', choreId)
		.destroy()
		.then(function(ucmodel){
			/*Make this a function call*/
			var userChore = [];
					// Build up user to chore mapping to write to the database
					// work around do to model representation not working
					for(var i = 0; i  < roommates.length; i++){
						userChore[i] = new UserChoreModel({
								user_id: roommates[i],
								chore_id: choreModel.id,
								order_index: i
							});
					}
					/*Save away our array of users to new chore
					mapThen :Function to call for each element in the collection
					Collects the return value of all of the function calls into a single response
					then(function(resp)): takes the response built by the mapThen and verify
					that the size of the array is equal to the number of user ids giving in the request.
					*/
					new UserChoreCollection(userChore)
					.mapThen(function(model){
						return model.save()
						.then(function(){
						});
					}).then(function(resp){
						var response = {chore: choreModel.attributes, assignedUsers: resp};
						if(resp.length !== userChore.length){
							res.json(503,{error: 'DataBase error'});
						}else{
							res.send(200, userChore);
						}
					})

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

<<<<<<< Updated upstream
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
=======
function setup(app){
	 app.get('/chores', checkLogin,getChores);
	 app.post('/chores', checkLogin, addChore);
	 app.post('/chores/complete/:chore', checkLogin, completeChore);
	 app.put('/chores/:chore', checkLogin,editChore);
	  app.delete('/chores/:chore', checkLogin, deleteChore);
 }
 
module.exports.getChores = getChores;
module.exports.addChore = addChore;
module.exports.completeChore = completeChore;
module.exports.editChore = editChore;
module.exports.deleteChore = deleteChore;
module.exports.setup = setup;
module.exports.checkLogin = checkLogin;
>>>>>>> Stashed changes
