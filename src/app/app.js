
import angular from 'angular';
import commonModule from './common/common.js';
import headerModule from './header/header.js';
import importModule from './import/import.js';
import reportModule from './report/report.js';

export default angular.module('transactions-report', [
    'ui.router',
    commonModule.name,
    headerModule.name,
    importModule.name,
    reportModule.name
])
    .config(($locationProvider, $stateProvider, $urlMatcherFactoryProvider, $urlRouterProvider) => {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $urlMatcherFactoryProvider.strictMode(false);
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('app', {
                abstract: true,
                views: {
                    app: {
                        template: '<ui-view />'
                    },
                    header: {
                        template: require('./header/header.html')
                    }
                }
            })
            .state('app.import', {
                url: '',
                template: require('./import/import.html'),
                controller: 'importCtrl',
                controllerAs: 'controller'
            })
            .state('app.report', {
                url: '/report',
                template: require('./report/report.html'),
                controller: 'reportCtrl',
                controllerAs: 'controller'
            });
    });
