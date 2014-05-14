// Apartment routes

'use strict';
//load apartment models and collections
var ApartmentModel = require('../models/apartment').model;
var UserModel = require('../models/user').model;
var Users = require('../models/user').collection;
var Bills = require('../models/bill').collection;
var Chores = require('../models/chore').collection;
var Messages = require('../models/message').collection;
var Bookshelf = require('bookshelf');

var apartment = function(app) {

	  // Add apartment to database
	app.post('/apartment', function(req, res) {
		if (req.user === undefined) {
			res.json(401, {error: 'Unauthorized user.'});
			return;
		}
		if(req.body != null && req.user != null) {
			if(req.user.id == null) {
				res.json(400, {msg: 'invalid id'});
				return;
			}
			//name and address from post body
			var name = req.body.name;
			var address = req.body.address;
			if(name == null || address == null) {
				res.json(400, {msg: 'invalid request parameters'});
				return;
			}
			//create apartment
			new ApartmentModel({name: name, address: address})
			  .save()
			  .then(function(model) {
				//update user's apartment
				new UserModel({id: req.user.id})
				  /*jshint camelcase: false */
				  .save({apartment_id: model.id}, {patch: true})
				  .then(function() {
					res.json({result : 'success'});
				});
			  })
			  .otherwise(function(error) {
				res.json(401, {msg: 'error adding apartment'});
			  });
		} else {
			res.json(400, {msg: 'couldnt fetch request parameters'});
		}
	});

	  // Get edit apartment page information
	  app.get('/apartment/:apt', function(req, res) {
		if (req.user === undefined) {
			res.json(401, {error: 'Unauthorized user.'});
			return;
		}
		if(req.user != null && req.query != null) {
			var id = req.user.attributes.apartment_id;
			console.log(id);
			if(id != null) {
				if(id != req.params.apt) {
					res.json(400, {msg: 'unauthorized'});
					return;
				}
				var u;
				new Users({apartment_id : id})
				.fetch()
				.then(function(users) {
						u = users;
				})
				.otherwise(function(users) {
					res.json(401,{msg: 'error getting users'});
				});
				new ApartmentModel({id : id})
					.fetch()
					.then(function(apartment) {
							res.json(200, {apartment : apartment, users : u});
							})
					.otherwise(function(error) {
						res.json(400, {msg: 'error getting apartment'});
					});
			} else {
				res.json(401, {msg:'could not fetch id'});
			}
		} else {
			res.json(400, {msg: 'could not fetch user'});
		}
	});

	// Gets all users in an apartment
	app.get('/apartment/:apt/users', function(req, res) {
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

	  // Edit apartment in database
	app.put('/apartment/:apt', function(req, res) {
		if (req.user === undefined) {
			res.json(401, {error: 'Unauthorized user.'});
			return;
		}
		if(req.user != null && req.body != null) {
			var apartment_id = req.user.attributes.apartment_id;
			var user_id = req.user.id;
			if(user_id != null && apartment_id != null) {
				if(apartment_id != req.params.apt) {
					res.json(400, {msg: 'unauthorized'});
					return;
				}
				new ApartmentModel({id : apartment_id})
						.fetch()
						//alter aparmtent attributes with parameters from the body
						.then(function(apartment) {
							apartment.attributes.name = req.body.name;
							apartment.attributes.address = req.body.address;
							apartment.save();
							res.json({result : 'success'});
						})
						.otherwise(function(error) {
							res.json(400, {msg: 'error getting apartment'});
						});
			} else {
				res.json(401, {msg: 'could not fetch id'});
			}
		} else {
			res.json(401, {msg: 'could not fetch user'});
		}
	});

	  // Removes apartment from the database
	  // Needs to delete all the other models not just break ties
	app.delete('/apartment/:apt', function(req, res) {
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
};

module.exports = apartment;
