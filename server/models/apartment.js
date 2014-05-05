/* 
 * This is the model representation for a single apartment
 * attributes: id			int,
 *  		   name         string, the apartment's name
 *             address      string, the apartment's address
 * invariant: id != null, address != null
 */

'use strict';

var Bookshelf = require('bookshelf').DB;

var BoardModel = require('./board').model;
var SupplyModel = require('./supply').model;
var ChoreModel = require('./chore').model;
var BillModel = require('./bill').model;
var UserModel = require('./user').model;

exports.model = Bookshelf.Model.extend({
	tableName: 'apartments',
	board: function() {
		return this.hasOne(BoardModel);
	},
	supplies: function() {
		return this.hasMany(SupplyModel);
	},
	ownedChores: function() {
		return this.hasMany(ChoreModel);
	},
	ownedBills: function() {
		return this.hasMany(BillModel);
	},
	users: function() {
		return this.hasMany(UserModel);
	},
});

exports.collection = Bookshelf.Collection.extend({
	model: exports.model
});
