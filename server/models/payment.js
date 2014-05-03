/* 
 * This is the model representation for a single payment.
 * attributes:
 *   id           int, 
 *   paid         boolean, true if the payment has been placed
 *   amount       decimal, the ammount to be paid
 *   user_id      int, 
 *   bill_id      int,  
 * invariant: amount > 0 and  amount < the bill's total. No attributes can be null, user_id
 *            and apartment_id reference an id in users and apartment respectively.
 */

var Bookshelf = require('bookshelf').DB;

var UserModel = require("./user").model;
var BillModel = require("./bill").model;

exports.model = Bookshelf.Model.extend({
	tableName: "payments",
	user: function() {
		return this.belongsToOne(UserModel);
	},
	bill: function() {
		return this.belongsToOne(BillModel);
	}
});

exports.collection = Bookshelf.Collection.extend({
	model: exports.model
});