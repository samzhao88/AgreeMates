/* 
 * This is the model representation for a single bill
 */

var Bookshelf = require('bookshelf').DB;

var PaymentModel = require("./payment").model;
var ApartmentModel = require("./apartment").model;
var ApartmentModel = require("./apartment").model;

exports.model = Bookshelf.Model.extend({
	tableName: "bills",
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