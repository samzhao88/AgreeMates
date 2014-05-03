/* 
 * This is the model representation for a single chore
 * attributes:
 *   id            int, 
 *   name          string, the chore's name 
 *   createdate    date, the creation dated
 *   duedate       date, the due date
 *   interval      int, the interval for the next bill in days (0 for not reocurring) 
 *   completed     boolean,  true if chore is completed
 *   reocurring_id int, maps this chore to other reocurring chores
 *   user_id       int, 
 *   apartment_id  int, 
 * invariant: interval > 0, no attributes can be null, user_id
 *            and apartment_id reference an id in users and apartments respectively.
 */

var Bookshelf = require('bookshelf').DB;

var UserModel = require("./user").model;
var ApartmentModel = require("./apartment").model;

exports.model = Bookshelf.Model.extend({
	tableName: "chores",
	assignedUsers: function() {
		return this.belongsToMany(UserModel);
	},
	createdUser: function() {
		return this.belongsToOne(UserModel);
	},
	apartment: function() {
		return this.belongsToOne(ApartmentModel);
	}
});

exports.collection = Bookshelf.Collection.extend({
	model: exports.model
});