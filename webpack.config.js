var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var srcDir = path.resolve(process.cwd(), 'assets');

function getEntry () {
  var jsPath = path.resolve(srcDir,'js/app');
  var dirs = fs.readdirSync(jsPath);
  var matchs = [], files = {};
  dirs.forEach(function (item) {
    matchs = item.match(/(.+)(_entry)\.js$/);
  // console.log(matchs);
    if (matchs) {
      files[matchs[1]+matchs[2]] = path.resolve(srcDir, 'js/app', item);
    }
  });
  // console.log(JSON.stringify(files));
  return files;
}

module.exports = {
  devtool: "source-map",
  entry: getEntry(),
  output: {
    path: path.join(__dirname, 'assets/dist/js/'),
    // publicPath: 'assets/dist/js/',
    filename: "[name].js"
  },
  module: {
    loaders: [
      { test: require.resolve(srcDir + '/js/common/angular/angular.js'), loader: "exports?window.angular" },
      { test: require.resolve(srcDir + '/js/app/util.js'), loader: "exports?window.util" },
      { test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  },
  resolve: {
    alias: {
      angular: srcDir + '/js/common/angular/angular.js',
      cookie: srcDir + '/js/common/cookie/cookie.js',
      util: srcDir + '/js/app/util.js'
      // _: srcDir + '/js/common/underscore/1.6.0/underscore.min.js'
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      angular: 'angular',
      util: 'util'
      // cookie: 'cookie'
      // _: '-'
    }),
    new CommonsChunkPlugin('common.js'),
    //new CommonsChunkPlugin("angular-underscore.js", ["angular", "underscore"]),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  // externals: {
  //   'angular': true
  // }
}