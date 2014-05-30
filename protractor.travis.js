// An example configuration file.
exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'AgreeMates Protractor Tests'
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['e2e_tests/**/*.js'],

  framework: 'mocha',

  mochaOpts: {
    reporter: 'list'
  }
};
