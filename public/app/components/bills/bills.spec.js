'use strict';

var expect = chai.expect;

describe('bills module', function() {
  var module;
  before(function() {
    module = angular.module('main.bills');
  });

  it('should be registered', function() {
    expect(module).not.to.equal(null);
  });

  it('should have a BillsCtrl controller', function() {
    expect(module.BillsCtrl).not.to.equal(null);
  });
});
