/* 
 * This is the model representation for a single board.
 */

var Bookshelf = db;

var MessageModel = require("./message").model;
var ApartmentModel = require("./apartment").model;

exports.model = Bookshelf.Model.extend({
	tableName: "boards",
	message: function() {
		return this.hasMany(MessageModel);
	},
	apartment: function() {
		return this.belongsToOne(ApartmentModel);
	}
});