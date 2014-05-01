/* 
 * This is the model representation for a single user.
 */

var Bookshelf = require('bookshelf').DB;


var CommentModel = require("./comment").model;
var MessageModel = require("./message").model;
var ChoreModel = require("./chore").model;
var BillModel = require("./bill").model;
var PaymentModel = require("./payment").model;
var AparmentModel = require("./apartment").model;
var UserModel = require("./user").model;

exports.model = Bookshelf.Model.extend({
	tableName: "users",
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
	model: UserModel
});

