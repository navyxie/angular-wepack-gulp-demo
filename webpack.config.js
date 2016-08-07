var path = require('path');
var fs = require('fs');
require('es6-promise').polyfill();

var webpack = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');


var srcDir = path.resolve(process.cwd(), 'assets');

//生成version文件
function revManifest() {
    this.plugin('done', function (stats) {
        stats = stats.compilation.getStats().toJson({
            hash: true,
            publicPath: true,
            assets: true,
            chunks: false,
            modules: false,
            source: false,
            errorDetails: false,
            timings: false
        });

        var json = {}, chunk;
        for (var key in stats.assetsByChunkName) {
            if (stats.assetsByChunkName.hasOwnProperty(key)) {
                chunk = stats.assetsByChunkName[key];
                json[key + '.js'] = chunk[0];
            }
        }

        fs.writeFileSync(
            path.join(__dirname, 'rev-manifest.json'),
            JSON.stringify(json, null, 2)
        );
    });
}

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

var entry = getEntry();
entry['cookie__'] = ['cookie','_'];

module.exports = {
  // devtool: "source-map",//开发的时候设置为eval
  devtool: "eval",//开发的时候设置为eval
  entry: entry,
  output: {
    path: path.join(__dirname, 'assets/dist/js/'),
    // publicPath: 'assets/dist/js/',
    // filename: "[name].[chunkhash].js"
    filename: "[name].js"
  },
  module: {
    loaders: [
      { test: require.resolve(srcDir + '/js/common/angular/angular.js'), loader: "exports?window.angular" },
      { test: require.resolve(srcDir + '/js/app/util.js'), loader: "exports?window.util" },
      //{ test: /\.css$/, loader: 'style-loader!css-loader'},
      { test: /\.css$/,loader: ExtractTextPlugin.extract("style-loader", "css-loader")},//不打包css
    ],
    noParse: [srcDir + '/js/common/angular/angular.js',srcDir + '/js/common/cookie/cookie.js',srcDir + '/js/common/underscore/1.6.0/underscore.js']
  },
  resolve: {
    alias: {
      angular: srcDir + '/js/common/angular/angular.js',
      cookie: srcDir + '/js/common/cookie/cookie.js',
      _: srcDir + '/js/common/underscore/1.6.0/underscore.js',
      util: srcDir + '/js/app/util.js'
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      angular: 'angular',
      util: 'util',
      cookie: 'cookie',
      _: '_'
    }),
    new CommonsChunkPlugin('common.js'),
    // new CommonsChunkPlugin('common.[hash].js'),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin("[name].css"),//不打包css
    // function () {
    //   revManifest.call(this);
    // }
  ],
  // externals: {
  //   'angular': true
  // }
}