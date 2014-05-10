// Apartment routes

'use strict';

var ApartmentModel = require('../models/apartment').model;
var UserModel = require('../models/user').model;

var apartment = function(app) {

  // Add apartment to database
  app.post('/apartment', function(req, res) {
    var name = req.body.name;
    var address = req.body.address;
    new ApartmentModel({name: name, address: address})
      .save()
      .then(function(model) {
        new UserModel({id: req.user.id})
          /*jshint camelcase: false */
          .save({apartment_id: model.id}, {patch: true})
          .then(function() {
            res.json({result : 'success'});
          });
      })
      .otherwise(function(error) {
        res.json({result : 'error', error : error});
      });
  });

  // Get edit apartment page information
  app.get('/apartment', function(req, res) {
	var id = req.user.attributes.apartment_id;
	if(id != null) {
		new ApartmentModel({id : id})
			.fetch()
			.then(function(apartment) {
					res.json({result : 'success', apartment : apartment});
					})
			.otherwise(function(error) {
				res.json({result : 'error', error : error});
			});
	} else {
		res.json({result : 'error',
		error : {status: { code: 401, msg:'could not fetch id'}}
		});
	}
	});

  // Edit apartment in database
  app.put('/apartment', function(req, res) {
    res.end();
  });

  // Removes apartment from the database
  app.delete('/apartment', function(req, res) {
    var apartment_id = req.user.attributes.apartment_id;
	var user_id = req.user.id;
	console.log(apartment_id);
	if(user_id != null && apartment_id != null) {
	  new UserModel({id: user_id})
			  /*jshint camelcase: false */
			  .save({apartment_id: null}, {patch: true})
			  .then(function() {
				console.log("WORKSS");
				res.json({result : 'success'});
			  })
		  .otherwise(function(error) {
			res.json({result : 'error', error : error});
		  });
		new ApartmentModel({id : apartment_id})
			.destroy()
			.then(function(apartment) {
					res.json({result : 'success'});
					})
			.otherwise(function(error) {
				res.json({result : 'error', error : error});
			});
	} else {
		res.json({result : 'error'});
	}
  });

};

module.exports = apartment;
