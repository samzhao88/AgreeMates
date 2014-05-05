/* 
 * This is the model representation for a single supply
 * attributes:
 *   id           int, 
 *   apartment_id int, 
 *   name         string, the supply name 
 *   status       int, 1 if empty, 2 if low, 3 if well stocked 
 * invariant: status = 1|2|3 No attributes can be null, 
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
