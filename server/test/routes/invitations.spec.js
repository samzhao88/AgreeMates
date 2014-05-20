// jshint camelcase: false
'use strict';

var app = require('../../app');
require('../../models/user').model;
require('../../models/apartment').model;
var invitations = require('../../routes/invitations');

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

//var agent = request.agent(app);

describe('Invitations', function() {
  describe('addInvitations', function() {
    var res;
    var resMock;

    beforeEach(function() {
      res = { json: function() {} };
      resMock = sinon.mock(res);
    });

    afterEach(function() {
      resMock.verify();
    });

    it('returns 400 if no user', function() {
      var req = {body: 'blah'};
      resMock.expects('json').once().
        withArgs(400, {error: 'Missing user or body'});

      invitations.addInvitations(req, res);
    });

    it('returns 400 if no body', function() {
      var req = {user: 'Some User'};
      resMock.expects('json').once().
        withArgs(400, {error: 'Missing user or body'});

      invitations.addInvitations(req, res);
    });
  });

});

/*
describe('Invitations API', function() {

  describe('while not logged in', function() {
    it('POST /invitations returns 400', function(done) {
      agent
        .post('/invitations')
        .set('Content-Type', 'application/json')
        .send({emails: []})
        .expect(400, done);
    });
  });

  describe('while logged in', function() {
    this.timeout(5000);

    var user_id;
    var apt_id;

    app.post('/testsignin', function(req, res) {
      req.session.passport.user = user_id;
      res.send(200);
    });


    before(function(done) {

      new ApartmentModel({name: 'test', address: 'test'})
        .save()
        .then(function(apartment) {
          apt_id = apartment.id;
          new UserModel({apartment_id: apartment.id,
                        first_name: 'test',
                        last_name: 'user',
                        email: 'some.email@example.com'})
            .save()
            .then(function(user) {
              user_id = user.id;
              done();
            });
        });
    });

    after(function(done) {
      new UserModel({id: user_id})
        .destroy()
        .then(function() {
          new ApartmentModel({id: apt_id})
            .destroy()
            .then(function() {
              done();
            });
        });
    });

    beforeEach(function(done) {
      agent.post('/testsignin').end(done);
    });

    describe('POST /invitations', function() {

      it('returns 200 with proper data', function(done) {
        agent
          .post('/invitations')
          .set('Content-Type', 'application/json')
          .send({emails: []})
          .expect(200, done);
      });

      it('returns 400 if no body', function(done) {
        agent
          .post('/invitations')
          .set('Content-Type', 'application/json')
          .expect(400, done);
      });
    });

    describe('GET /invitations/:invite', function() {
      it('renders invitation accept view if the invitation exists');
      it('returns 404 if the invitation does not exist');
      it('returns 404 if the apartment does not exist');
    });

    describe('DELETE /invitations/:invite', function() {
      it('returns 200 if the invitation was destroyed properly');
      it('returns 503 if invitation failed to be destroyed');
      it('returns 503 if the user was not added to the apartment');
      it('returns 404 if the invitation does not exist');
    });

  });

});
*/
