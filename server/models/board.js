/*
 * This is the model representation for a single board.
 *	attributes: none
 *	invariant: none
 */

'use strict';

var Bookshelf = require('bookshelf').DB;

var MessageModel = require('./message').model;
var ApartmentModel = require('./apartment').model;

exports.model = Bookshelf.Model.extend({
	tableName: 'boards',
	messages: function() {
		return this.hasMany(MessageModel);
	},
	apartment: function() {
		return this.belongsTo(ApartmentModel);
	}
});

exports.collection = Bookshelf.Collection.extend({
	model: exports.model
});
