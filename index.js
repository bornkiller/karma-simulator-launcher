var wd = require('wd');
var _ = require('underscore');
var urlparse = require('url').parse;
var urlformat = require('url').format;

var SimulatorInstance = function (baseBrowserDecorator, args, logger) {
  var log = logger.create('WebDriver');

  var config = args.config || {
    hostname: '127.0.0.1',
    port: 4723
  };
  var self = this;

  // Initialize with default values
  var spec = {
    platformName: 'iOS',
    platformVersion: '8.1',
    browserName: 'Safari',
    deviceName: 'iPhone Simulator',
    testName: 'Karma WebDriver Simulator'
  };

  spec = _.extend(spec, _.omit(args, 'config'));

  if (!spec.browserName) {
    throw new Error('WebDriver Simulator BrowserName Required!');
  }

  baseBrowserDecorator(this);

  this.name = spec.browserName + ' via Remote WebDriver Simulator';

  this._start = function (url) {
    var urlObj = urlparse(url, true);

    delete urlObj.search; //url.format does not want search attribute
    url = urlformat(urlObj);

    log.debug('WebDriver Simulator config: ' + JSON.stringify(config));
    log.debug('Simulator Browser capabilities: ' + JSON.stringify(spec));

    self.browser = wd.remote(config, 'promiseChain').init(spec);

    var interval = args.pseudoActivityInterval && setInterval(function() {
      log.debug('Imitate activity');
      self.browser.title();
    }, args.pseudoActivityInterval);

    self.browser.get(url).done();

    self._process = {
      kill: function() {
        interval && clearInterval(interval);
        self.browser.quit(function() {
          log.info('Killed ' + spec.testName + '.');
          self._onProcessExit(self.error ? -1 : 0, self.error);
        });
      }
    };
  };

  // We can't really force browser to quit so just avoid warning about SIGKILL
  this._onKillTimeout = function(){};
};

SimulatorInstance.prototype = {
  name: 'Simulator',

  DEFAULT_CMD: {
    linux: require('wd').path,
    darwin: require('wd').path,
    win32: require('wd').path
  },
  ENV_CMD: 'WEBDRIVER_BIN'
};

SimulatorInstance.$inject = ['baseBrowserDecorator', 'args', 'logger'];

// PUBLISH DI MODULE
module.exports = {
  'launcher:Simulator': ['type', SimulatorInstance]
};
