/* 
 * This is the model representation for a single .
 */

var Bookshelf = db;

var MessageModel = require("./message").model;
var UserModel = require("./user").model;

exports.model = Bookshelf.Model.extend({
	tableName: "comments",
	message: function() {
		return this.belongsToOne(MessageModel);
	},
	user: function() {
		return this.belongsToOne(UserModel);
	},
});