// jshint camelcase: false
'use strict';

require('../../app');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var invitations = require('../../routes/invitations');

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

    it('returns 404 if no user id', function() {
      var req = {body: 'blah', user: {attributes: {}}};
      resMock.expects('json').once().
        withArgs(404, {error: 'could not fetch id'});

      invitations.addInvitations(req, res);
    });

    it('fetches the apartment if request is correct', function() {
      var fetchApartmentStub = sinon.stub(invitations, 'fetchApartment');
      var req = {body: {emails: []}, user: {attributes: {apartment_id: 1}}};

      invitations.addInvitations(req, res);

      expect(fetchApartmentStub).to.have.been.calledWith(1);
      fetchApartmentStub.restore();
    });

    it('creates and saves all invitations if apartment is found', function() {
      var fetchApartmentStub = sinon.stub(invitations, 'fetchApartment',
        function(apartmentId, thenFunction) {
          thenFunction({attributes: {name: 'test apartment'}});
        });
      var createInvitationStub = sinon.stub(invitations, 'createInvitation',
        function(apartmentId, email) {
          return {apartment_id: apartmentId, email: email};
        });
      var saveInvitationsStub = sinon.stub(invitations, 'saveInvitations');

      var req = {body: {emails: ['test1@example.com', 'test2@example.com']},
                 user: {attributes: {apartment_id: 1}}};

      invitations.addInvitations(req, res);

      expect(createInvitationStub).to.have.been.calledTwice;
      expect(createInvitationStub).to.have.been.
        calledWith(1, 'test1@example.com');
      expect(createInvitationStub).to.have.been.
        calledWith(1, 'test2@example.com');
      expect(saveInvitationsStub).to.have.been.calledOnce;
      expect(saveInvitationsStub).to.have.been.
        calledWith([{apartment_id: 1, email: 'test1@example.com'},
                    {apartment_id: 1, email: 'test2@example.com'}]);

      fetchApartmentStub.restore();
      createInvitationStub.restore();
      saveInvitationsStub.restore();
    });

    it('returns 503 if failed to save all invitations', function() {
      var fetchApartmentStub = sinon.stub(invitations, 'fetchApartment',
        function(apartmentId, thenFunction) {
          thenFunction({attributes: {name: 'test apartment'}});
        });
      var createInvitationStub = sinon.stub(invitations, 'createInvitation',
        function(apartmentId, email) {
          return {apartment_id: apartmentId, email: email};
        });
      var saveInvitationsStub = sinon.stub(invitations, 'saveInvitations',
        function(invitations, responseFunction) {
          var resp = []; // no saved invitations
          responseFunction(resp);
        });

      var req = {body: {emails: ['test1@example.com', 'test2@example.com']},
                 user: {attributes: {apartment_id: 1}}};

      resMock.expects('json').once().
        withArgs(503, {error: 'Error creating invitations'});

      invitations.addInvitations(req, res);

      fetchApartmentStub.restore();
      createInvitationStub.restore();
      saveInvitationsStub.restore();
    });

    it('sends emails for each saved invitation when all save', function() {
      var fetchApartmentStub = sinon.stub(invitations, 'fetchApartment',
        function(apartmentId, thenFunction) {
          thenFunction({attributes: {name: 'test apartment'}});
        });
      var createInvitationStub = sinon.stub(invitations, 'createInvitation',
        function(apartmentId, email) {
          return {apartment_id: apartmentId, email: email};
        });
      var saveInvitationsStub = sinon.stub(invitations, 'saveInvitations',
        function(invitations, responseFunction) {
          var resp = [{id: 1, email: 'test1@example.com'},
            {id: 2, email: 'test2@example.com'}];
          responseFunction(resp);
        });
      var sendInvitationStub = sinon.stub(invitations, 'sendInvitation');

      var req = {body: {emails: ['test1@example.com', 'test2@example.com']},
                 user: {attributes: {apartment_id: 1}}};

      resMock.expects('json').once().
        withArgs([{email: 'test1@example.com', id: 1},
                 {email: 'test2@example.com', id: 2}]);

      invitations.addInvitations(req, res);

      expect(sendInvitationStub).to.have.been.
        calledWith(1, 'test1@example.com', 'test apartment');
      expect(sendInvitationStub).to.have.been.
        calledWith(2, 'test2@example.com', 'test apartment');

      fetchApartmentStub.restore();
      createInvitationStub.restore();
      saveInvitationsStub.restore();
      sendInvitationStub.restore();
    });

    it('returns 404 if failed to fetch apartment', function() {
      var fetchApartmentStub = sinon.stub(invitations, 'fetchApartment',
        function(apartmentId, thenFun, otherwiseFun) {
        otherwiseFun();
      });
      var req = {body: {emails: []}, user: {attributes: {apartment_id: 1}}};

      resMock.expects('json').once().
        withArgs(404, {error: 'error getting apartment'});
      invitations.addInvitations(req, res);

      expect(fetchApartmentStub).to.have.been.calledWith(1);
      fetchApartmentStub.restore();
    });
  });
});

