'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// external deps should go in vendor.js instead of main.js
// this determines whether the source file is external or not
function isVendor(module) {
  var userRequest = module.userRequest;
  if (typeof userRequest !== 'string') {
    return false;
  }
  // handle paths like ... node_modules/some-loader.js!app.css
  var parts = userRequest.split('!');
  var path = parts[parts.length - 1];
  return path.indexOf('node_modules') >= 0;
}

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: [
        path.join(__dirname, 'app/index.js')
    ],
    output: {
        path: path.join(__dirname, '/build/'),
        filename: '[name].js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: 'app/index.tpl.html',
          title: 'How Long Until?',
          inject: 'body',
          filename: 'index.html'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js',
            minChunks: isVendor
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.IgnorePlugin(/^\.\/(lang|locale)$/, /moment$/),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: { presets: [ [ 'es2015', { 'modules': false } ], 'react', 'stage-2' ] }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    }
};