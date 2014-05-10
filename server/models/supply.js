/*
 * This is the model representation for a single supply
 * attributes:
 *   id           int,
 *   apartment_id int,
 *   name         string, the supply name
 *   status       int, 0 if empty, 1 if low, 2 if well stocked
 * invariant: status = 0|1|2 No attributes can be null, 
 * 		apartment_id references apartments.
 */

'use strict';

var Bookshelf = require('bookshelf').DB;

var ApartmentModel = require('./apartment').model;

exports.model = Bookshelf.Model.extend({
	tableName: 'supplies',
	apartment: function() {
		return this.belongsTo(ApartmentModel);
	},
});

exports.collection = Bookshelf.Collection.extend({
	model: exports.model
});
