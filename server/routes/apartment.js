// Apartment routes

'use strict';

var ApartmentModel = require('../models/apartment').model;
var UserModel = require('../models/user').model;
var Users = require('../models/user').collection;
var Bills = require('../models/bill').collection;
var Chores = require('../models/chore').collection;
var Messages = require('../models/message').collection;
var Bookshelf = require('bookshelf');

var apartment = function(app) {

	// Adds an apartment to the database
	app.post('/apartment', function(req, res) {
		if (req.user === undefined) {
			res.json(401, {error: 'Unauthorized user.'});
			return;
		}

		var apartmentName = req.body.name;
		var apartmentAddress = req.body.address;

		if (!isValidName(apartmentName)) {
			res.json(400, {error: 'Invalid apartment name.'});
			return;
		} else if (!isValidName(apartmentAddress)) {
			res.json(400, {error: 'Invalid apartment address.'});
			return;
		}

		new ApartmentModel({name: apartmentName.trim(), address: apartmentAddress.trim()})
			.save()
			.then(function(model) {
				new UserModel({id: req.user.id})
					.save({apartment_id: model.attributes.id}, {patch: true})
					.then(function() {
						res.send(200);
					})
					.otherwise(function() {
						res.json(503, {error: 'Error adding user to the new apartment.'});
					});
			})
			.otherwise(function() {
				res.json(503, {error: 'Error adding new apartment'});
			});
	});

	// Gets all users in the apartment
	app.get('/apartment/users', function(req, res) {
		if (req.user === undefined) {
			res.json(401, {error: 'Unauthorized user.'});
			return;
		}

		var apartmentId = req.user.attributes.apartment_id;

		Bookshelf.DB.knex('users')
			.select('id', 'first_name', 'last_name', 'email', 'phone', 'facebook_id', 'google_id')
			.where('apartment_id', '=', apartmentId)
			.then(function(users) {
				var result = [];
				for (var i = 0; i < users.length; i++) {
					if (users[i].facebook_id !== null) {
						var temp = users[i];
						temp.profile_pic = 'https://graph.facebook.com/' +
							users[i].facebook_id  + '/picture?height=300&width=300';
						result.push(temp);
					} else {
						var temp = users[i];
						temp.profile_pic = 'http://placehold.it/300x300';
						result.push(temp);
					}
				}
				res.json({users: result});
			})
			.otherwise(function(error) {
				res.json(503, {error: 'Database error.'});
			});
	});

	// Gets an apartment's information
	app.get('/apartment', function(req, res) {
		if (req.user === undefined) {
			res.json(401, {error: 'Unauthorized user.'});
			return;
		}

		var apartmentId = req.user.attributes.apartment_id;

		Bookshelf.DB.knex('apartments')
			.where('apartments.id', '=', apartmentId)
			.then(function(rows) {
				res.json(rows[0]);
			})
			.otherwise(function() {
				res.json(503, {error: 'Database error.'});
			});
	});

	// Edits an apartment's information
	app.put('/apartment', function(req, res) {
		if (req.user === undefined) {
			res.json(401, {error: 'Unauthorized user.'});
			return;
		}

		var apartmentId = req.user.attributes.apartment_id;
		var apartmentName = req.body.name;
		var apartmentAddress = req.body.address;

		if (!isValidName(apartmentName)) {
			res.json(400, {error: 'Invalid apartment name.'});
			return;
		}

		var update = {};
		update.name = apartmentName.trim();
		if (isValidName(apartmentAddress)) {
			update.address = apartmentAddress.trim();
		}

		new ApartmentModel({id: apartmentId})
			.save(update, {patch: true})
			.then(function() {
				res.json(200);
			})
			.otherwise(function() {
				res.json(504, {error: 'Database error.'});
			});
	});

	  // Removes apartment from the database
	  // Needs to delete all the other models not just break ties
	app.delete('/apartment', function(req, res) {
		if (req.user === undefined) {
			res.json(401, {error: 'Unauthorized user.'});
			return;
		}
		if(req.user== null || req.query == null) {
				res.json(400, {msg: 'invalid request'});
				return;
		}
		var apartment_id = req.user.attributes.apartment_id;
		var user_id = req.user.id;
		if(user_id != null && apartment_id != null) {
			console.log(req.params.apt);
			console.log(apartment_id);
			if(apartment_id != req.params.apt) {
					res.json(400, {msg: 'unauthorized'});
					return;
			}
			//delete associated users
			new Users({apartment_id : apartment_id})
			.fetch().then(function(users) {
				for(var i = 0; i < users.length; i++) {
					users.models[i].attributes.apartment_id = null;
					users.models[i].save().then(function(x){});
				}


				//delete associated bills
				new Bills({apartment_id : apartment_id})
				.fetch().then(function(bills) {
					for(var i = 0; i < bills.length; i++) {
						bills.models[i].attributes.apartment_id = null;
						bills.models[i].save();
					}

					//delete associated messages
					new Messages({apartment_id : apartment_id})
					.fetch().then(function(messages) {
						for(var i = 0; i < messages.length; i++) {
							messages.models[i].attributes.apartment_id = null;
							messages.models[i].save();
						}

						//delete associated chores
						new Chores({apartment_id : apartment_id})
						.fetch().then(function(chores) {
							for(var i = 0; i < chores.length; i++) {
								chores.models[i].attributes.apartment_id = null;
								chores.models[i].save();
							}
						})
						.otherwise(function(error) {
							res.json(400, {msg: 'error deleting chores'});
							return;
						});
					})
					.otherwise(function(error) {
						res.json(400, {msg: 'error deleting messages'});
						return;
					});
				})
				.otherwise(function(error) {
					res.json(400, {msg: 'error deleting bills'});
					return;
				});
				//delete
				var apartment = new ApartmentModel({id : apartment_id});
				apartment.destroy()
				.then(function(apartment) {
					res.json({result : 'success'});
				})
				.otherwise(function(error) {
					console.log(error);
					res.json(400, {msg: 'derror deleting apartment'});
					return;
				});
			}).otherwise(function(error) {
					res.json(400, {msg: 'error deleting apartment'});
					return;
			});
		} else {
			res.json(401, {msg: 'could not fetch id'});
		}
	});

	// Checks if a name is valid
	function isValidName(name) {
		return name !== undefined && name !== null && name.trim() !== '';
	}

	// Checks if an ID is valid
	function isValidId(id) {
		return isInt(id) && id > 0;
	}

	// Checks if a value is an integer
	function isInt(value) {
		/* jshint eqeqeq: false */
		return !isNaN(value) && parseInt(value) == value;
	}

};

module.exports = apartment;
