# karma-simulator-launcher

A plugin for Karma 0.12 to launch Remote WebDriver instances(Appium with simulator).

## Usage

```bash
$ npm install karma-simulator-launcher
```

In your karma.conf.js file :

```javascript
module.exports = function(config) {
  config.set({
    customLaunchers: {
      'Safari-Ipad-Remote': {
        base: 'Simulator',
        browserName: 'Safari',
        platformName: 'iOS',
        platformVersion: '8.1',
        deviceName: 'iPad Air',
        config: appium
      }
    },
    browsers: ['Safari-Ipad-Remote']
  });
}
```

### pseudoActivityInterval
Interval in ms to do some activity to avoid killing session by timeout.

If not set or set to `0` - no activity will be performed.
