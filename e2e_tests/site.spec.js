'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('agreemates homepage', function() {
  it('shows login page', function() {
    browser.driver.get('http://localhost:3000');

    var loginTitle = browser.driver.findElement(by.id('login-title'));
    var loginDescription = browser.driver.findElement(by.id('login-description'));

    expect(loginTitle.getText()).to.eventually.equal('AgreeMates');
    expect(loginDescription.getText()).to.eventually.equal('Make living with roommates easier.');
  });
});
