/* 
 * This is the model representation for a single supply
 */

var Bookshelf = require('bookshelf').db;

var ApartmentModel = require("./apartment").model;

exports.model = Bookshelf.Model.extend({
	tableName: "supplies",
	apartment: function() {
		return this.belongsToOne(ApartmentModel);
	},
});