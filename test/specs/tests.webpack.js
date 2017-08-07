
// This file is an entry point for angular tests
// Avoids some weird issues when using webpack + angular.

import 'angular';
import 'angular-mocks/angular-mocks';
import 'phantomjs-polyfill-find-index';

const context = require.context('../../src', true, /\.js$/);
context.keys().forEach(context);

const testContext = require.context('.', true, /\.spec\.js$/);
testContext.keys().forEach(testContext);
