/* 
 * This is the model representation for a single .
 */

var Bookshelf = db;

var UserModel = require("./user").model;
var ApartmentModel = require("./apartment").model;

exports.model = Bookshelf.Model.extend({
	tableName: "chores",
	assignedUsers: function() {
		return this.belongsToMany(UserModel);
	},
	createdUser: function() {
		return this.belongsToOne(UserModel);
	},
	apartment: function() {
		return this.belongsToOne(ApartmentModel);
	}
});