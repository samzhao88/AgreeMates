/* 
 * This is the model representation for a single user.
 */

var Bookshelf = require('bookshelf').pg;

var Comment = require("./comment").model;
var Message = require("./message").model;
var Chore = require("./chore").model;
var Bill = require("./bill").model;
var Payment = require("./payment").model;
var Aparment = require("./apartment").model;

exports.model = Bookshelf.Model.extend({
	tableName: "users",
	comments: function() {
		return this.hasMany(Comment);
	},
	messages: function() {
		return this.hasMany(Message);
	},
	createdChores: function() {
		return this.hasMany(Chore);
	},
	createdBills: function() {
		return this.hasMany(Bill);
	},
	payments: function() {
		return this.hasMany(Payment);
	},
	assignedChores: function() {
		return this.belongsToMany(Chore);
	},
	apartment: function() {
		return this.belongsToOne(Aparment);
	}
});