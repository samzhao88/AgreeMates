/* 
 * This is the model representation for a single user.
 * attributes:
 *   id           int,
 *   google_id    string, google id for login
 *	 facebook_id  string, facebook id for login
 *   first_name   string, user's first name
 *   last_name    string, user's last name
 *   email        string, user's email
 *   phone        int, the user's phone number
 *   apartment_id int,  
 * invariant: id, first/last name and email cannot be null, apartment_id 
 * 		references apartments, email and phone number are well formatted
 */

'use strict';

var Bookshelf = require('bookshelf').DB;

var CommentModel = require('./comment').model;
var MessageModel = require('./message').model;
var ChoreModel = require('./chore').model;
var BillModel = require('./bill').model;
var PaymentModel = require('./payment').model;
var ApartmentModel = require('./apartment').model;

exports.model = Bookshelf.Model.extend({
	tableName: 'users',
	comments: function() {
		return this.hasMany(CommentModel);
	},
	messages: function() {
		return this.hasMany(MessageModel);
	},
	createdChores: function() {
		return this.hasMany(ChoreModel);
	},
	createdBills: function() {
		return this.hasMany(BillModel);
	},
	payments: function() {
		return this.hasMany(PaymentModel);
	},
	assignedChores: function() {
		return this.belongsToMany(ChoreModel);
	},
	apartment: function() {
		return this.belongsToOne(ApartmentModel);
	}
});

exports.collection = Bookshelf.Collection.extend({
	model: exports.model
});

