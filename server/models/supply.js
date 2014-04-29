/* 
 * This is the model representation for a single .
 */

var Bookshelf = db;

var Model = require("./").model;

exports.model = Bookshelf.Model.extend({
	tableName: "",
	: function() {
		return this.belongsToOne(Model);
	},
});