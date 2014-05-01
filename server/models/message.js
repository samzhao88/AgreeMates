/* 
 * This is the model representation for a single message
 */

var Bookshelf = require('bookshelf').DB;

var CommentModel = require("./comment").model;
var BoardModel = require("./board").model;

exports.model = Bookshelf.Model.extend({
	tableName: "message",
	comment : function() {
		return this.hasMany(CommentModel);
	},
	board : function() {
		return this.belongsToOne(BoardModel);
	},
});