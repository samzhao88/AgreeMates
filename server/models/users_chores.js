/* 
 * This is the model representation for a single assignee.
 * attributes:
 *   id           int, 
 *   completed         boolean, true if the chore has been completed
 *   user_id      int, 
 *   chore_id      int,  
 * invariant:
 * 		No attributes can be null, user_id and apartment_id reference an 
 * 		id in users and apartment respectively.
 */

'use strict';

var Bookshelf = require('bookshelf').DB;

exports.model = Bookshelf.Model.extend({
	tableName: 'users_chores',
});

exports.collection = Bookshelf.Collection.extend({
	model: exports.model
});
