/* 
 * This is the model representation for a single bill
 * attributes:
 *    id            int,
 *   name          string, the bill's name
 *   createdate    date, the creation date
 *   duedate       date, the due date
 *   interval      int
 					0 for one-time
 					1 for daily
 					2 for weekly
 					3 for monthly
 *   paid          boolean, true if bill has been paid false otherwise 
 *   amount        decimal, the amount due/paid 
 *   reocurring_id int, an id which maps this bill to other related bills 
 *   	(e.g april rent, may rent) 
 *   user_id       int, 
 *   apartment_id  int, 
 * invariant: interval > 0, amount > 0, no attributes can be null, user_id
 * 		and apartment_id reference an id in users and apartments respectively.
 */

'use strict';

var Bookshelf = require('bookshelf').DB;

var PaymentModel = require('./payment').model;
var ApartmentModel = require('./apartment').model;
var UserModel = require('./user').model;

exports.model = Bookshelf.Model.extend({
	tableName: 'bills',
	payment: function() {
		return this.hasMany(PaymentModel);
	},
	apartment: function() {
		return this.belongsToOne(ApartmentModel);
	},
	createdUser: function() {
		return this.belongsToOne(UserModel);
	},
});

exports.collection = Bookshelf.Collection.extend({
	model: exports.model
});
