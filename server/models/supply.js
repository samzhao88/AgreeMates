/* 
 * This is the model representation for a single supply
 */

var Bookshelf = require('bookshelf').DB;

var ApartmentModel = require("./apartment").model;

exports.model = Bookshelf.Model.extend({
	tableName: "supplies",
	apartment: function() {
		return this.belongsTo(ApartmentModel);
	},
});

exports.collection = Bookshelf.Collection.extend({
	model: exports.model
});