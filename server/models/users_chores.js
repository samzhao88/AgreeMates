/* 
 * This is the model representation for a single assignee.
 * attributes:
 *   id           int, 
 *   order_index   int,
 *   user_id      int, 
 *   chore_id      int,  
 * invariant:
 * 		No attributes can be null, user_id
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
