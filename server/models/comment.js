/* 
 * This is the model representation for a single comment
 * This is the model representation for a single chore
 * attributes:
 *   id         int, 
 *   body       string, the string body of the comment 
 *   date       string, the creation date
 *   user_id    int, 
 *   message_id int,
 * invariant: no attributes can be null, user_id
 *            and message_id reference an id in users and messages respectively.
 */

var Bookshelf = require('bookshelf').DB;

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

exports.collection = Bookshelf.Collection.extend({
	model: exports.model
});