var CronJob = require('cron').CronJob;
var ChoreModel = require('./models/chore').model;
var ChoreCollection = require('./models/chore').collection;
var UserChoreModel = require('./models/users_chores').model;
var UserChoreCollection = require('./models/users_chores').collection;
var UserModel = require('./models/user').model;
var Bookshelf = require('bookshelf');
var ChoreDao = require('./routes/choreDao');
			   //Sec, min, hours, day of month, months, day of week
				   // Set the cron job to 11:59 PM
var choreUpdateor = new CronJob('0 59 23 * * *', function(){
	var startDate = new Date();
	startDate.setHours(0);
	startDate.setMinutes(0);
	startDate.setSeconds(0);
	startDate.setMilliseconds(0);
	var endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
	endDate.setDate(endDate.getDate()+1);
	// Get all chores with duedate on same day
	Bookshelf.DB.knex('chores')
	.where('chores.duedate', '>=', startDate)
	.andWhere('chores.duedate', '<', endDate)
	.andWhere('chores.interval', '>', 0)
	.andWhere('chores.completed', '=', false)
	.then(function(resp){
		// Find users associated with the chore
		// Update the duedate
		// update the order_index of each user
		// Create chore
		resp.forEach(function(chore){ 
			//If we have a reocurring_id use that otherwise use the id of our parent.
			chore.reocurring_id = chore.reocurring_id || chore.id;
			incrementDate(chore.duedate, chore.interval); 
			Bookshelf.DB.knex('users_chores')
			.where('chore_id', '=', chore.id)
			.then(function(users_chores){
				var orderIndex = [];
				var users = [];
				for(var j = 0; j < users_chores.length; j++){
					//Rotating algorithm
					orderIndex[j] = (users_chores[j].order_index - chore.number_in_rotation);
					if(orderIndex[j] < 0){
						orderIndex[j] = orderIndex[j]+users_chores.length;
					}
					users[j] = users_chores[j].user_id;
				}
				ChoreDao.createChore(chore, users, orderIndex, function(){
				}, function(){
					console.error('Chore Cron Job: Error looking up chores');
				});
			});
		
		});
	}).otherwise(function(){
		console.error('Chore Cron Job: Error looking up chores');
	});
  }, function () {
    // This function is executed when the job stops
  },
  true, /* Start the job right now */
  null /* Time zone of this job. */
);

 //increment date by interval days
	  function incrementDate(dat, days) {
		return dat.setDate(dat.getDate() + days);
	}

module.exports = choreUpdateor;