// Apartment routes

'use strict';

var ApartmentModel = require('../models/apartment').model;
var UserModel = require('../models/user').model;
var Users = require('../models/user').collection;
var Bills = require('../models/bill').collection;
var Chores = require('../models/chore').collection;
var Messages = require('../models/message').collection;
var Supplies = require('../models/supply').collection;
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
						res.json(200);
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
			.select('id', 'first_name', 'last_name', 'email', 'phone')
			.where('apartment_id', '=', apartmentId)
			.then(function(users) {
				res.json({users: users});
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
	    //authorization
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
			
			//delete associated users' tie to the apartment
			 new Users()
			.query('where', 'apartment_id', '=', apartment_id)
			.fetch()
			.then(function(collection) {	
				collection.mapThen(function(user) {
				    //delete  bills
					user.attributes.apartment_id = null;
					return user.save().then(function(x) {});
				})
				.then(function(users) {
					new Bills()
					.query('where', 'apartment_id', '=', apartment_id)
					.fetch()
					.then(function(bills) {
						bills.mapThen(function(bill) {
							bill.attributes.apartment_id = null;
							return bill.save().then(function(x) {});
						}).then(function(bills) {
							new Messages()
								.query('where', 'apartment_id', '=', apartment_id)
								.fetch()
								.then(function(messages) {
									messages.mapThen(function(messages) {
										messages.attributes.apartment_id = null;
										return message.save().then(function(x) {});
									})
									.then(function(messages) {
										new Chores()
										.query('where', 'apartment_id', '=', apartment_id)
										.fetch()
										.then(function(chore) {
											chore.mapThen(function(chore) {
												chore.attributes.apartment_id = null;
												return chore.save().then(function(x) {});
											})
											.then(function(chores) {
												new Supplies()
												.query('where', 'apartment_id', '=', apartment_id)
												.fetch()
												.then(function(supply) {
													supply.mapThen(function(supply) {
														supply.attributes.apartment_id = null;
														return supply.save().then(function(x) {});
													});
												});
											});
										});
									});
								});
						});
					}).otherwise(function(error) {
						console.log(error);
						res.json(400, {msg: 'error deleting apartment'});
					});
				}).then(function(users) {

					res.json(200);
				});
			})
			.otherwise(function(error) {
				res.json(400, {msg: 'error updating user'});
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
