/* 
 * This is the model representation for a single .
 */

var Bookshelf = db;

var CommentModel = require("./comment").model;
var BoardModel = require("./board").model;

exports.model = Bookshelf.Model.extend({
	tableName: "",
	comment : function() {
		return this.hasMany(CommentModel);
	},
	board : function() {
		return this.belongsToOne(BoardModel);
	},
});