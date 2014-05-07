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
});
