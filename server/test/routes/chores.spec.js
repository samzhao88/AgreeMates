//Chores back endtests

'user strict';

var app = require('../../app');
var chores = require('../../routes/chores');
var sinon = require('sinon');

describe('Chores', function(){

	var res, resMock;
	
	beforeEach(function(){
		res = {json: function(){}};
		resMock = sinon.mock(res);
	});

	afterEach(function(){
		resMock.verify();
	});
	
	describe('checkLogin', function(){
		
		it('should return 401 if user is undefined', function(){
			var req = {};
			resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
			chores.checkLogin(req, res),function(){};
		});
	});
	
	describe('addChore', function() {
		it('should return 400 if the chore name is invalid', function(){
			var req1 = {user: {attributes: {}}, body: {name: undefined}};
			var req2 = {user: {attributes: {}}, body: {name: null}};
			var req3 = {user: {attributes: {}}, body: {name: ''}};
			resMock.expects('json').thrice().withArgs(400, {error: 'Invalid chore name.'});
			chores.addChore(req1, res);
			chores.addChore(req2, res);
			chores.addChore(req3, res);
		});
		
		it('should return 400 if the interval is undefined or negative', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: undefined}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', inverval: -1}};
			resMock.expects('json').twice().withArgs(400, {error: 'Invalid interval.'});
			chores.addChore(req1, res);
			chores.addChore(req2, res);
		});
	
		it('should return 400 if the due date is before the current date', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: 05/20/2014}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: "May 15, 2014 11:13:00"}};
			var req3 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: "December 31, 2000 11:13:00"}};
			resMock.expects('json').thrice().withArgs(400, {error: 'Invalid due date'});
			chores.addChore(req1, res);
			chores.addChore(req2, res);
			chores.addChore(req3, res);
		});
		
		it('should return 400 if the users assigned to the chore are invalid', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: "December 31, 2020 11:13:00"}};
			resMock.expects('json').once().withArgs(400, {error: 'Invalid users assigned to chore'});
			chores.addChore(req1,res);
		});
		
		it('should return 400 if number_in_rotation is not an int', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: "December 31, 2020 11:13:00", roommates: [1], number_in_rotation: .5}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: "December 31, 2020 11:13:00", roommates: [1], number_in_rotation: undefined}};
			resMock.expects('json').twice().withArgs(400, {error: 'Invalid number in chore rotation'});
			chores.addChore(req1, res);
			chores.addChore(req2, res);
		});
		
		it('should return 400 if rotating chore and number_in_rotation less than zero', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: "December 31, 2020 11:13:00", roommates: [1],number_in_rotation: 0, rotating: true}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: "December 31, 2020 11:13:00", roommates: [1],number_in_rotation: -1, rotating: true}};
			resMock.expects('json').twice().withArgs(400, {error: 'Invalid number assigned per week'});
			chores.addChore(req1,res);
			chores.addChore(req2, res);
		});
	});
	
	describe('editChore',function(){
		it('should return 400 if the new chore duedate is invalid', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: 05/20/2014},params: {chore: 1}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: 05/29/2013},params: {chore: 1}};
			var req3 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: 06/29/2013},params: {chore: 1}};
			resMock.expects('json').thrice().withArgs(400, {error: 'Invalid due date'});
			chores.editChore(req1, res);
			chores.editChore(req2, res);
			chores.editChore(req3, res);
		
		});
		
		it('should return 400 if the chore name is invalid',function(){
			var req1 = {user: {attributes: {}}, body: {name: '', interval: 0, duedate: "December 31, 2020 11:13:00"}, params: {chore: 1}};
			var req2 = {user: {attributes: {}}, body: {name: undefined, interval: 0, duedate: "December 31, 2020 11:13:00"},params: {chore: 1}};
			var req3 = {user: {attributes: {}}, body: {name: null, interval: 0, duedate: "December 31, 2020 11:13:00"},params: {chore: 1}};
			resMock.expects('json').thrice().withArgs(400,{error: 'Invalid chore name.'});
			chores.editChore(req1, res);
			chores.editChore(req2, res);
			chores.editChore(req3, res);
		});
		
		it('should return 400 if the interval is undefined or negative', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: undefined}, params: {chore: 1}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', inverval: -1}, params: {chore: 1}};
			resMock.expects('json').twice().withArgs(400, {error: 'Invalid interval.'});
			chores.editChore(req1, res);
			chores.editChore(req2, res);
		});
		
		it('should return 400 if the roommates are invalid', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: "December 31, 2020 11:13:00"},params: {chore: 1}};
			resMock.expects('json').once().withArgs(400, {error: 'Invalid users assigned to chore'});
			chores.addChore(req1,res);
		});
		
		it('should return 400 if number_in_rotation is not an int', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: "December 31, 2020 11:13:00", roommates: [1], number_in_rotation: .5},params: {chore: 1}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: "December 31, 2020 11:13:00", roommates: [1], number_in_rotation: undefined},params: {chore: 1}};
			resMock.expects('json').twice().withArgs(400, {error: 'Invalid number in chore rotation'});
			chores.addChore(req1, res);
			chores.addChore(req2, res);
		});
		
		it('should return 400 if rotating chore and number_in_rotation less than zero', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: "December 31, 2020 11:13:00", roommates: [1],number_in_rotation: 0, rotating: true},params: {chore: 1}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: "December 31, 2020 11:13:00", roommates: [1],number_in_rotation: -1, rotating: true},params: {chore: 1}};
			resMock.expects('json').twice().withArgs(400, {error: 'Invalid number assigned per week'});
			chores.addChore(req1,res);
			chores.addChore(req2, res);
		});
		
		//Revise still passing
		it('should return 400 if rotating chore and number_in_rotation less than zero', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: "December 31, 2020 11:13:00", roommates: [1],number_in_rotation: 1, rotating: true},params: {chore: 0.5}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: "December 31, 2020 11:13:00", roommates: [1],number_in_rotation: 1, rotating: true},params: {chore: "test"}};
			resMock.expects('json').twice().withArgs(400,{error: 'Invalid chore id'});
			chores.addChore(req1,res);
			chores.addChore(req2, res);
		});
	});
});