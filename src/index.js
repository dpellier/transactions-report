
require('@uirouter/angularjs');
require('normalize.css');
require('./index.scss');

import angular from 'angular';
import app from './app/app.js';

angular.element(document).ready(() => {
    angular.bootstrap(document, [app.name]);
});
