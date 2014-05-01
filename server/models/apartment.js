/* 
 * This is the model representation for a single apartment
 */

var Bookshelf = require('bookshelf').DB;

var BoardModel = require("./board").model;
var SupplyModel = require("./supply").model;
var ChoreModel = require("./chore").model;
var BillModel = require("./bill").model;
var UserModel = require("./user").model;

exports.model = Bookshelf.Model.extend({
	tableName: "apartments",
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
		return this.belongsToMany(UserModel);
	},
});

exports.collection = Bookshelf.Collection.extend({
	model: exports.model
});