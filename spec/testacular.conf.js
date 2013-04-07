// Testacular configuration
// Generated on Mon Mar 04 2013 23:48:49 GMT+0000 (GMT)


// base path, that will be used to resolve files and exclude
basePath = '..';


// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'public/js/lib/augment.js/augment.min.js',
  'spec/javascripts/*Providers/*.js',
  'public/js/DIContainer.js',
  'public/js/ExpiryManager.js',
  'public/js/Scrolling.js',
  'public/js/Landscaper.js',
  'public/js/editor/landscaper/tools/LandscapingTool.js',
  'public/js/editor/landscaper/tools/*.js',
  'spec/javascripts/*Spec.js'
];


// list of files to exclude
exclude = [
  'spec/javascripts/PlayerSpec.js'
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
