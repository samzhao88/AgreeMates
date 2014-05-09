/*
 * This is the model representation for a single message
 * attributes:
 *   id           int,
 *   subject      string, the subject heading
 *   body         string, the body of the message
 *   date         date, the creation date
 *   user_id      int,
 *   apartment_id int,
 * invariant: no attributes can be null, user_id
 * 		and apartment_id reference an id in users and apartment respectively.
 */

'use strict';

var Bookshelf = require('bookshelf').DB;

var CommentModel = require('./comment').model;
var BoardModel = require('./board').model;

exports.model = Bookshelf.Model.extend({
	tableName: 'messages',
	comments: function() {
		return this.hasMany(CommentModel);
	},
	board: function() {
		return this.belongsTo(BoardModel);
	},
});

exports.collection = Bookshelf.Collection.extend({
	model: exports.model
});
