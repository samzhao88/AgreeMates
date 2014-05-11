// Apartment routes fix errors

'use strict';
//load apartment models and collections
var ApartmentModel = require('../models/apartment').model;
var UserModel = require('../models/user').model;
var Users = require('../models/user').collection;
var Bills = require('../models/bill').collection;
var Chores = require('../models/chore').collection;
var Messages = require('../models/message').collection;

var apartment = function(app) {

	  // Add apartment to database
	app.post('/apartment', function(req, res) {
		if(req.body != null && req.user != null) {
			//name and address from post body
			var name = req.body.name;
			var address = req.body.address;
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
				res.json(402, {msg: 'error adding apartment'});
			  });
		} else {
			res.json(401, {msg: 'couldnt fetch request parameters'});
		}
	});

	  // Get edit apartment page information
	  app.get('/apartment', function(req, res) {
		if(req.user != null) {
			var id = req.user.attributes.apartment_id;
			if(id != null) {
				new ApartmentModel({id : id})
					.fetch()
					.then(function(apartment) {
							res.json({result : 'success', apartment : apartment});
							})
					.otherwise(function(error) {
						res.json(402, {msg: 'error getting apartment'});
					});
			} else {
				res.json(401, {msg:'could not fetch id'});
			}
		} else {
			res.json(401, {msg: 'could not fetch user'});
		}
	});

	  // Edit apartment in database
	app.put('/apartment', function(req, res) {
		if(req.user != null && req.body != null) {
			var apartment_id = req.user.attributes.apartment_id;
			var user_id = req.user.id;
			if(user_id != null && apartment_id != null) {
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
							res.json(402, {msg: 'error getting apartment'});
						});
			} else {
				res.json(401, {msg: 'could not fetch id'});
			}
		} else {
			res.json(401, {msg: 'could not fetch user'});
		}
	});

	  // Removes apartment from the database
	app.delete('/apartment', function(req, res) {
		var apartment_id = req.user.attributes.apartment_id;
		var user_id = req.user.id;
		if(user_id != null && apartment_id != null) {
		
			//delete associated users
			new Users({apartment_id : apartment_id})
			.fetch().then(function(users) {
				for(var i = 0; i < users.length; i++) {
					users.models[i].attributes.apartment_id = null;
					users.models[i].save();
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
							res.json(401, {msg: 'error deleting chores'});
							return;
						});
					})
					.otherwise(function(error) {
						res.json(401, {msg: 'error deleting messages'});
						return;
					});
				})
				.otherwise(function(error) {
					res.json(401, {msg: 'error deleting bills'});
					return;
				});
				//delete
				var apartment = new ApartmentModel({id : apartment_id});	
				apartment.destroy()
				.then(function(apartment) {
					res.json({result : 'success'});
				})
				.otherwise(function(error) {
					res.json(401, {msg: 'error adding apartment'});
					return;
				});
			}).otherwise(function(error) {
					res.json(401, {msg: 'error adding apartment'});
					return;
			});
		} else {
			res.json(401, {msg: 'could not fetch id'});
		}
	});
};

module.exports = apartment;
