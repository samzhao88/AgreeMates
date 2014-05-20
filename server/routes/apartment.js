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
			.mapThen(function(user) {
				user.attributes.apartment_id = null;
				user.save();
				console.log("4");
			}).then(function(users) {
				//delete
				console.log("1");
				res.json(200);
			})
			.otherwise(function(error) {
				res.json(400, {msg: 'error updating user'});
				return;
			});

			//delete associated bills
			new Bills()
			.query('where', 'apartment_id', '=', apartment_id)
			.mapThen(function(bill) {
				// Destroy all the payments for a bill and then destroy
				// the bill.
				console.log("3");
				new PaymentModel()
				  .query('where', 'bill_id', '=', bill.attributes.id)
				  .destroy()
				  .then(function(payModel) {
					new BillModel()
					  .query('where', 'id', '=',  bill.attributes.id, 'AND',
							 'apartment_id', '=', apartment_id)
					  .destroy()
					  .then(function(model) {
						res.json(200);
					  }).otherwise(function(error) {
						res.json(503, {error: 'Delete payment error'})
					  });
				})
				.then(function(users) {
					//delete
					console.log("2");
					res.json(200);
				}).otherwise(function(error) {
					res.json(503, {error: 'Could not fetch payment'});
				});
			})
			.otherwise(function(error) {
				res.json(400, {msg: 'error deleting bills'});
				return;
			});

				//delete associated messages
			/*new Messages
			.query('where', 'apartment_id', '=', apartment_id)
			.mapThen(function(message) {
			})
			.otherwise(function(error) {
				res.json(400, {msg: 'error deleting messages'});
				return;
			}); */

				//delete associated chores
			/*new Chores
			.query('where', 'apartment_id', '=', apartment_id)
			.mapThen(function(chore) {

			})
			.otherwise(function(error) {
				res.json(400, {msg: 'error deleting chores'});
				return;
			});		*/
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
