/* 
 * This is the model representation for a single payment.
 */

var Bookshelf = db;

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