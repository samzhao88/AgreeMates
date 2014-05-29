// History front end unit tests

'use strict';

var expect = chai.expect;

describe('HistoryCtrl', function() {

  var historyModule, httpMock, scope;

  var testHistory = {
    history: [
      {
        apartment_id: 1,
        date: '2014-05-29T06:54:23.085Z',
        history_string: 'First Last edited chore "Clean"',
        id: 4
      },
      {
        apartment_id: 1,
        date: '2014-05-29T06:45:23.085Z',
        history_string: 'First Last deleted bill "Rent"',
        id: 3
      }
    ]
  };

  var testMoreHistory = {
    history: [
      {
        apartment_id: 1,
        date: '2014-05-29T06:32:23.085Z',
        history_string: 'First Last added chore "Clean"',
        id: 2
      },
      {
        apartment_id: 1,
        date: '2014-05-29T06:13:23.085Z',
        history_string: 'First Last added bill "Rent"',
        id: 1
      }
    ]
  };

  beforeEach(function() {
    historyModule = module('main.history');
  });

  beforeEach(inject(function($controller, $rootScope, $httpBackend) {
    httpMock = $httpBackend;
    scope = $rootScope.$new();
    $controller('HistoryCtrl', {
      $scope: scope
    });

    httpMock.whenGET('/history').respond(testHistory);
    httpMock.whenGET('/history/' + 3).respond(testMoreHistory);
  }));

  afterEach(function() {
    httpMock.verifyNoOutstandingExpectation();
    httpMock.verifyNoOutstandingRequest();
  });

  it('should register the history module', function() {
    expect(historyModule).not.to.equal(null);
    httpMock.flush();
  });

  it('should set $scope.history correctly on page load', function() {
    httpMock.expectGET('/history').respond(testHistory);
    httpMock.flush();

    expect(scope.history).to.eql(testHistory.history);
  });

  it('should return false on showNothingMoreMessage() by default', function() {
    httpMock.flush();

    expect(scope.showNothingMoreMessage()).to.equal(false);
  });

  it('should return more history on loadMore() if exists', function() {
    var expectedHistory = testHistory.history.concat(testMoreHistory.history);

    httpMock.flush();
    httpMock.expectGET('/history/' + 3).respond(testMoreHistory);

    scope.loadMore();
    httpMock.flush();

    expect(scope.history.length).to.equal(4);
    expect(scope.history).to.eql(expectedHistory);
  });

  it('should change nothing on loadMore() if empty history', function() {
    httpMock.flush();
    scope.history = [];
    scope.loadMore();

    expect(scope.history.length).to.equal(0);
  });

  it('should return whether history is empty on emptyHistory()', function() {
    httpMock.flush();

    expect(scope.emptyHistory()).to.equal(false);
    scope.history = [];
    expect(scope.emptyHistory()).to.equal(true);
  });

});
