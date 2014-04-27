/* 
 * This is the model representation for a single payment.
 */

var Bookshelf = require('bookshelf').pg;

var User = require("./user").model;
var Bill = require("./bill").model;

exports.model = Bookshelf.Model.extend({
	tableName: "payments",
	user: function() {
		return this.belongsToOne(User);
	},
	bill: function() {
		return this.belongsToOne(Bill);
	}
});