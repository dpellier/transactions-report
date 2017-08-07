
const webpackConfig = require('./webpack.config');

module.exports = function karmaConfig (config) {
    config.set({
        frameworks: ['jasmine'],
        reporters: ['progress', 'coverage'],

        files: [
            'test/specs/tests.webpack.js'
        ],

        preprocessors: {
            'test/specs/tests.webpack.js': ['webpack', 'sourcemap']
        },

        browsers: ['PhantomJS'],
        singleRun: true,

        coverageReporter: {
            dir: 'test/coverage/',
            reporters: [
                {type: 'text-summary'},
                {type: 'html'},
                {type: 'lcov'}
            ]
        },

        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: 'errors-only'
        }
    });
};
