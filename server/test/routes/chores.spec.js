//Chores back endtests

'user strict';

require('../../app');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
var chores = require('../../routes/chores');
chai.use(sinonChai);

var succeedingStub = function(functionName, parameters) {
  return sinon.stub(chores, functionName, function(id, thenFun) {
    thenFun(parameters);
  });
};

var failingStub = function(functionName, parameters) {
  return sinon.stub(chores, functionName, function(id, thenFun, otherFun) {
    otherFun(parameters);
  });
};

var emptyStub = function(functionName) {
  return sinon.stub(chores, functionName);
};

var succeedDoubleStub = function(functionName, parameters){
	return sinon.stub(chores, functionName, function(param1,param2, thenFun, otherFun){
		thenFun(parameters);
	});
};

var failDoubleStub = function(functionName, parameters){
	return sinon.stub(chores, functionName, function(param1,param2, thenFun, otherFun){
		otherFun(parameters);
	});
};

describe('Chores', function(){
	describe('checkLogin', function(){
	
	var res, resMock;
	
	beforeEach(function(){
		res = {json: function(){}};
		resMock = sinon.mock(res);
	});

	afterEach(function(){
		resMock.verify();
	});

		it('should return 401 if user is undefined', function(){
			var req = {};
			resMock.expects('json').once().withArgs(401, {error: 'Unauthorized user.'});
			chores.checkLogin(req, res),function(){};
		});
	});

	describe('getChore', function(){
		var res, resMock;
		beforeEach(function(){
			res = {json: function(){}};
			resMock = sinon.mock(res);
		});

		afterEach(function(){
			resMock.verify();
		});
	
		it('fetches the chores', function(){
			var fetchChoresStub = emptyStub('fetchChores');
			var req1 = {user: {attributes:{apartment_id: 1}}};
			chores.getChores(req1, res);
			expect(fetchChoresStub).to.have.been.calledWith(1);
			fetchChoresStub.restore();
		});
		
		it('should fail with 503 Database error', function(){
			var fetchChoresStub = failingStub('fetchChores', null);
			var req1 = {user: {attributes:{apartment_id: 1}}};
			resMock.expects('json').once().withArgs(503, {error: 'Database error.'});
			chores.getChores(req1, res);
			expect(fetchChoresStub).to.have.been.calledWith(1);
			fetchChoresStub.restore();
		});
		
		it('should return empty json if rows in empty', function(){
			var fetchChoresStub = succeedingStub('fetchChores', []);
			var req1 = {user: {attributes:{apartment_id: 1}}};
			resMock.expects('json').once().withArgs({chores: []});
			chores.getChores(req1, res);
			expect(fetchChoresStub).to.have.been.calledWith(1);
			fetchChoresStub.restore();
		});
		
		it('should return a chore with a users field', function(){
			var fetchChoresStub = succeedingStub('fetchChores', [{chore_id: 1,
																name: 'test',
																createdate: '2016-05-08',
																duedate: '2016-09-09',
																interval: 3,
																completed: false,
																rotating: false,
																number_in_rotation: 1,
																user_id: 4,
																first_name: 'Dave',
																last_name: 'Drisel',
																order_index: 0
																}]);
			var req1 = {user: {attributes:{apartment_id: 1}}};
			resMock.expects('json').once().withArgs({chores: [{id: 1,
																name: 'test',
																createdate: '2016-05-08',
																duedate: '2016-09-09',
																interval: 3,
																completed: false,
																rotating: false,
																number_in_rotation: 1,
																users: [{
																	user_id: 4,
																	first_name: 'Dave',
																	last_name: 'Drisel',
																	order_index: 0
																	}]}]});
			chores.getChores(req1, res);
			expect(fetchChoresStub).to.have.been.calledWith(1);
			fetchChoresStub.restore();
		});
		
		it('should merge users assigned to a chore together and return a chore with users field', function(){
			var fetchChoresStub = succeedingStub('fetchChores', [{chore_id: 1,
																name: 'test',
																createdate: '2016-05-08',
																duedate: '2016-09-09',
																interval: 3,
																completed: false,
																rotating: false,
																number_in_rotation: 1,
																user_id: 4,
																first_name: 'Dave',
																last_name: 'Drisel',
																order_index: 0
																},
																{chore_id: 1,
																name: 'test',
																createdate: '2016-05-08',
																duedate: '2016-09-09',
																interval: 3,
																completed: false,
																rotating: false,
																number_in_rotation: 1,
																user_id: 6,
																first_name: 'Sam',
																last_name: 'Biscut',
																order_index: 1
																}]);
			var req1 = {user: {attributes:{apartment_id: 1}}};
			resMock.expects('json').once().withArgs({chores: [{id: 1,
																name: 'test',
																createdate: '2016-05-08',
																duedate: '2016-09-09',
																interval: 3,
																completed: false,
																rotating: false,
																number_in_rotation: 1,
																users: [{
																	user_id: 4,
																	first_name: 'Dave',
																	last_name: 'Drisel',
																	order_index: 0
																	},
																	{
																	user_id: 6,
																	first_name: 'Sam',
																	last_name: 'Biscut',
																	order_index: 1
																	}]}]});
			chores.getChores(req1, res);
			expect(fetchChoresStub).to.have.been.calledWith(1);
			fetchChoresStub.restore();
		});
		
		it('should not merge chores with different ids together', function(){
			var fetchChoresStub = succeedingStub('fetchChores', [{chore_id: 1,
																name: 'test',
																createdate: '2016-05-08',
																duedate: '2016-09-09',
																interval: 3,
																completed: false,
																rotating: false,
																number_in_rotation: 1,
																user_id: 4,
																first_name: 'Dave',
																last_name: 'Drisel',
																order_index: 0
																},
																{chore_id: 2,
																name: 'Mocktest',
																createdate: '2016-05-08',
																duedate: '2016-09-09',
																interval: 3,
																completed: false,
																rotating: false,
																number_in_rotation: 1,
																user_id: 6,
																first_name: 'Sam',
																last_name: 'Biscut',
																order_index: 1
																}]);
			var req1 = {user: {attributes:{apartment_id: 1}}};
			resMock.expects('json').once().withArgs({chores: [{id: 1,
																name: 'test',
																createdate: '2016-05-08',
																duedate: '2016-09-09',
																interval: 3,
																completed: false,
																rotating: false,
																number_in_rotation: 1,
																users: [{
																	user_id: 4,
																	first_name: 'Dave',
																	last_name: 'Drisel',
																	order_index: 0
																	}]},
																{
																id: 2,
																name: 'Mocktest',
																createdate: '2016-05-08',
																duedate: '2016-09-09',
																interval: 3,
																completed: false,
																rotating: false,
																number_in_rotation: 1,
																users:[{
																	user_id: 6,
																	first_name: 'Sam',
																	last_name: 'Biscut',
																	order_index: 1
																}]
																}]});
			chores.getChores(req1, res);
			expect(fetchChoresStub).to.have.been.calledWith(1);
			fetchChoresStub.restore();
		});
	});
	describe('addChore', function() {
	
	var res, resMock;

	beforeEach(function(){
		res = {json: function(){}};
		resMock = sinon.mock(res);
	});

	afterEach(function(){
		resMock.verify();
	});

		it('should return 400 if the chore name is invalid', function(){
			var req1 = {user: {attributes: {}}, body: {name: undefined, duedate: '2014-05-08'}};
			var req2 = {user: {attributes: {}}, body: {name: null, duedate: '2014-05-08'}};
			var req3 = {user: {attributes: {}}, body: {name: '', duedate: '2014-05-08'}};
			resMock.expects('json').thrice().withArgs(400, {error: 'Invalid chore name.'});
			chores.addChore(req1, res);
			chores.addChore(req2, res);
			chores.addChore(req3, res);
		});

		it('should return 400 if the interval is undefined or negative', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: undefined, duedate: '2014-05-08'}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', inverval: -1, duedate: '2014-05-08'}};
			resMock.expects('json').twice().withArgs(400, {error: 'Invalid interval.'});
			chores.addChore(req1, res);
			chores.addChore(req2, res);
		});

		it('should return 400 if the due date is before the current date', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2014-05-08'}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2013-05-08'}};
			var req3 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2013-06-08'}};
			resMock.expects('json').thrice().withArgs(400, {error: 'Invalid due date'});
			chores.addChore(req1, res);
			chores.addChore(req2, res);
			chores.addChore(req3, res);
		});

		it('should return 400 if the users assigned to the chore are invalid', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2020-05-08'}};
			resMock.expects('json').once().withArgs(400, {error: 'Invalid users assigned to chore'});
			chores.addChore(req1,res);
		});

		it('should return 400 if number_in_rotation is not an int', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2020-05-08', roommates: [1], number_in_rotation: .5}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2020-05-08', roommates: [1], number_in_rotation: undefined}};
			resMock.expects('json').twice().withArgs(400, {error: 'Invalid number in chore rotation'});
			chores.addChore(req1, res);
			chores.addChore(req2, res);
		});

		it('should return 400 if rotating chore and number_in_rotation less than zero', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2020-05-08', roommates: [1],number_in_rotation: 0, rotating: true}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2020-05-08', roommates: [1],number_in_rotation: -1, rotating: true}};
			resMock.expects('json').twice().withArgs(400, {error: 'Invalid number assigned per week'});
			chores.addChore(req1,res);
			chores.addChore(req2, res);
		});
		
	});

	describe('editChore',function(){
	
	var res, resMock;

	beforeEach(function(){
		res = {json: function(){}};
		resMock = sinon.mock(res);
	});

	afterEach(function(){
		resMock.verify();
	});

		it('should return 400 if the new chore duedate is invalid', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2014-05-08'},params: {chore: 1}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2013-05-08'},params: {chore: 1}};
			var req3 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2013-06-08'},params: {chore: 1}};
			resMock.expects('json').thrice().withArgs(400, {error: 'Invalid due date'});
			chores.editChore(req1, res);
			chores.editChore(req2, res);
			chores.editChore(req3, res);

		});

		it('should return 400 if the chore name is invalid',function(){
			var req1 = {user: {attributes: {}}, body: {name: '', interval: 0, duedate: '2020-05-08'}, params: {chore: 1}};
			var req2 = {user: {attributes: {}}, body: {name: undefined, interval: 0, duedate: '2020-05-08'},params: {chore: 1}};
			var req3 = {user: {attributes: {}}, body: {name: null, interval: 0, duedate: '2020-05-08'},params: {chore: 1}};
			resMock.expects('json').thrice().withArgs(400,{error: 'Invalid chore name.'});
			chores.editChore(req1, res);
			chores.editChore(req2, res);
			chores.editChore(req3, res);
		});

		it('should return 400 if the interval is undefined or negative', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: undefined, duedate: '2020-05-08'}, params: {chore: 1}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', inverval: -1, duedate: '2020-05-08'}, params: {chore: 1}};
			resMock.expects('json').twice().withArgs(400, {error: 'Invalid interval.'});
			chores.editChore(req1, res);
			chores.editChore(req2, res);
		});

		it('should return 400 if the roommates are invalid', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2020-05-08'},params: {chore: 1}};
			resMock.expects('json').once().withArgs(400, {error: 'Invalid users assigned to chore'});
			chores.editChore(req1,res);
		});

		it('should return 400 if number_in_rotation is not an int', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2020-05-08', roommates: [1], number_in_rotation: .5},params: {chore: 1}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2020-05-08', roommates: [1], number_in_rotation: undefined},params: {chore: 1}};
			resMock.expects('json').twice().withArgs(400, {error: 'Invalid number in chore rotation'});
			chores.editChore(req1, res);
			chores.editChore(req2, res);
		});

		it('should return 400 if rotating chore and number_in_rotation less than zero', function(){
			var req1 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2020-05-08', roommates: [1],number_in_rotation: 0, rotating: true},params: {chore: 1}};
			var req2 = {user: {attributes: {}}, body: {name: 'test', interval: 0, duedate: '2020-05-08', roommates: [1],number_in_rotation: -1, rotating: true},params: {chore: 1}};
			resMock.expects('json').twice().withArgs(400, {error: 'Invalid number assigned per week'});
			chores.editChore(req1,res);
			chores.editChore(req2, res);
		});

	});
	
	//Might need to verify apartment
	describe('deleteChore', function(){
		var res, resMock;

		beforeEach(function(){
			res = {json: function(){}, send: function() {} };
			resMock = sinon.mock(res);
		});

		afterEach(function(){
			resMock.verify();
		});
	
		it('should return 400 if chore id is invalid', function(){
			var req1 = {user: {attributes: {apartment_id: 1}}, params:{chore: -1}};
			var req2 = {user: {attributes: {apartment_id: 1}}, params:{chore: undefined}};
			resMock.expects('json').twice().withArgs(400, {error: 'Invalid chore ID.'});
			chores.deleteChore(req1,res);
			chores.deleteChore(req2,res);
		});
		
		it('should return 503 if database error in fetching chore', function(){
			var req1 = {user: {attributes: {apartment_id: 1}}, params:{chore: 4}};
			fetchChoreStub = failDoubleStub('fetchChore', null);
			resMock.expects('json').once().withArgs(503, {error: 'Database error'});
			chores.deleteChore(req1,res);
			expect(fetchChoreStub).to.have.been.calledWith(1);
			fetchChoreStub.restore();
		});
		
		
		
		it('should return 503 if database error when unassigning ', function(){
			var req1 = {user: {attributes: {apartment_id: 1}}, params:{chore: 4}};
			fetchChoreStub = succeedDoubleStub('fetchChore', 4);
			unassignUsersStub = failingStub('unassignUsers', null);
			resMock.expects('json').once().withArgs(503, {error: 'Database error'});
			chores.deleteChore(req1,res);
			expect(fetchChoreStub).to.have.been.calledWith(1);
			expect(unassignUsersStub).to.have.been.calledWith(4);
			fetchChoreStub.restore();
			unassignUsersStub.restore();
		});
		
		it('should return 503 if database error when removing the chore model itself', function(){
			var req1 = {user: {attributes: {apartment_id: 1}}, params:{chore: 4}};
			fetchChoreStub = succeedDoubleStub('fetchChore', null);
			unassignUsersStub = succeedingStub('unassignUsers', null);
			removeChoreStub = failDoubleStub('removeChore', null);
			resMock.expects('json').once().withArgs(503, {error: 'Database error'});
			chores.deleteChore(req1,res);
			expect(fetchChoreStub).to.have.been.calledWith(1);
			expect(unassignUsersStub).to.have.been.calledWith(4);
			expect(removeChoreStub).to.have.been.calledWith(1,4);
			fetchChoreStub.restore();
			unassignUsersStub.restore();
			removeChoreStub.restore();
		});
		
		it('should return 200 if chore is removed and history recorded properly', function(){
			var req1 = {user: {attributes: {first_name: 'Greg', last_name: 'Knickels',apartment_id: 1}}, params:{chore: 4}};
			var choreModel = {get: function(name){
												return 'dishes';
										}};
			fetchChoreStub = succeedDoubleStub('fetchChore', choreModel);
			unassignUsersStub = succeedingStub('unassignUsers', null);
			removeChoreStub = succeedDoubleStub('removeChore', null);
			addHistoryStub = failDoubleStub('addHistory',null);
			console.log('test');
			resMock.expects('json').once().withArgs(503, {error: 'Database error'});
			console.log('test');
			chores.deleteChore(req1,res);
			expect(fetchChoreStub).to.have.been.calledWith(1);
			expect(unassignUsersStub).to.have.been.calledWith(4);
			expect(removeChoreStub).to.have.been.calledWith(1,4);
			expect(addHistoryStub).to.have.been.calledWith(choreModel,'Greg Knickels deleted chore dishes');
			fetchChoreStub.restore();
			unassignUsersStub.restore();
			removeChoreStub.restore();
			addHistoryStub.restore();
		});
		
		it('should return 200 if chore is removed and history recorded properly', function(){
			var req1 = {user: {attributes: {first_name: 'Greg', last_name: 'Knickels',apartment_id: 1}}, params:{chore: 4}};
			var choreModel = {get: function(name){
												return 'dishes';
										}};
			fetchChoreStub = succeedDoubleStub('fetchChore', choreModel);
			unassignUsersStub = succeedingStub('unassignUsers', null);
			removeChoreStub = succeedDoubleStub('removeChore', null);
			addHistoryStub = succeedDoubleStub('addHistory',null);
			console.log('test');
			resMock.expects('send').once().withArgs(200);
			console.log('test');
			chores.deleteChore(req1,res);
			expect(fetchChoreStub).to.have.been.calledWith(1);
			expect(unassignUsersStub).to.have.been.calledWith(4);
			expect(removeChoreStub).to.have.been.calledWith(1,4);
			expect(addHistoryStub).to.have.been.calledWith(choreModel,'Greg Knickels deleted chore dishes');
			fetchChoreStub.restore();
			unassignUsersStub.restore();
			removeChoreStub.restore();
			addHistoryStub.restore();
		});
	});
});
