'use strict';

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const ENV = process.env.NODE_ENV || 'local';
const isTest = ENV === 'test';
const isLocal = ENV === 'local';

module.exports = function makeWebpackConfig() {
    const config = {};

    config.entry = isTest ? void 0 : {
        app: './src/index.js'
    };

    config.output = isTest ? {} : {
        path: __dirname + '/dist',
        publicPath: isLocal ? 'http://localhost:8080/' : '/',
        filename: isLocal ? '[name].bundle.js' : '[name].[hash].js',
        chunkFilename: isLocal ? '[name].bundle.js' : '[name].[hash].js'
    };

    if (isTest) {
        config.devtool = 'inline-source-map';
    } else if (isLocal) {
        config.devtool = 'eval-source-map';
    } else {
        config.devtool = 'source-map';
    }

    config.module = {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.scss$/,
            use: [{loader: 'style-loader'}, {loader: 'css-loader'}, {loader: 'sass-loader-once'}],
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: isTest ? 'null-loader' : ExtractTextPlugin.extract({
                fallbackLoader: 'style-loader',
                loader: [
                    {loader: 'css-loader', query: {sourceMap: true}},
                    {loader: 'postcss-loader'}
                ]
            })
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            loader: 'file-loader'
        }, {
            test: /\.html$/,
            loader: 'raw-loader'
        }]
    };

    if (isTest) {
        config.module.rules.push({
            enforce: 'pre',
            test: /\.js$/,
            exclude: [
                /node_modules/,
                /\.spec\.js$/
            ],
            loader: 'istanbul-instrumenter-loader',
            query: {
                esModules: true
            }
        });
    }

    config.plugins = [
        new CleanWebpackPlugin(['dist']),
        new webpack.LoaderOptionsPlugin({
            test: /\.scss$/i,
            options: {
                postcss: {
                    plugins: [autoprefixer]
                }
            }
        })
    ];

    if (!isTest) {
        config.plugins.push(
            new HtmlWebpackPlugin({
                template: './src/index.html',
                inject: 'body',
                isProd: !isLocal
            }),
            new ExtractTextPlugin({
                filename: 'css/[name].css',
                disable: isLocal,
                allChunks: true
            })
        );

        if (!isLocal) {
            config.plugins.push(
                new webpack.NoEmitOnErrorsPlugin(),
                new webpack.optimize.UglifyJsPlugin({
                    mangle: false
                }),
                new webpack.optimize.AggressiveMergingPlugin(),
                new CopyWebpackPlugin([
                    {from: __dirname + '/src/assets', to: 'assets'}
                ])
            );
        }
    }

    config.devServer = {
        contentBase: './src',
        stats: 'minimal',
        port: 8080,
        historyApiFallback:{
            index: 'http://localhost:8080/'
        }
    };

    return config;
}();
