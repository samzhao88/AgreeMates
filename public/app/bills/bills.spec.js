'use strict';

var expect = chai.expect;

describe('BillsCtrl', function() {
  beforeEach(angular.mock.module('main'));

  it('should exist', function() {
    expect(main.bills.BillsCtrl).not.to.equal(null);
  });
});
